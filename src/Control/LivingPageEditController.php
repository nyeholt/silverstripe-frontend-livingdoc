<?php

namespace Symbiote\Frontend\LivingPage\Control;

use Exception;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Storage\AssetStore;
use SilverStripe\Assets\Upload;
use SilverStripe\CMS\Controllers\ModelAsController;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Security\PermissionFailureException;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\SecurityToken;
use SilverStripe\SiteConfig\SiteConfig;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Parsers\ShortcodeParser;
use SilverStripe\View\Requirements;
use Symbiote\Frontend\LivingPage\Extension\FakeUploadValidator;
use Symbiote\Frontend\LivingPage\Extension\LivingPageExtension;
use Symbiote\Frontend\LivingPage\Model\CompoundComponent;
use Symbiote\Frontend\LivingPage\Model\PageComponent;
use Symbiote\Prose\ProseController;

class LivingPageEditController extends Controller implements PermissionProvider
{
    const EDIT_PAGES = 'EDIT_LIVING_PAGES';

    private static $allowed_actions = [
        'edit' => self::EDIT_PAGES,
        'LivingForm' => self::EDIT_PAGES,
        'pastefile' => self::EDIT_PAGES,
        'renderembed' => self::EDIT_PAGES,
    ];

    protected $page = null;

    protected function getPage()
    {
        Versioned::set_stage(Versioned::DRAFT);

        if ($this->page) {
            return $this->page;
        }
        $pageId = $this->getRequest()->param('ID');

        if (!$pageId) {
            $pageId = $this->getRequest()->postVar('ID');
        }

        if ($pageId) {
            $this->page = SiteTree::get()->byID($pageId);

            if ($this->page) {
                if (!$this->page->canEdit()) {
                    throw new PermissionFailureException("Cannot edit this page");
                }
            }
        }

        if (!$this->page) {
            return $this->httpError(404, "Page not found");
        }

        return $this->page;
    }

    public function Link($action = '')
    {
        return Controller::join_links('page-editor', $action);
    }

    public function onBeforeInit()
    {
        // if ($this->getRequest()->getVar('edit') && $page->canEdit()) {
        //     // needs to be done this way to ensure Stage mode is set via the session
        //     // otherwise it'll default to live because we're on the frontend

        //     Versioned::set_stage(Versioned::DRAFT);

        //     // trigger edit mode, so redirect works
        //     if ($this->getEditMode()) {
        //         return $this->redirect($page->Link());
        //     }
        // }
    }

    public function edit()
    {
        $page = $this->getPage();

        if (!$page) {
            return $this->httpError(404);
        }

        if (!$page->canEdit()) {
            return $this->httpError(403);
        }

        // at the top so it can be overridden by user css
        // Requirements::css('nyeholt/silverstripe-frontend-livingdoc: app/dist/css/base.css');

        // // same with any highlight css needed
        // Requirements::css('nyeholt/silverstripe-frontend-livingdoc: javascript/highlight/googlecode.css');

        if ($this->getRequest()->getVar('edit') === 'stop') {
            $this->endEditing();
            return $this->redirect($page->Link());
        }

        if (!strlen($page->PageStructure)) {
            $defaultStructure = LivingPageExtension::config()->default_page;
            $configObject = SiteConfig::current_site_config();

            if ($configObject && strlen($configObject->DefaultStructure)) {
                $defaultStructure = $configObject->DefaultStructure;
            }

            $page->PageStructure = json_encode($defaultStructure);
        }

        Versioned::set_stage(Versioned::DRAFT);

        Requirements::clear();

        $this->includeEditingRequirements();

        return $this->customise([
            'LivingDocsConfig' => json_encode($this->getLivingDocsConfig()),
            'PageLink' => Controller::join_links($page->Link(), "?page-edit=1"),
        ])->renderWith('LivingPage_editor');

        $ctrl = ModelAsController::controller_for($page);

        $content = $ctrl->render([
            'EditMode' => $this->getEditMode(),
            'LivingDocsConfig' => json_encode($this->getLivingDocsConfig()),
            'LivingForm' => $this->LivingForm()
        ]);

        return $content;
    }

