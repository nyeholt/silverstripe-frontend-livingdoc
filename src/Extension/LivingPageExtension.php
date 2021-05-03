<?php
namespace Symbiote\Frontend\LivingPage\Extension;

use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\ToggleCompositeField;
use SilverStripe\ORM\DataExtension;
use SilverStripe\Security\Permission;
use SilverStripe\SiteConfig\SiteConfig;
use Symbiote\Frontend\LivingPage\Model\ComponentPageStructure;
use Symbiote\MultiValueField\Fields\KeyValueField;
use \Wa72\HtmlPageDom\HtmlPageCrawler;

/**
 * An extension that enables the livingpage editing layout for a
 * page type
 */
class LivingPageExtension extends DataExtension
{
    use Configurable;

    private static $db = [
        'PageStructure'     => 'Text',
        'Shortcodes'        => 'MultiValueField',
        'ThemeOverride'     => 'Varchar(128)',

        'FullPageMode'  => 'Boolean',
        'AllowLayoutEditing' => 'Boolean',
        'ShowGrid'          => 'Boolean',
    ];

    private static $defaults = [
        'AllowLayoutEditing' => true,
        'ShowGrid'  => true
    ];

    private static $has_one = [
        'StructureTemplate' => ComponentPageStructure::class,
    ];

    private static $living_designs = [
        'bootstrap4'        => 'nyeholt/silverstripe-frontend-livingdoc: app/dist/designs/bootstrap4-design.js',
    ];

    private static $default_design_css = '';

    private static $allow_full_page_mode = false;

    private static $default_page = array(
        'content' => [
            [
                'component' => 'wysiwyg',
                'content' => [
                    'html' => "Edit away"
                ]
            ],
        ],
        'design' => [
            'name' => 'bootstrap4',
            "version" => "0.0.1",
        ]
    );

    public function updateCMSFields(FieldList $fields)
    {


        $structures = ComponentPageStructure::get()->map();
        if (!strlen($this->owner->PageStructure) && count($structures)) {
            $fields->removeByName('Root');
            $fields->push(new TabSet('Root'));
            $fields->addFieldToTab('Root.Main', TextField::create('Title', 'Title'));
            $fields->addFieldToTab('Root.Main', DropdownField::create('StructureTemplateID', 'Template', $structures)->setEmptyString('-- none --'));

            return $fields;
        }

        $link = '<div class="field"><a href="page-editor/edit/' . $this->owner->ID . '?stage=Stage" target="_blank">Edit this page in-place</a></div>';
        $literalContent = LiteralField::create('Content', $link);
        $fields->replaceField('Content', $literalContent);
        // $fields->replaceField('Content', TextareaField::create('Content'));

        $pageOptions = [
            CheckboxField::create('AllowLayoutEditing', "Allow editing of the layout"),
            CheckboxField::create('ShowGrid', "Show the layout grid"),
            KeyValueField::create('Shortcodes', 'Available embed shortcodes')
        ];

        if ($this->owner->config()->allow_full_page_mode) {
            $pageOptions[] = CheckboxField::create('FullPageMode', 'Control the full page, ignoring layout');
        }

        $opts = self::config()->living_designs;
        $opts = array_combine(array_keys($opts), array_keys($opts));

        $pageOptions[] = DropdownField::create('ThemeOverride', 'Override theme for this page', $opts)->setEmptyString('-- none --');

        if (Permission::check('ADMIN')) {
            $pageOptions[] = TextareaField::create('PageStructure', 'Raw structure');
        }

        $toggle = ToggleCompositeField::create('LivingPageContent', 'Page options', $pageOptions);

        $fields->addFieldToTab('Root.Main', $toggle, 'URLSegment');

        return $fields;
    }


