<?php

namespace Symbiote\Frontend\LivingPage\Model;

use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Forms\TreeDropdownField;
use SilverStripe\ORM\DataObject;

/**
 * A template for a living page structure
 *
 * @author marcus
 */
class LivingPageStructure extends DataObject
{
    private static $table_name = 'LivingPageStructure';
    
    private static $db = [
        'Title'     => 'Varchar',
        'Structure' => 'Text',
    ];

    private static $has_one = [
        'SourcePage'      => SiteTree::class
    ];

    public function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if ($this->SourcePageID) {
            $page = $this->SourcePage();
            if ($page && strlen($page->PageStructure)) {
                $components = json_decode($page->PageStructure, true);
                if (isset($components['content'])) {
                    $newContent = [];
                    foreach ($components['content'] as $key => $component) {
                        $newContent[$key] = $this->cleanupComponent($component);
                    }
                    $components['content'] = $newContent;
                    $this->Structure = json_encode($components, JSON_PRETTY_PRINT);
                }
            }
            $this->SourcePageID = 0;
        }
    }

    protected function cleanupComponent($component) {
        $newComponent = [];
        foreach ($component as $key => $val) {
            if ($key === 'id') {
                continue;
            }
            if (is_array($val)) {
                $val = $this->cleanupComponent($val);
//                $val = $newVal;
            }

            $newComponent[$key] = $val;
        }

        return $newComponent;
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->replaceField('SourcePageID', TreeDropdownField::create('SourcePageID', 'Source page', 'SiteTree'));

        return $fields;
    }
}