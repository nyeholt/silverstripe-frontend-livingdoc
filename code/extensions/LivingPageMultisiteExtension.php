<?php

/**
 * 
 *
 * @author marcus
 */
class LivingPageMultisiteExtension extends DataExtension
{
    private static $db = array(
        'LivingPageTheme'       => 'Varchar(128)',
    );

    public function updateSiteCMSFields(FieldList $fields) {
        $opts = LivingPage::config()->living_designs;
        $opts = array_combine(array_keys($opts), array_keys($opts));
        $fields->addFieldToTab(
            'Root.LivingPage',
            DropdownField::create('LivingPageTheme', 'Theme for Living Pages', $opts)->setEmptyString('-- default --')

            );
    }
}