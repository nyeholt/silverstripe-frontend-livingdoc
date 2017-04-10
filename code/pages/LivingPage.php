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
        'LivingForm'
    );

    public function init() {
		parent::init();

        if ($this->getRequest()->getVar('edit') && !$this->data()->canEdit()) {
            // redirect to login
            return Security::permissionFailure($this);
        }

        if (!strlen($this->data()->PageStructure)) {
            $this->data()->PageStructure = json_encode([
                'data' => LivingPage::config()->default_page
            ]);
        }

//        $this->data()->PageStructure = json_encode([
//                'data' => LivingPage::config()->default_page
//            ]);

        if ($this->data()->canEdit()) {

            // make sure there's a design version
            $design = json_decode($this->data()->PageStructure, true);

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

            $this->data()->PageStructure = json_encode($design);

            Requirements::block(THIRDPARTY_DIR.'/jquery/jquery.js');

            Requirements::javascript("//code.jquery.com/jquery-2.1.1.js");

            Requirements::javascript(THIRDPARTY_DIR.'/jquery-form/jquery.form.js');

            Requirements::javascript('frontend-livingdoc/javascript/livingdocs/editable.js');
            Requirements::javascript('frontend-livingdoc/javascript/livingdocs/livingdocs-engine.js');
            Requirements::javascript('frontend-livingdoc/javascript/livingdocs/bootstrap-design.js');

            Requirements::javascript('frontend-livingdoc/javascript/living-frontend.js');

            Requirements::css('frontend-livingdoc/css/living-frontend.css');
        }
	}

    public function getEditMode() {
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
        $fields = FieldList::create([
            HiddenField::create('PageStructure', "JSON structure"),
            HiddenField::create('Content', "HTML structure"),
        ]);

        $actions = FieldList::create([
            FormAction::create('save', 'Save'),
        ]);

        if ($this->data()->canPublish()) {
            $actions->push(FormAction::create('publish', 'Publish'));
        }

        $form = Form::create($this, 'LivingForm', $fields, $actions);
        $form->loadDataFrom($this->data());
        return $form;
    }

    public function save($data, Form $form, $request) {
        if (!$this->data()->canEdit()) {
            return $this->httpError(403);
        }

        $dummyHtmlField = HtmlEditorField::create('Content', 'Content', isset($data['Content']) ? $data['Content'] : '');
        $form->Fields()->replaceField('Content', $dummyHtmlField);
        $form->saveInto($this->data());

        $this->getResponse()->addHeader('Content-type', 'application/json');
        if ($this->data()->write()) {
            $this->getResponse()->addHeader('Content-type', 'application/json');
            return json_encode(['status' => 'success']);
        }
        return $this->httpError(500);
        return json_encode(['status' => 'fail']);
    }

    public function publish($data, Form $form, $request) {

        if ($this->data()->canPublish()) {
            
            $success = $this->data()->doPublish();
            $this->getResponse()->addHeader('Content-type', 'application/json');
            return json_encode(['status' => $success ? 'success' : 'fail']);
        }
    }
}