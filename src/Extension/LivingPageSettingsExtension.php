<?php
namespace Symbiote\Frontend\LivingPage\Extension;

use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextareaField;
use SilverStripe\ORM\DataExtension;
use Symbiote\Multisites\Model\Site;
use Symbiote\MultiValueField\Fields\KeyValueField;

/**
 * Site / System wide configuration settings for livingdocs.
 *
 * @author marcus
 */
class LivingPageSettingsExtension extends DataExtension
{
    private static $db = array(
        'LivingPageTheme'       => 'Varchar(128)',
        'GlobalShortcodes'        => 'MultiValueField',
        'DefaultStructure'  => 'Text',
    );

    public function updateCMSFields(FieldList $fields)
    {
        $this->updateLivingPageFields($fields);
    }

    public function updateSiteCMSFields(FieldList $fields) {
        $this->updateLivingPageFields($fields);
    }

    public function updateLivingPageFields(FieldList $fields) {
        $opts = LivingPageExtension::config()->living_designs;
        $opts = array_combine(array_keys($opts), array_keys($opts));


        $pageOptions = [
            KeyValueField::create('GlobalShortcodes', 'Livingpage shorcodes'),
            DropdownField::create('LivingPageTheme', 'Theme for Living Pages', $opts)->setEmptyString('-- default --')
        ];

        if ($this->owner instanceof Site) {
            $pageOptions[] = TextareaField::create('DefaultStructure', 'Default page layout');
        }

        $fields->addFieldsToTab(
            'Root.LivingPage',
            $pageOptions
        );
    }
}
