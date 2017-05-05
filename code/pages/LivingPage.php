<?php

use \Wa72\HtmlPageDom\HtmlPageCrawler;


/**
 * 
 *
 * @author marcus
 */
class LivingPage extends Page
{
    private static $db = [
        'PageStructure' => 'Text',
        'Shortcodes'        => 'MultiValueField',
    ];

    private static $living_designs = [
        'bootstrap3'        => 'frontend-livingdoc/javascript/livingdocs/bootstrap-design.js',
    ];


    private static $default_design_css = '';
    
    private static $default_page = array(
        'content' => [
            [
                'component' => 'p',
                'content' => [
                    'text' => "Edit away"
                ]
            ],
        ],
        'design' => [
            'name' => 'bootstrap3',
            "version" => "0.0.1",
        ]
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $link = '<div class="field"><a href="' . $this->Link() . '?edit=1" target="_blank">Edit this page in-place</a></div>';
        $literalContent = LiteralField::create('Content', $link);
        $fields->replaceField('Content', $literalContent);

        $pageOptions = [
            KeyValueField::create('Shortcodes', 'Available shorcodes')
        ];
        if (Permission::check('ADMIN')) {
            $pageOptions[] = TextareaField::create('PageStructure', 'Raw structure');
        }

        $toggle = ToggleCompositeField::create('LivingPageContent', 'Page options', $pageOptions);
        $fields->addFieldToTab('Root.Main', $toggle);

        return $fields;
    }


    public function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if (!$this->PageStructure) {
            $this->PageStructure = json_encode(self::config()->default_page);
        }

        // convert relevant bits of the content from the data-embed-source tag
        // into shortcodes for runtime translation
        // https://github.com/wasinger/htmlpagedom

        if (strlen($this->Content)) {
            $c = HtmlPageCrawler::create($this->Content);
            $toreplace = $c->filter('[data-embed-source-object]');

            foreach ($toreplace as $replaceNode) {
                $cnode = HtmlPageCrawler::create($replaceNode);
                $replaceWith = $cnode->attr('data-embed-source-object');
                $replaceWith = $this->shortcodeFor($replaceWith);
                $cnode->text("$replaceWith");
                $text = $cnode->text();
            }

            $this->Content = $c->saveHTML();
        }
    }

    public function shortcodeFor($label) {
        $items = $this->Shortcodes->getValues();
        return isset($items[$label]) ? $items[$label] : null;
    }

    public static function embeditem_handler($arguments, $content = null, $parser = null) {
        return print_r($arguments, true);
    }

    public static function childlist_handler($arguments, $content = null, $parser = null) {
        $page = null;
        if (isset($arguments['id'])) {
            $page = Page::get()->byID($arguments['id']);
        }

        if (!$page) {
            $controller = Controller::has_curr() ? Controller::curr() : null;
            $page = $controller instanceof ContentController ? $controller->data() : null;
        }

        if ($page) {
            return $page->renderWith('ListingPage_ChildListing');
        }
    }
}

class LivingPage_Controller extends Page_Controller
{
    private static $allowed_actions = array(
        'LivingForm',
        'renderembed'
    );