    public function includeEditingRequirements()
    {
        $record = $this->getPage();

        $design = json_decode($record->PageStructure, true);

        // check if we're incorrectly nested; supports legacy structures
        if (!isset($design['data']) && isset($design['content'])) {
            $design = ['data' => $design];
        }

        // create a default page data
        if (!$design) {
            $design = [
                'data' => LivingPageExtension::config()->default_page
            ];
        }

        // make sure there's a design version
        if (!isset($design['data']['design']['version'])) {
            $design['data']['design'] = [
                'name' => 'bootstrap3',
                "version" => "0.0.1",
            ];
        }

        // converts all nodes to current content state where necessary (in particular, embed items)
        $newContent = [];
        foreach ($design['data']['content'] as $component) {
            $newContent[] = $this->convertShortcodeNodes($component);
        }

        $design['data']['content'] = $newContent;

        $record->extend('updateLivingDesign', $design);

        $config = $this->getLivingDocsConfig();

        Requirements::block(THIRDPARTY_DIR . '/jquery/jquery.js');

        Requirements::javascript('nyeholt/silverstripe-frontend-livingdoc: app/dist/main.js');
        Requirements::css('nyeholt/silverstripe-frontend-livingdoc: app/dist/styles.css');
        Requirements::css('nyeholt/silverstripe-frontend-livingdoc: app/dist/main.css');

        Requirements::javascript($config['designFile']);
    }

    protected $livingConfig;

    public function getLivingDocsConfig()
    {
        if ($this->livingConfig) {
            return $this->livingConfig;
        }

        $record = $this->getPage();

        $design = json_decode($record->PageStructure, true);

        // check if we're incorrectly nested; supports legacy structures
        if (!isset($design['data']) && isset($design['content'])) {
            $design = ['data' => $design];
        }

        // create a default page data
        if (!$design) {
            $design = [
                'data' => LivingPageExtension::config()->default_page
            ];
        }

        // make sure there's a design version
        if (!isset($design['data']['design']['version'])) {
            $design['data']['design'] = [
                'name' => 'bootstrap3',
                "version" => "0.0.1",
            ];
        }

        $designName = isset($design['data']['design']['name']) ? $design['data']['design']['name'] : '';

        $theme = $record->ThemeOverride ? $record->ThemeOverride : SiteConfig::current_site_config()->LivingPageTheme;

        // explicit binding because I'm too lazy right now to add yet another extension
        if ($theme) {
            if ($theme != $designName) {
                // go through _all_ components and update the design name
                $design['data']['content'] = $record->updateDesignName($designName, $theme, $design['data']['content']);
            }
            $designName = $theme;
            $design['data']['design']['name'] = $theme;
        }

        // converts all nodes to current content state where necessary (in particular, embed items)
        $newContent = [];
        foreach ($design['data']['content'] as $component) {
            $newContent[] = $this->convertShortcodeNodes($component);
        }

        $design['data']['content'] = $newContent;

        $record->extend('updateLivingDesign', $design);

        $designOptions = LivingPageExtension::config()->living_designs;


        $designFile = $designOptions[$designName];

        if (!$designFile) {
            throw new Exception("Missing design for $designName");
        }

        $designFile = ModuleResourceLoader::singleton()->resolvePath($designFile);

        $pageComponents = Versioned::get_by_stage(PageComponent::class, Versioned::LIVE)->filter([
            'IsActive' => 1,
            'ClassName' => PageComponent::class,
        ])->toArray();

        $pageComponents = array_filter($pageComponents, function ($item) use ($designName) {
            $themes = $item->Themes->getValues();
            if ($themes && count($themes)) {
                $has = array_search($designName, $themes);
                return $has;
            }
        });

        $components = [];
        $componentProperties = [];

        foreach ($pageComponents as $component) {
            $componentData = $component->forDesign($designName);
            $components[] = $componentData['component'];
            if (isset($componentData['componentProperties'])) {
                $componentProperties[] = $componentData['componentProperties'];
            }
        }


        $compounds = Versioned::get_by_stage(CompoundComponent::class, Versioned::LIVE)->filter([
            'IsActive' => 1,
        ])->toArray();
        $compounds = array_filter($compounds, function ($item) use ($designName) {
            $themes = $item->Themes->getValues();
            if ($themes && count($themes)) {
                $has = array_search($designName, $themes);
                return $has;
            }
        });
        $compounds = array_map(function ($item) use ($designName) {
            return $item->asComponent($designName);
        }, $compounds);

        $this->livingConfig = [
            'pageId'  => $record->ID,
            'pageLink' => $record->hasMethod('RelativeLink') ? $record->RelativeLink() : '',
            'pageStructure' => $design,
            'extraComponents' => $components,
            'extraProperties' => $componentProperties,
            'compounds' => $compounds,
            'designFile' => $designFile,
            'endpoints' => [
                'paste' => $this->Link('pastefile/' . $record->ID),
                'upload' => $this->Link('uploadfile/' . $record->ID),
                // the following aren't used at present, instead we're using a ContentSource that hooks back to the
                // SilverStripe form
                'save' => $this->Link('save'),
                'publish' => $this->Link('publish'),
                'workflow' => '',
            ],
            'showGrid' => $record->ShowGrid ? true : false,
            'allowLayoutEditing' => $record->AllowLayoutEditing ? true : false,
        ];

        $record->PageStructure = json_encode($design);

        return $this->livingConfig;
    }

