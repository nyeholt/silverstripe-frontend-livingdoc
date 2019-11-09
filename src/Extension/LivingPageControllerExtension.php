<?php
namespace Symbiote\Frontend\LivingPage\Extension;

use Exception;
use SilverStripe\Assets\Upload;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Extension;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Security\Security;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Parsers\ShortcodeParser;
use SilverStripe\View\Requirements;

class LivingPageControllerExtension extends Extension
{
    private static $allowed_actions = array(
        'LivingForm',
        'pastefile',
        'renderembed'
    );

    public function onBeforeInit()
    {

        // at the top so it can be overridden by user css
        Requirements::css('frontend-livingdoc/css/base.css');

        // same with any highlight css needed
        Requirements::css('frontend-livingdoc/javascript/highlight/googlecode.css');

        if ($this->owner->getRequest()->getVar('edit') && !$this->owner->data()->canEdit()) {
            // redirect to login
            return Security::permissionFailure($this->owner);
        }

        if ($this->owner->getRequest()->getVar('edit') === 'stop') {
            $this->endEditing();
            return $this->owner->redirect($this->owner->data()->Link());
        }

        if (!strlen($this->owner->data()->PageStructure)) {
            $this->owner->data()->PageStructure = json_encode([
                'data' => LivingPageExtension::config()->default_page
            ]);
        }

        if ($this->owner->getRequest()->getVar('edit') && $this->owner->data()->canEdit()) {
            // needs to be done this way to ensure Stage mode is set via the session
            // otherwise it'll default to live because we're on the frontend

            Versioned::set_stage(Versioned::DRAFT);

            // trigger edit mode, so redirect works
            if ($this->getEditMode()) {
                return $this->owner->redirect($this->owner->data()->Link());
            }
        }
    }

    public function onAfterInit()
    {
        if (!$this->owner->getRequest()->getVar('edit') && $this->owner->data()->canEdit() && $this->getEditMode()) {
            $this->includeEditingRequirements();
        }
    }

    public function includeEditingRequirements() {
        // $record = $this->editingRecord();
            // needed to swap back to this; there's potential stage vs non-stage init issues here, but the
            // failover record setting later fails due to an SS bug
            $record = $this->owner->data();

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

            $designName    = $design['data']['design']['name'];
            // explicit binding because I'm too lazy right now to add yet another extension
            // if (class_exists(Multisites::class) && Multisites::inst()->getCurrentSite()->LivingPageTheme) {
            //     $siteThemeName = Multisites::inst()->getCurrentSite()->LivingPageTheme;
            //     if ($siteThemeName != $designName) {
            //         // go through _all_ components and update the design name
            //         $design['data']['content'] = $record->updateDesignName($designName, $siteThemeName, $design['data']['content']);
            //     }
            //     $designName = $siteThemeName;
            //     $design['data']['design']['name'] = $siteThemeName;
            // }

            // converts all nodes to current content state where necessary (in particular, embed items)
            $newContent = [];
            foreach ($design['data']['content'] as $component) {
                $newContent[] = $this->convertEmbedNodes($component);
            }

            $design['data']['content'] = $newContent;

            $this->owner->data()->extend('updateLivingDesign', $design);

            $config = $this->getLivingDocsConfig();


            Requirements::block(THIRDPARTY_DIR.'/jquery/jquery.js');

            Requirements::javascript('frontend-livingdoc/app/dist/main.js');
            Requirements::css('frontend-livingdoc/app/dist/main.css');
            Requirements::css('frontend-livingdoc/css/living-frontend.css');


            Requirements::javascript('frontend-livingdoc/javascript/showdown/showdown.min.js');
            Requirements::javascript('frontend-livingdoc/javascript/ace/ace.min.js');
            Requirements::javascript('frontend-livingdoc/javascript/ace/mode-markdown.js');
            Requirements::javascript('frontend-livingdoc/javascript/ace/mode-html.js');
            Requirements::javascript('frontend-livingdoc/javascript/highlight/highlight.min.js');

            Requirements::javascript($config['designFile']);
    }

    protected $livingConfig;

