<?php

/**
 * 
 *
 * @author marcus
 */
class LivingPage extends Page
{
    private static $db = [
        'PageStructure' => 'Text',
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

        if (Permission::check('ADMIN')) {
            $toggle = ToggleCompositeField::create('LivingPageContent', 'Page options', [
                TextareaField::create('PageStructure', 'Raw structure')
            ]);
            $fields->addFieldToTab('Root.Main', $toggle);
        }

        return $fields;
    }


    public function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if (!$this->PageStructure) {
            $this->PageStructure = json_encode(self::config()->default_page);
        }
    }
}

class LivingPage_Controller extends Page_Controller
{
    private static $allowed_actions = array(
        'LivingForm',
        'rendershortcode'
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
            // make sure there's a design version
            $design = json_decode($record->PageStructure, true);

            if (!isset($design['data']) && isset($design['content'])) {
                $design = ['data' => $design];
            }

            if (!$design) {
                $design = [
                    'data' => LivingPage::config()->default_page
                ];
            }

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
        $fields = FieldList::create([
            HiddenField::create('PageStructure', "JSON structure"),
            HiddenField::create('Content', "HTML structure"),
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