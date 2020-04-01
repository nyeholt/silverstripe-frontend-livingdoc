<?php
namespace Symbiote\Frontend\LivingPage\Page;

use Page;
use SilverStripe\Forms\CheckboxField;
use Symbiote\Frontend\LivingPage\Extension\LivingPageExtension;

/**
 * @author marcus
 */
class ComponentPage extends Page
{
    private static $table_name = 'ComponentPage';

    private static $db = [
        'FullPageMode'  => 'Boolean',
    ];

    private static $extensions = [
        LivingPageExtension::class
    ];

    private static $allow_full_page_mode = false;


    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        if (self::config()->allow_full_page_mode) {
            $fields->addFieldToTab('Root.Main', CheckboxField::create('FullPageMode', 'Control the full page'), 'Title');
        }

        return $fields;
    }
}
