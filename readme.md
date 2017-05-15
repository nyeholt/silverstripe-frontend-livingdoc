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
* Embedded items
* Containers - lists of other components
 
Components can be moved around the page and nested inside others, meaning content authors can 
define full page structures in-place without needing convoluted CMS managed object structures. 


## Getting started

The module ships with the `LivingPage` page type that can be created in the CMS. After creation, click the 
`Edit this page in-place` link to start modifying the page on the frontend of the site. 

## Customising the components

The module comes with a base "design" which is a set of components defined in JavaScript 
that define the HTML structure of those components, as well as which parts of those components are
editable. 

## Limitations

The components in the current implemented design is based on Bootstrap 3, with the available components
all based on a specific implementation that _I_ needed at the time. This will be made more generic in future; the 
goal is that any Multisite or individual page instance can have a separate design file chosen; this will then 
allow different components to be put in place. 

For a workaround now, you can hook into the updateLivingdocsDesign JS event and change things there 
prior to it being loaded. See [docs/en/configuring-design.md](Configuring the design) for more. 