    /**
     * Converts any embeditem shortcode into its current state representation
     *
     * @param array $component
     */
    protected function convertShortcodeNodes(&$component)
    {
        $page = $this->getPage();

        if (isset($component['identifier']) && strpos($component['identifier'], 'embeddeditem') && isset($component['content'])) {
            $dataAttrs = isset($component['data']['data_attributes']) ? $component['data']['data_attributes'] : [];
            foreach ($component['content'] as $name => $props) {
                $shortcodeParams = isset($dataAttrs[$name]) ? $dataAttrs[$name] : null;
                if (isset($props['attrs'])) {
                    $shortcodeParams = json_decode($props['attrs'], true);
                }
                $shortCode = $page->shortcodeFor($props['source'], $shortcodeParams);
                if ($shortCode) {
                    try {
                        $props['content'] = ShortcodeParser::get_active()->parse($shortCode);
                    } catch (Exception $e) {
                        $props['content'] = Director::isDev() ? "Failed parsing shortcode" : "";
                    }
                }
                $component['content'][$name] = $props;
            }
        }

        if (isset($component['data']['data_attributes'])) {
            foreach ($component['data']['data_attributes'] as $attr => $vals) {
                if (isset($vals['data-imageid']) && $vals['data-imageid'] > 0) {
                    // lookup the file and grant
                    $file = File::get()->byID($vals['data-imageid']);
                    if ($file && $file->canView()) {
                        $file->grantFile();
                    }
                }
            }
        }

        if (isset($component['containers'])) {
            foreach ($component['containers'] as $name => $items) {
                $newItems = [];
                foreach ($component['containers'][$name] as $subComponent) {
                    $newItems[] = $this->convertShortcodeNodes($subComponent);
                }
                $component['containers'][$name] = $newItems;
            }
        }



        return $component;
    }

    public function renderembed()
    {
        $editing = $this->getPage();
        if (!$editing || !$editing->canEdit()) {
            return $this->httpError('403');
        }
        $item      = $this->getRequest()->getVar('embed');
        $available = $editing->availableShortcodes();

        if (isset($available[$item])) {
            $shortcodeParams = $this->getRequest()->getVar('attrs') ?
                json_decode($this->getRequest()->getVar('attrs'), true) : [];

            $shortcodeStr = $editing->shortcodeFor($item, $shortcodeParams);
            return ShortcodeParser::get_active()->parse($shortcodeStr);
        }
    }

    /**
     * Are we in edit mode?
     */
    public function getEditMode()
    {
        $page = $this->getPage();

        if (!$page->canEdit()) {
            $this->endEditing();
            return false;
        }

        $stage = Versioned::get_stage();
        if ($stage != Versioned::DRAFT) {
            return false;
        }

        // one-off preview that does _not_ stop edit mode
        if ($this->getRequest()->getVar('preview')) {
            return false;
        }

        return true;
    }

    public function endEditing()
    {
        $this->getRequest()->getSession()->clear('EditMode');
        Versioned::set_stage(Versioned::LIVE);
    }

    public function LivingForm()
    {
        if (!$this->getEditMode()) {
            return;
        }

        $record = $this->getPage();
        $embeds = $record->availableShortcodes();

        $fields = FieldList::create([
            HiddenField::create('stage', "Stage", "Stage"),
            HiddenField::create('PageStructure', "JSON structure"),
            HiddenField::create('Content', "HTML structure"),
            HiddenField::create('Embeds', 'Content embeds', json_encode($embeds)),
            HiddenField::create('ID', 'ID', $record->ID),
            HiddenField::create('EmbedLink', 'Embed link', '/__prose/rendershortcode')
        ]);

        $btnCls = function ($extra = 'btn-secondary') {
            return 'btn btn-sm ' . $extra;
        };

        $actions = FieldList::create([
            FormAction::create('save', 'Save')->setUseButtonTag(true)->addExtraClass($btnCls('btn-primary')),
        ]);

        if ($record->canPublish()) {
            $actions->push(FormAction::create('publish', 'Publish')->setUseButtonTag(true)->addExtraClass($btnCls()));
        }

        if ($record->hasExtension('WorkflowApplicable')) {
            $definitions = singleton('WorkflowService')->getDefinitionsFor($record);
            if ($definitions && count($definitions)) {
                $actions->push(
                    FormAction::create('workflow', 'Workflow')
                        ->setUseButtonTag(true)
                        ->addExtraClass('link-action ' . $btnCls())
                        ->setAttribute('data-link', $record->CMSEditLink())
                );
            }
        }

        $actions->push(
            FormAction::create('preview', 'View')
                ->setUseButtonTag(true)
                ->addExtraClass('link-action ' . $btnCls())
                ->setAttribute('data-link', $record->Link() . '&preview=1')
        );
        $actions->push(
            FormAction::create('live', 'Done')
                ->setUseButtonTag(true)
                ->addExtraClass('link-action ' . $btnCls())
                ->setAttribute('data-link', str_replace('stage=Stage', '', $record->Link()))
        );

        $form = Form::create($this->owner, 'LivingForm', $fields, $actions);
        // $form->setFormAction(substr($form->FormAction(), 0, strpos($form->FormAction(), "?")));
        $form->loadDataFrom($record);
        return $form;
    }

