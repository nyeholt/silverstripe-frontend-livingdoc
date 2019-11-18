# Frontend Livingdoc

A frontend site content editing tool built in top of the LivingDocs engine. 

Takes the lead from some of the work from https://github.com/wolfv/silverstripe-livingdocsfield 
and https://github.com/guru-digital/frontend-admin

## Overview

This module allows you to edit structured HTML components from the frontend of the site. These
components can be defined with editable regions allowing content "directives" to be inserted using

* WYSIWYG html editing
* Raw html editing
* Image selection
* Embedded items (using shortcodes)
* Containers - lists of other components
 
Components can be moved around the page and nested inside others, meaning content authors can 
define full page structures in-place without needing convoluted CMS managed object structures. 


## Getting started

The module ships with the `LivingPage` page type that can be created in the CMS. After creation, click the 
`Edit this page in-place` link to start modifying the page on the frontend of the site. 

To enable global global shortcode configuration that can be added on all pages, add the following
configuration (depending on whether you're using multisites or not)

```
---
Name: livingpage_config
---
Site:
  extensions:
    - LivingPageSettingsExtension
SiteConfig:
  extensions:
    - LivingPageSettingsExtension

```


## Components

The module comes with a base "design" which is a set of components defined in JavaScript 
that define the HTML structure of those components, as well as which parts of those components are
editable. 

Components are made up of plain HTML, with a few specific `directive` attributes that indicate to
livingdocs the editable areas of the structure. In addition to the HTML structure, components may have
`componentProperties` applied to them, which are surfaced as CSS classes, as well as arbitrary `data` fields. 
One specific `data` field is the `data_attributes` map, which is applied as attributes against the element. 

An example component:

```
    {
        "name": "image",
        "html": "<figure>\n\
            <img doc-image=\"image\" class=\"img-responsive\">\n\
            <figcaption doc-editable=\"caption\">\n\
            Caption.\n\
            </figcaption>\n</figure>",
        "label": "Image"
    }
```

The key points are that

* The top level element (`<figure>`) is the element that would have any css classes applied to it
* There are two directives used; `doc-image` and `doc-editable`
* The `html` for the component can use nested elements and directives



### Directives

The page editor supports several directive types

* `doc-editable`: A WYSIWYG editor that provides in-place editing of content, with simple formatting options and
  content insertion (link) plugins. 
* `doc-image`: In-place image insertion
* `doc-container`: Allows the definition of an area that can have multiple child components inserted. For example, a
  `split-panel` component may have two 'div' elements, each with their own children, which would be flagged by having
  a separate container in each. 
  `<div class="col-md-6" doc-container="left-column"></div><div class="col-md-6" doc-container="right-column"></div>`
* `doc-html`: Raw HTML editing using ACE editor. A special markdown component exists that allows the use of
  markdown for simpler content entry. 
* `doc-embeditem`: A SilverStripe only directive that allows the embedding of content that is sourced from a 
  code-defined shortcode. These must be created as a normal SilverStripe PHP-based shortcode, and configured to be
  usable on the page. 

### Component groups

To simplify the interface, components can be grouped together under a common heading. See the `groups` key in the
design file

### Pre-defined component structures

In some cases it is desireable to always have a specific tree of components automatically created when a specific 
type of component is created. An example of this is a `table` component; it is almost always going to be the case that
creating a `<table>` should also have headers and rows created. 

There are two mechanisms for defining these, both of which use the same internal structure

* `prefilledComponents`: when the component of a particular type is created, the child type structure is automatically
  created. For example, `table` automatically has a `tablehead` and `tablebody` child containers populated
* `structures`: Creates a new dropdown in the UI that allows the selection of a named custom structure. For example, a
  `Content section` structure, in a bootstrap design, is a `section` component filled with a `row` component, filled with 
  `column` component, filled with a `p` component. 

### Customising the component definitions

Assuming the default base bootstrap-design.js file is used, the quickest approach is to have your own .js file
that defines

```js

$(document).on('updateLivingdocsDesign', function (e, design) { });

```

The `design.components` collection can then be iterated to change the existing definitions, or 
have new definitions pushed onto its list. 

## CMS capabilities

From the CMS you can define several things to help the page editing process

### Shortcodes for embedding content in pages

These can be configured on the SiteConfig, or Site object for Multisites users, which will cascade throughout that site. Additional shortcodes can be specified on a per-page basis; these will override any defined at a global level. Specify a key value pair, where the 'key' is the label shown to the user, and the value is the shortcode to output. Note that users may add attributes for the shortcode from the frontend of the site. 

* `livingpage_childlist` - displays the list of child items of a page (uses the 'current' page as the default) 
* `livingpage_show_field` - shows the fields of an object (current page is the default). Supports resolution of 
  subfields and parameters
  * `[livingpage_show_field field="OriginalPublishDate.format" args="Y/m/d"]

Adding new shortcodes to a system is the normal SilverStripe method, eg

`ShortcodeParser::get('default')->register('listing', array('PageShortcodes', 'listing_content'));`

On the frontend of the site, shortcodes are added using the "Embed" component. 

### LivingPageStructure

To provide some structure to pages, you can define a "Living Page Structure" in the CMS at admin/livingpage. When creating this structure, you can choose an existing Living Page to extract the content structure from. 

Then, when you create a Living Page object in the Site Tree, you can choose the template structure to provide the initial content. 

### Compound Component



### Paste

You can paste clipboard images in a few different contexts;

* When editing in a wysiwyg paragraph, a new image is inserted as a sibling component
* When an existing image is selected, it will replace that image
* When a container is selected, a new image is inserted at the end of that container




## Limitations

The components in the current implemented design is based on Bootstrap 3, with the available components
all based on a specific implementation that _I_ needed at the time. This will be made more generic in future; the 
goal is that any Multisite or individual page instance can have a separate design file chosen; this will then 
allow different components to be put in place. 

For a workaround now, you can hook into the updateLivingdocsDesign JS event and change things there 
prior to it being loaded. See [docs/en/configuring-design.md](Configuring the design) for more. 

## Future work

* Allow component definitions via the CMS
* Better migration of changed component structures