    public function onBeforeWrite()
    {
        parent::onBeforeWrite();

        if (!$this->owner->PageStructure) {
            $structures = ComponentPageStructure::get()->toArray();
            if (count($structures)) {
                $structure = $this->owner->StructureTemplate();
                if ($structure && $structure->ID) {
                    $valid = json_encode(json_decode($structure->Structure, true), JSON_PRETTY_PRINT);
                    $this->owner->PageStructure = $valid;
                }
            } else {
                $configObject = SiteConfig::current_site_config();
                if ($configObject && strlen($configObject->DefaultStructure)) {
                    $this->owner->PageStructure = json_encode(json_decode($configObject->DefaultStructure));
                } else {
                    $this->owner->PageStructure = json_encode(self::config()->default_page);
                }
            }

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
                $embedAttrStr = $cnode->attr('data-embed-attrs-object');
                $embedAttrs = null;
                if ($embedAttrStr) {
                    $embedAttrs = json_decode($embedAttrStr, true);
                }
                $replaceWith = $this->shortcodeFor($replaceWith, $embedAttrs);
                $cnode->text("$replaceWith");
                $text = $cnode->text();
            }

            $convertedHtml = $c->saveHTML();

            // images inserted by livingdocs
            $c = HtmlPageCrawler::create($convertedHtml);
            $toreplace = $c->filter('img[data-imageid]');
            foreach ($toreplace as $replaceNode) {
                $cnode = HtmlPageCrawler::create($replaceNode);
                $id = $cnode->attr('data-imageid');
                $replaceWith = "[file_link,id=" . ((int) $id) . "]";
                $cnode->attr('src', $replaceWith);
                $text = $cnode->text();
            }
            $convertedHtml = $c->saveHTML();

            // handle those inserted by prosemirror
            $c = HtmlPageCrawler::create($convertedHtml);
            $toreplace = $c->filter('img[data-id]');
            foreach ($toreplace as $replaceNode) {
                $cnode = HtmlPageCrawler::create($replaceNode);
                $id = $cnode->attr('data-id');
                $replaceWith = "[file_link,id=" . ((int) $id) . "]";
                $cnode->attr('src', $replaceWith);
                $text = $cnode->text();
            }
            $convertedHtml = $c->saveHTML();

            // bgimages inserted by livingdocs
            $c = HtmlPageCrawler::create($convertedHtml);
            $toreplace = $c->filter('div[data-imageid]');
            foreach ($toreplace as $replaceNode) {
                $cnode = HtmlPageCrawler::create($replaceNode);
                $id = $cnode->attr('data-imageid');
                $style = $cnode->attr('style');
                $replaceWith = "[file_link,id=" . ((int) $id) . "]";

                $style = preg_replace('/background-image: url\("(.*?)"\)/', "background-image: url('$replaceWith')", $style);

                $cnode->attr('style', $style);
                $text = $cnode->text();
            }
            $convertedHtml = $c->saveHTML();


            // back-convert link shortcodes
            $convertedHtml = preg_replace('/%5B(.+?)%5D/','[\\1]', $convertedHtml);

            // replace empty <a> with <span>. Relies on correctly structure link tags
            // so that there's no inner embedded <a>
            $convertedHtml = preg_replace('/<a>(.+?)<\/a>/', '<span class="empty-href-span">\\1</span>', $convertedHtml);

            $this->owner->Content = $convertedHtml;
        }
    }

    public function shortcodeFor($label, $shortcodeParams = null) {
        if (!strlen($label)) {
            return null;
        }
        $items = $this->availableShortcodes();

        $found = $label == 'embed';
        if (!$found) {
            foreach ($items as $itemLabel => $code) {
                if (strpos($code, "[$label") === 0) {
                    $found = true;
                    break;
                }
            }
        }

        if (!$found) {
            return null;
        }

        // a defined shortcode
        $shortcode = isset($items[$label]) ? (strpos($items[$label], "[") ? $items[$label] : '[' . $label . ']') : '[' .$label . ']';

        if ($label == 'embed') {
            if (!isset($shortcodeParams['width'])) {
                $shortcodeParams['width'] = '100%';
            }
            if (!isset($shortcodeParams['height'])) {
                $shortcodeParams['height'] = '100%';
            }
        }

        $paramStr = $this->attrListToAttrString($shortcodeParams);

        return strlen($paramStr) ? str_replace(']', ' ' . $paramStr . ']', $shortcode) : $items[$label];
    }

    /**
     * Convert an array of key => values to shortcode parameters.
     *
     * @param aray $shortcodeParams
     * @return string
     */
    protected function attrListToAttrString($shortcodeParams) {
        $paramStr = '';
        if (is_array($shortcodeParams)) {
            foreach ($shortcodeParams as $name => $values) {
                if (strlen($values)) {
                    $paramStr .= $name . '="' . $values .'" ';
                }
            }
        }
        return trim($paramStr);
    }

    /**
     * Gets all the shortcodes available for this page, inherited from its site
     *
     * @return array
     */
    public function availableShortcodes() {
        $configObject = SiteConfig::current_site_config();

        $configItems = [];
        if ($configObject && $configObject->GlobalShortcodes) {
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
     * @param string $oldName
     * @param string $newName
     * @param array $components
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
}
