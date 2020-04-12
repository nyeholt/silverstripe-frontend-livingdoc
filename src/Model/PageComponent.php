<?php

namespace Symbiote\Frontend\LivingPage\Model;

use SilverStripe\Assets\Image;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\ORM\ArrayLib;
use SilverStripe\ORM\DataObject;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Parsers\URLSegmentFilter;
use Symbiote\Frontend\LivingPage\Extension\LivingPageExtension;
use Symbiote\MultiValueField\Fields\MultiValueCheckboxField;
use Symbiote\MultiValueField\ORM\FieldType\MultiValueField;

class PageComponent extends DataObject
{
    private static $table_name = 'PageComponent';

    private static $groups = [
        'Headers',
        'Text',
        'Compounds',
        'Images',
        'Embeds',
        'Lists',
        'Layout',
        'Tables',
    ];

    private static $db = [
        'Title' => 'Varchar',
        'Name' => 'Varchar',
        'ComponentGroup' => 'Varchar',
        'IsActive' => 'Boolean',
        'Themes'    => 'MultiValueField',
        'Markup' => 'Text',
    ];

    private static $has_one = [
        'Icon' => Image::class
    ];

    private static $owns = [
        'Icon',
    ];

    private static $extensions = [
        Versioned::class
    ];

    protected function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if ($this->isChanged('Title', self::CHANGE_VALUE)) {
            $name = URLSegmentFilter::create()->filter($this->Title);
            $filter = ['Name' => $name];
            if ($this->ID) {
                $filter['ID:not'] = $this->ID;
            }
            if (PageComponent::get()->filter($filter)->first()) {
                $name .= '_' . date('ymdHis');
            }
            $this->Name = $name;
        }
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->replaceField('Name', ReadonlyField::create('Name', 'Name'));

        $fields->dataFieldByName('Markup')->setRows(20);

        $dropdown = DropdownField::create('ComponentGroup', 'Group', ArrayLib::valuekey(self::config()->groups));
        $fields->replaceField('ComponentGroup', $dropdown);

        $designOptions = LivingPageExtension::config()->living_designs;
        if (count($designOptions)) {
            $themes = ArrayLib::valuekey(array_keys($designOptions));
            $designField = MultiValueCheckboxField::create('Themes', 'Available in themes', $themes);
            $fields->replaceField('Themes', $designField);
        } else {
            $fields->removeByName('Themes');
        }

        return $fields;
    }

    public function asComponent($theme = null) {
        $component = [
            'name' => $this->Name,
            'html' => $this->Markup,
            'label' => $this->Title,
            'group' => $this->ComponentGroup,
        ];

        if ($this->IconID) {
            $component['icon'] = $this->Icon()->ScaleWidth(78)->forTemplate();
        }

        return $component;
    }
}