    public function save($data, Form $form, $request)
    {
        $record = $this->getPage();

        $dummyHtmlField = HTMLEditorField::create('Content', 'Content', isset($data['Content']) ? $data['Content'] : '');
        $form->Fields()->replaceField('Content', $dummyHtmlField);
        $form->saveInto($record);

        $this->getResponse()->addHeader('Content-type', 'application/json');
        if ($record->write()) {
            $this->getResponse()->addHeader('Content-type', 'application/json');
            return json_encode(['status' => 'success']);
        }
        return $this->httpError(500);
    }

    public function pastefile(HTTPRequest $request)
    {
        Versioned::set_stage(Versioned::DRAFT);

        $page = $this->getPage();

        if (class_exists(ProseController::class)) {
            $alt = ProseController::create();
            $this->getResponse()->addHeader('Content-Type', 'application/json');
            return $alt->pastefile($request);
        }
        if (!SecurityToken::inst()->checkRequest($request)) {
            return $this->httpError(403);
        }

        $raw = $request->postVar('rawData');

        $filename = $request->postVar('filename') ? $request->postVar('filename') . '.png' : $page->Title . '-upload.png';

        $response = ['success' => false];

        if (substr($raw, 0, strlen('data:image/png;base64,')) === 'data:image/png;base64,') {
            $base64 = substr($raw, strlen('data:image/png;base64,'));

            $tempFilePath = tempnam(TEMP_FOLDER, 'png');
            file_put_contents($tempFilePath, base64_decode($base64));

            $tempFile = [
                'error' => '',
                'size' => strlen($raw),
                'name' => $filename,
                'tmp_name' => $tempFilePath
            ];

            $upload = Upload::create();
            $upload->setValidator(Injector::inst()->create(FakeUploadValidator::class));
            $upload->load($tempFile);
            $file = $upload->getFile();
            if ($file && $file->ID) {
                $response['url'] = $file->getAbsoluteURL();
                $response['name'] = $file->Title;
                $response['success'] = true;
                $response['id'] = $file->ID;
            } else {
                error_log("Failed uploading pasted image: " . print_r($upload->getErrors(), true));
            }
            if (file_exists($tempFilePath)) {
                @unlink($tempFilePath);
            }
        }

        $this->getResponse()->addHeader('Content-Type', 'application/json');
        return json_encode($response, JSON_PRETTY_PRINT);
    }

    public function publish($data, Form $form, $request)
    {
        $record = $this->getPage();

        if (!$record->canPublish()) {
            return $this->httpError(403);
        }

        // we're not recursive publish, because not all the images
        // get picked up as being part of the changeset
        $success = $record->publishRecursive();

        $content = $record->Content;

        $toPublish = [];
        if (preg_match_all('/\[file_link([^\]]+?)id=(["])?(?<id>\d+)\D/i', $content, $matches)) {
            foreach ($matches['id'] as $id) {
                $toPublish[] = (int) $id;
            }
        }

        if ($toPublish) {
            $files = File::get()->byIDs($toPublish);
            foreach ($files as $file) {
                $file->publishRecursive();
            }
        }


        $this->getResponse()->addHeader('Content-type', 'application/json');
        return json_encode(['status' => $success ? 'success' : 'fail']);
    }


    public function providePermissions()
    {
        return [
            self::EDIT_PAGES => [
                'name' => 'Edit Component Pages',
                'category' => 'Content permissions',
                'sort' => 2,
                'help' => 'Allows users to edit pages on the frontend'
            ]
        ];
    }
}
