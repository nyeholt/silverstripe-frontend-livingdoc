<?php

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
    );

    public function updateCMSFields(\FieldList $fields)
    {
        $this->updateLivingPageFields($fields);
    }

    public function updateSiteCMSFields(\FieldList $fields) {
        $this->updateLivingPageFields($fields);
    }

    public function updateLivingPageFields(\FieldList $fields) {
        $opts = LivingPageExtension::config()->living_designs;
        $opts = array_combine(array_keys($opts), array_keys($opts));
        

        $pageOptions = [
            KeyValueField::create('GlobalShortcodes', 'Livingpage shorcodes'),
            DropdownField::create('LivingPageTheme', 'Theme for Living Pages', $opts)->setEmptyString('-- default --')
        ];


        $fields->addFieldsToTab(
            'Root.LivingPage',
            $pageOptions
        );
    }
}