    public function getLivingDocsConfig() {
        if ($this->livingConfig) {
            return $this->livingConfig;
        }

        $record = $this->owner->data();

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


        // explicit binding because I'm too lazy right now to add yet another extension
        // if (class_exists(Multisites::class) && Multisites::inst()->getCurrentSite()->LivingPageTheme) {
        //     $siteThemeName = Multisites::inst()->getCurrentSite()->LivingPageTheme;
        //     if ($siteThemeName != $designName) {
        //         // go through _all_ components and update the design name
        //         $design['data']['content'] = $record->updateDesignName($designName, $siteThemeName, $design['data']['content']);
        //     }
        //     $designName = $siteThemeName;
        //     $design['data']['design']['name'] = $siteThemeName;
        // }

        // converts all nodes to current content state where necessary (in particular, embed items)
        $newContent = [];
        foreach ($design['data']['content'] as $component) {
            $newContent[] = $this->convertEmbedNodes($component);
        }

        $design['data']['content'] = $newContent;

        $this->owner->data()->extend('updateLivingDesign', $design);

        $designOptions = LivingPageExtension::config()->living_designs;

        $designName    = $design['data']['design']['name'];
        $designFile = $designOptions[$designName];

        if (!$designFile) {
            throw new Exception("Missing design for $designName");
        }

        $this->livingConfig = [
            'pageId'  => $record->ID,
            'pageLink' => $record->hasMethod('RelativeLink') ? $record->RelativeLink() : '',
            'pageStructure' => $design,
            'designFile' => $designFile,
            'endpoints' => [
                'paste' => $this->owner->Link('pastefile'),
                // the following aren't used at present, instead we're using a ContentSource that hooks back to the
                // SilverStripe form
                'save' => $this->owner->Link('save'),
                'publish' => $this->owner->Link('publish'),
                'workflow' => '',
            ]
        ];

        $record->PageStructure = json_encode($design);

        return $this->livingConfig;
    }

    /**
     * Converts any embeditem shortcode into its current state representation
     *
     * @param array $component
     */
    protected function convertEmbedNodes(&$component)
    {
        if (isset($component['identifier']) && strpos($component['identifier'], 'embeddeditem') && isset($component['content'])) {
            $dataAttrs = isset($component['data']['data_attributes']) ? $component['data']['data_attributes'] : [];
            foreach ($component['content'] as $name => $props) {
                $shortcodeParams = isset($dataAttrs[$name]) ? $dataAttrs[$name] : null;
                $shortCode = $this->owner->data()->shortcodeFor($props['source'], $shortcodeParams);
                if ($shortCode) {
                    $props['content'] = ShortcodeParser::get_active()->parse($shortCode);
                }
                $component['content'][$name] = $props;
            }
        }
        if (isset($component['containers'])) {
            foreach ($component['containers'] as $name => $items) {
                $newItems = [];
                foreach ($component['containers'][$name] as $subComponent) {
                    $newItems[] = $this->convertEmbedNodes($subComponent);
                }
                $component['containers'][$name] = $newItems;
            }
        }

        return $component;
    }

    public function renderembed()
    {
        $editing = $this->editingRecord();
        if (!$editing || !$editing->canEdit()) {
            return $this->owner->httpError('403');
        }
        $item      = $this->owner->getRequest()->getVar('embed');
        $available = $this->owner->data()->availableShortcodes();

        if (isset($available[$item])) {
            $shortcodeParams = $this->owner->getRequest()->getVar('attrs') ?
                json_decode($this->owner->getRequest()->getVar('attrs'), true) : [];

            $shortcodeStr = $this->owner->data()->shortcodeFor($item, $shortcodeParams);
            return ShortcodeParser::get_active()->parse($shortcodeStr);
        }
    }

    protected function editingRecord()
    {
        Versioned::set_stage(Versioned::DRAFT);
        $recordClass = $this->owner->data()->ClassName;
        return $recordClass::get()->byID($this->owner->data()->ID);
    }

    public function getEditMode()
    {
        if (!$this->owner->data()->canEdit()) {
            $this->endEditing();
            return false;
        }

        $stage = Versioned::get_stage();
        if ($stage != Versioned::DRAFT) {
            return false;
        }

        // one-off preview that does _not_ stop edit mode
        if ($this->owner->getRequest()->getVar('preview')) {
            return false;
        }
        if ($this->owner->getRequest()->getVar('edit')) {
            $this->owner->getRequest()->getSession()->set('EditMode', 1);
        }

        $edit = ((int) $this->owner->getRequest()->getSession()->get('EditMode')) > 0;
        return $edit;
    }

