<?php

use \Wa72\HtmlPageDom\HtmlPageCrawler;

/**
 * An extension that enables the livingpage editing layout for a
 * page type
 */
class LivingPageExtension extends DataExtension
{
    private static $db = [
        'PageStructure' => 'Text',
        'Shortcodes'        => 'MultiValueField',
    ];

    private static $living_designs = [
        'bootstrap3'        => 'frontend-livingdoc/javascript/livingdocs/bootstrap-design.js',
    ];


    private static $default_design_css = '';

    private static $default_page = array(
        'content' => [
            [
                'component' => 'p',
                'content' => [
                    'text' => "Edit away"
                ]
            ],
        ],
        'design' => [
            'name' => 'bootstrap3',
            "version" => "0.0.1",
        ]
    );

    public function updateCMSFields(\FieldList $fields)
    {
        $link = '<div class="field"><a href="' . $this->owner->Link() . '?edit=1" target="_blank">Edit this page in-place</a></div>';
        $literalContent = LiteralField::create('Content', $link);
        $fields->replaceField('Content', $literalContent);

        $pageOptions = [
            KeyValueField::create('Shortcodes', 'Available shorcodes')
        ];
        if (Permission::check('ADMIN')) {
            $pageOptions[] = TextareaField::create('PageStructure', 'Raw structure');
        }

        $toggle = ToggleCompositeField::create('LivingPageContent', 'Page options', $pageOptions);
        $fields->addFieldToTab('Root.Main', $toggle);

        return $fields;
    }


    public function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if (!$this->owner->PageStructure) {
            $this->owner->PageStructure = json_encode(self::config()->default_page);
        }

        // convert relevant bits of the content from the data-embed-source tag
        // into shortcodes for runtime translation
        // https://github.com/wasinger/htmlpagedom

        if (strlen($this->owner->Content)) {
            $c = HtmlPageCrawler::create($this->owner->Content);
            $toreplace = $c->filter('[data-embed-source-object]');

            foreach ($toreplace as $replaceNode) {
                $cnode = HtmlPageCrawler::create($replaceNode);
                $replaceWith = $cnode->attr('data-embed-source-object');
                $replaceWith = $this->shortcodeFor($replaceWith);
                $cnode->text("$replaceWith");
                $text = $cnode->text();
            }

            $convertedHtml = $c->saveHTML();

            // back-convert link shortcodes
            $convertedHtml = preg_replace('/%5B(.+?)%5D/','[\\1]', $convertedHtml);

            $this->owner->Content = $convertedHtml;
        }
    }

    public function shortcodeFor($label) {
        $items = $this->availableShortcodes();
        return isset($items[$label]) ? $items[$label] : null;
    }

    /**
     * Gets all the shortcodes available for this page, inherited from its site
     *
     * @return array
     */
    public function availableShortcodes() {
        $configObject = class_exists('Site') ? \Multisites::inst()->getActiveSite() : \SiteConfig::current_site_config();

        $configItems = [];
        if ($configObject && $configObject->hasExtension('LivingPageSettingsExtension')) {
            $configItems = $configObject->GlobalShortcodes->getValues();
            if (!is_array($configItems)) {
                $configItems = [];
            }
        }

        $items = $this->owner->Shortcodes->getValues();
        if (!$items) {
            $items = [];
        }
        
        $items = array_merge($configItems, $items);

        return $items;
    }

    /**
     * Call this to update the design name used for the doc
     *
     * @param type $oldName
     * @param type $newName
     * @param type $components
     */
    public function updateDesignName($oldName, $newName, $components) {
        $newComponents = [];
        foreach ($components as $component) {
            if (isset($component['identifier'])) {
                $component['identifier'] = str_replace($oldName, $newName, $component['identifier']);
            }
            
            if (isset($component['containers'])) {
                foreach ($component['containers'] as $name => $items) {
                    $newItems = [];
                    $component['containers'][$name] = $this->updateDesignName($oldName, $newName, $component['containers'][$name]);
                }
            }

            $newComponents[] = $component;
        }

        return $newComponents;
    }

    public static function embeditem_handler($arguments, $content = null, $parser = null) {
        return print_r($arguments, true);
    }

    public static function childlist_handler($arguments, $content = null, $parser = null) {
        $page = null;
        if (isset($arguments['id'])) {
            $page = Page::get()->byID($arguments['id']);
        }

        if (!$page) {
            $controller = Controller::has_curr() ? Controller::curr() : null;
            $page = $controller instanceof ContentController ? $controller->data() : null;
        }

        if ($page) {
            return $page->renderWith('ListingPage_ChildListing');
        }
    }

    public static function config() {
		return Config::inst()->forClass(get_called_class());
    }

}