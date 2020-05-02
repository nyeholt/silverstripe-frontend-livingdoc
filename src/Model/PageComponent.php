<?php

namespace Symbiote\Frontend\LivingPage\Model;

use SilverStripe\Assets\Image;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\ORM\ArrayLib;
use SilverStripe\ORM\DataObject;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Parsers\URLSegmentFilter;
use Symbiote\Frontend\LivingPage\Extension\LivingPageExtension;
use Symbiote\MultiValueField\Fields\MultiValueCheckboxField;

class PageComponent extends DataObject
{
    use ComponentTrait;

    private static $table_name = 'PageComponent';

    private static $groups = [
        'Headers',
        'Content',
        'Compounds',
        'Images',
        'Embeds',
        'Lists',
        'Layout',
        'Tables',
    ];

    private static $db = [
        'Title' => 'Varchar',
        'Themes'    => 'MultiValueField',
        'Name' => 'Varchar',
        'ComponentGroup' => 'Varchar',
        'IsActive' => 'Boolean',
        'Markup' => 'Text',
    ];

    private static $has_one = [
        'Icon' => Image::class
    ];

    private static $many_many = [
        'StyleOptions' => ComponentStyleGroup::class
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
            $name = self::unique_name_for($this->Title, $this->ID);
            $this->Name = $name;
        }
    }

    public static function unique_name_for($title, $id)
    {
        $name = URLSegmentFilter::create()->filter($title);
        $filter = ['Name' => $name];
        if ($id) {
            $filter['ID:not'] = $id;
        }
        $class = get_called_class();
        if ($class::get()->filter($filter)->first()) {
            $name .= '_' . date('ymdHis');
        }
        return $name;
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

        $message = LiteralField::create('msg', '<div class="form-group field form__field-label">Use this to create a new
        component that can be used in a page. The raw JSON declaration can be found on the "export" tab</div>');
        $fields->insertBefore('Title', $message);

        $data = $this->forDesign();
        if ($data) {
            $fields->addFieldToTab(
                'Root.Main',
                TextareaField::create('Exported', 'Export', json_encode($data, JSON_PRETTY_PRINT))->setDisabled(true)
            );
        }

        return $fields;
    }

    public function forDesign($theme = null)
    {
        $data = [];

        $component = $this->asComponent($theme);

        $props = [];
        if (count($this->StyleOptions())) {
            $component['properties'] = [];
            foreach ($this->StyleOptions() as $style) {
                $s = $style->forDesign();
                $props[$style->Name] = $s;
                $component['properties'][] = $style->Name;
            }
            $data['componentProperties'] = $props;
        }

        $data['component'] = $component;

        return $data;
    }

    public function asComponent($theme = null)
    {
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
