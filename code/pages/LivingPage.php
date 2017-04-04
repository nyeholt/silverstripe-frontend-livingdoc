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
                    'text' => "This is the first paragraph"
                ]
            ],
            [
                'component' => 'p',
                'content' => [
                    'text' => "This is the second paragraph"
                ]
            ]
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
    public function init() {
		parent::init();

        $this->data()->PageStructure = json_encode([
            'data' => LivingPage::config()->default_page
        ]);

        Requirements::block(THIRDPARTY_DIR.'/jquery/jquery.js');

        Requirements::javascript("//code.jquery.com/jquery-2.1.1.js");

        Requirements::javascript('frontend-livingdoc/javascript/livingdocs/editable.js');
        Requirements::javascript('frontend-livingdoc/javascript/livingdocs/livingdocs-engine.js');
        Requirements::javascript('frontend-livingdoc/javascript/livingdocs/bootstrap-design.js');

        Requirements::javascript('frontend-livingdoc/javascript/living-frontend.js');

        Requirements::css('frontend-livingdoc/css/living-frontend.css');
	}

    public function LivingForm() {
        $fields = FieldList::create([
            TextareaField::create('PageStructure', "JSON structure"),
            TextareaField::create('Content', "HTML structure"),
        ]);

        $actions = FieldList::create([
            FormAction::create('save', 'Save'),
        ]);

        if ($this->data()->canPublish()) {
            $actions->push(FormAction::create('publish', 'Publish'));
        }

        $form = Form::create($this, 'LivingForm', $fields, $actions);
        return $form;
    }
}