<?php

namespace Symbiote\Frontend\LivingPage\Model;

/**
 * A group of components defined by JSON, typically
 * extracted from an existing design somewhere.
 */
class CompoundComponent extends PageComponent
{
    private static $table_name = 'CompoundComponent';

    protected function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if ($this->isChanged('Markup', self::CHANGE_VALUE)) {
            $decoded = @json_decode($this->Markup, true);
            $this->Markup = json_encode($this->verifyComponentInstance($decoded), JSON_PRETTY_PRINT);
        }
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->dataFieldByName('Markup')->setRows(50);

        return $fields;
    }

    public function asComponent($theme = null)
    {
        $component = json_decode($this->Markup);

        $compound = [
            'name' => $this->Name,
            'label' => $this->Title,
            'group' => $this->ComponentGroup,
            'components' => [
                $component
            ]
        ];
        if ($this->IconID) {
            $compound['icon'] = $this->Icon()->ScaleWidth(48)->forTemplate();
        }


        return $compound;
    }

    public function verifyComponentInstance($data)
    {
        if (!$data) {
            return ["label" => "Invalid component"];
        }

        if (isset($data['id'])) {
            unset($data['id']);
        }

        if (!isset($data['identifier'])) {
            return ["label" => "Invalid component"];
        }

        if (isset($data['containers'])) {
            foreach ($data['containers'] as $name => $items) {
                $newItems = [];
                foreach ($items as $subComponent) {
                    $newItems[] = $this->verifyComponentInstance($subComponent);
                }
                $data['containers'][$name] = $newItems;
            }
        }

        return $data;
    }
}
