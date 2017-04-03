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
    
    private static $default_page = array(
        'data' => [
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
                ],
                [
                    'component' => 'main-and-side',
                    'containers' => [
                        'main' => [
                            [
                                "component" => "h2",
                                'content' => [
                                    'title' => 'Heading',
                                ]
                            ],
                            [
                                'component' => 'p',
                                'content' => [
                                    'text' => 'Main paragraph content',
                                ]
                            ],
                            [
                                "component" => "panel"
                            ]
                        ],
                        'sidebar' => [
                            [
                                "component" => "quote"
                            ]
                        ]
                    ]
                ]
            ],
            'design' => [
                'name' => 'bootstrap3',
            ]
        ]
    );


    public function init() {
		parent::init();

        FrontendInsertDialog::create()->init();
        Requirements::javascript('frontend-livingdoc/javascript/living-frontend.js');
	}

    public function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if (!$this->PageStructure) {
            $this->PageStructure = json_encode(self::config()->default_page);
        }
    }
}