    public function endEditing()
    {
        $this->owner->getRequest()->getSession()->clear('EditMode');
        Versioned::set_stage(Versioned::LIVE);
    }

    public function LivingForm()
    {
        if (!$this->getEditMode()) {
            return;
        }

        $record = $this->owner->data();
        $embeds = $record->availableShortcodes();

        $fields = FieldList::create([
                HiddenField::create('stage', "Stage", "Stage"),
                HiddenField::create('PageStructure', "JSON structure"),
                HiddenField::create('Content', "HTML structure"),
                HiddenField::create('Embeds', 'Content embeds', json_encode($embeds)),
                HiddenField::create('EmbedLink', 'Embed link', $record->Link('renderembed'))
        ]);

        $actions = FieldList::create([
                FormAction::create('save', 'Save')->setUseButtonTag(true),
        ]);

        if ($record->canPublish()) {
            $actions->push(FormAction::create('publish', 'Pub')->setUseButtonTag(true));
        }

        if ($record->hasExtension('WorkflowApplicable')) {
            $definitions = singleton('WorkflowService')->getDefinitionsFor($record);
            if ($definitions && count($definitions)) {
                $actions->push(
                    FormAction::create('workflow', 'Workflow')
                        ->setUseButtonTag(true)
                        ->addExtraClass('link-action')
                        ->setAttribute('data-link', $record->CMSEditLink())
                );
            }
        }

        $actions->push(
            FormAction::create('preview', 'View')
                ->setUseButtonTag(true)
                ->addExtraClass('link-action')
                ->setAttribute('data-link', $record->Link() . '?preview=1&stage=Stage')
        );
        $actions->push(FormAction::create('live', 'Done')->setUseButtonTag(true));

        $form = Form::create($this->owner, 'LivingForm', $fields, $actions);
        // $form->setFormAction(substr($form->FormAction(), 0, strpos($form->FormAction(), "?")));
        $form->loadDataFrom($record);
        return $form;
    }

    public function save($data, Form $form, $request)
    {
        if (!$this->owner->data()->canEdit()) {
            return $this->owner->httpError(403);
        }

        $record = $this->editingRecord();

        $dummyHtmlField = HTMLEditorField::create('Content', 'Content', isset($data['Content']) ? $data['Content'] : '');
        $form->Fields()->replaceField('Content', $dummyHtmlField);
        $form->saveInto($record);

        $this->owner->getResponse()->addHeader('Content-type', 'application/json');
        if ($record->write()) {
            $this->owner->getResponse()->addHeader('Content-type', 'application/json');
            return json_encode(['status' => 'success']);
        }
        return $this->owner->httpError(500);
    }

    public function pastefile(HTTPRequest $request) {
        if (!SecurityToken::inst()->checkRequest($request)) {
            return $this->owner->httpError(403);
        }

        $raw = $request->postVar('rawData');

        $filename = $request->postVar('filename') ? $request->postVar('filename') . '.png' : $this->owner->data()->Title . '-upload.png';

        $response = ['success' => true];

        if (substr($raw, 0, strlen('data:image/png;base64,')) === 'data:image/png;base64,') {
            $base64 = substr($raw, strlen('data:image/png;base64,'));

            $tempFilePath = tempnam(TEMP_FOLDER, 'png');
            file_put_contents($tempFilePath, base64_decode($base64));

            $tempFile = [
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
            } else {
                error_log("Failed uploading pasted image: " . print_r($upload->getErrors(), true));
            }
            if (file_exists($tempFilePath)) {
                @unlink($tempFile);
            }
        }

        $this->owner->getResponse()->addHeader('Content-Type', 'application/json');
        return json_encode($response, JSON_PRETTY_PRINT);
    }

    public function publish($data, Form $form, $request)
    {
        $record = $this->editingRecord();

        if (!$record->canPublish()) {
            return $this->owner->httpError(403);
        }

        $success = $record->doPublish();
        $this->owner->getResponse()->addHeader('Content-type', 'application/json');
        return json_encode(['status' => $success ? 'success' : 'fail']);
    }
}
