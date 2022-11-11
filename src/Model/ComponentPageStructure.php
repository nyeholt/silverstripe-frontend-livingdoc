<?php

namespace Symbiote\Frontend\LivingPage\Model;

use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Forms\TreeDropdownField;
use SilverStripe\ORM\DataObject;
use SilverStripe\Assets\Image;

/**
 * A template for a living page structure
 *
 * @author marcus
 */
class ComponentPageStructure extends DataObject
{
    use ComponentTrait;

    private static $table_name = 'ComponentPageStructure';

    private static $db = [
        'Title'     => 'Varchar',
        'Structure' => 'Text',
    ];

    private static $has_one = [
        'SourcePage'      => SiteTree::class,
        'Screenshot'      => Image::class,
    ];

    private static $owns = [
        'Screenshot',
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

        $img = $this->Screenshot();
        if ($img->ID) {
            $img->doPublisH();
        }
    }

    protected function cleanupComponent($component)
    {
        $newComponent = [];
        foreach ($component as $key => $val) {
            if ($key === 'id') {
                continue;
            }
            if (is_array($val)) {
                $val = $this->cleanupComponent($val);
            }

            $newComponent[$key] = $val;
        }

        return $newComponent;
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->replaceField('SourcePageID', TreeDropdownField::create('SourcePageID', 'Source page', SiteTree::class));

        return $fields;
    }
}
