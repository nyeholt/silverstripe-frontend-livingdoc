<?php

namespace Symbiote\Frontend\LivingPage\Model;

use SilverStripe\Forms\TextareaField;
use SilverStripe\ORM\DataObject;
use Symbiote\MultiValueField\Fields\KeyValueField;

class ComponentStyleGroup extends DataObject
{
    private static $table_name = 'ComponentStyleGroup';

    private static $db = [
        'Title' => 'Varchar(64)',
        'Name' => 'Varchar(64)',
        'Type' => 'Enum("select,multiselect,option")',
        'Options' => 'MultiValueField',
        'Value' => 'Varchar(128)',
    ];

    public function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if ($this->isChanged('Title', self::CHANGE_VALUE)) {
            $name = PageComponent::unique_name_for($this->Title, $this->ID);
            $this->Name = $name;
        }
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $opts = KeyValueField::create('Options', 'Options');
        $fields->replaceField('Options', $opts);

        if ($this->Type === 'option') {
            $fields->removeByName('Options');
        } else {
            $fields->removeByName('Value');
        }

        $data = $this->forDesign();
        if ($data) {
            $fields->addFieldToTab('Root.Main', TextareaField::create('Exported', 'Export', json_encode($data, JSON_PRETTY_PRINT))->setDisabled(true));
        }
        

        return $fields;
    }

    public function forDesign()
    {
        $data = [
            'label' => $this->Title,
            'type' => $this->Type,
        ];

        $options = $this->Options->getValues();

        if ($this->Type === 'option') {
            $data['value'] = $this->Value;
        } else {
            $opts = [
                [
                    'caption' => '',
                    'value' => '',
                ]
            ];

            if ($this->Type === 'multiselect') {
                $opts[] = [
                    'caption' => 'Multiple',
                    'value' => 'yes',
                ];
            }

            foreach ($options as $val => $label) {
                $opts[] = [
                    'caption' => $label,
                    'value' => $val
                ];
            }
            $data['options'] = $opts;
        }

        return $data;
    }

    public function canView($member = null)
    {
        return true;
    }
}