    public function init() {
		
        // at the top so it can be overridden by user css
        Requirements::css('frontend-livingdoc/javascript/livingdocs/css/base.css');

        if ($this->getRequest()->getVar('edit') && !$this->data()->canEdit()) {
            // redirect to login
            return Security::permissionFailure($this);
        }

        if ($this->getRequest()->getVar('edit') === 'stop') {
            $this->endEditing();
            return $this->redirect($this->data()->Link());
        }

        if (!strlen($this->data()->PageStructure)) {
            $this->data()->PageStructure = json_encode([
                'data' => LivingPage::config()->default_page
            ]);
        }

//        $this->data()->PageStructure = json_encode([
//                'data' => LivingPage::config()->default_page
//            ]);

        if ($this->getRequest()->getVar('edit') && $this->data()->canEdit()) {
            Versioned::reading_stage('Stage');

            // trigger edit mode, so redirect works
            if ($this->getEditMode()) {
                return $this->redirect($this->data()->Link());
            }
        }

        parent::init();


        if (!$this->getRequest()->getVar('edit') && $this->data()->canEdit() && $this->getEditMode()) {
            $record = $this->editingRecord();

            $design = json_decode($record->PageStructure, true);

            // check if we're incorrectly nested; supports legacy structures
            if (!isset($design['data']) && isset($design['content'])) {
                $design = ['data' => $design];
            }

            // create a default page data
            if (!$design) {
                $design = [
                    'data' => LivingPage::config()->default_page
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
            if (class_exists('Multisites') && Multisites::inst()->getCurrentSite()->LivingPageTheme) {
                $design['data']['design']['name'] = Multisites::inst()->getCurrentSite()->LivingPageTheme;
            }

            // @todo(Marcus) Add in logic that will update any embed items to the latest
            // shortcoded display of things... OR we do it in JS using ajax requests... ? 
            // $this->updateShortcodeDisplay


            $this->data()->extend('updateLivingDesign', $design);

            $designName = $design['data']['design']['name'];
            $designOptions = LivingPage::config()->living_designs;
            
            $designFile = $designOptions[$designName];
            if (!$designFile) {
                throw new Exception("Missing design for $designName");
            }

            $record->PageStructure = json_encode($design);
            
            $this->failover = $record;
            $this->dataRecord = $record;

            Requirements::block(THIRDPARTY_DIR.'/jquery/jquery.js');

            Requirements::javascript(THIRDPARTY_DIR.'/jquery-form/jquery.form.js');

            // will bind $ if not already bound, so that livingdocs doesn't die
            Requirements::javascript('frontend-livingdoc/javascript/living-frontend.js');

            Requirements::javascript('frontend-livingdoc/javascript/livingdocs/editable.js');
            Requirements::javascript('frontend-livingdoc/javascript/livingdocs/livingdocs-engine.js');
            Requirements::javascript($designFile);

            Requirements::css('frontend-livingdoc/css/living-frontend.css');
        }
	}

    public function renderembed() {
        $item = $this->getRequest()->getVar('embed');
        $available = $this->data()->Shortcodes->getValues();

        if (isset($available[$item])) {
            $shortcodeStr = $available[$item];
            return ShortcodeParser::get_active()->parse($shortcodeStr);
        }
    }

    protected function editingRecord() {
        Versioned::reading_stage('Stage');
        $recordClass = $this->data()->ClassName;
        return $recordClass::get()->byID($this->data()->ID);
    }

    public function getEditMode() {
        if (!$this->data()->canEdit()) {
            return $this->endEditing();
        }
        // one-off preview that does _not_ stop edit mode
        if ($this->getRequest()->getVar('preview')) {
            return false;
        }
        if ($this->getRequest()->getVar('edit')) {
            Session::set('EditMode', 1);
        }

        $edit = ((int) Session::get('EditMode')) > 0;
        return $edit;
    }

    public function endEditing() {
        Session::clear('EditMode');
    }

    public function LivingForm() {
        if (!$this->getEditMode()) {
            return;
        }

        $embeds = $this->data()->Shortcodes->getValues();

        $fields = FieldList::create([
            HiddenField::create('PageStructure', "JSON structure"),
            HiddenField::create('Content', "HTML structure"),
            HiddenField::create('Embeds', 'Content embeds', json_encode($embeds)),
            HiddenField::create('EmbedLink', 'Embed link', $this->data()->Link('renderembed'))
        ]);

        $actions = FieldList::create([
            FormAction::create('save', 'Save'),
        ]);

        if ($this->data()->canPublish()) {
            $actions->push(FormAction::create('publish', 'Pub'));
        }

        $actions->push(FormAction::create('preview', 'View'));
        $actions->push(FormAction::create('live', 'Done'));

        $form = Form::create($this, 'LivingForm', $fields, $actions);
        $form->loadDataFrom($this->data());
        return $form;
    }

    public function save($data, Form $form, $request) {
        if (!$this->data()->canEdit()) {
            return $this->httpError(403);
        }

        $record = $this->editingRecord();

        $dummyHtmlField = HtmlEditorField::create('Content', 'Content', isset($data['Content']) ? $data['Content'] : '');
        $form->Fields()->replaceField('Content', $dummyHtmlField);
        $form->saveInto($record);

        $this->getResponse()->addHeader('Content-type', 'application/json');
        if ($record->write()) {
            $this->getResponse()->addHeader('Content-type', 'application/json');
            return json_encode(['status' => 'success']);
        }
        return $this->httpError(500);
        return json_encode(['status' => 'fail']);
    }

    public function publish($data, Form $form, $request) {
        $record = $this->editingRecord();

        if (!$record->canPublish()) {
            return $this->httpError(403);
        }

        $success = $record->doPublish();
        $this->getResponse()->addHeader('Content-type', 'application/json');
        return json_encode(['status' => $success ? 'success' : 'fail']);
    }
}