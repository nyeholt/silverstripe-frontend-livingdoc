(function () {
    var designJSON = {
        "name": "bootstrap4",
        "label": "Bootstrap 4",
        "version": "0.0.1",
        "author": "symbiote.com.au",
        "assets": {
            "basePath": '/resources/nyeholt/silverstripe-frontend-livingdoc/app/dist',
            "css": [
                "./css/base.css"
            ]
        },
        "wrapper": "<div class='doc-section'></div>",
        "componentProperties": {
            "position-relative": {
                "label": "Does this contain absolutely positioned elements?",
                "type": "option",
                "value": "position-relative",
            },
            "position-absolute": {
                "label": "Position this element using absolute units",
                "type": "option",
                "value": "position-absolute",
            },
            "display": {
                "label": "Display this component at sizes",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "All"
                    },
                    {
                        "caption": "Desktop",
                        "value": "d-none d-md-block"
                    },
                    {
                        "caption": "Mobile",
                        "value": "d-block d-md-none"
                    },
                    {
                        "caption": "Screen reader only",
                        "value": "sr-only"
                    },
                    {
                        "caption": "Screen reader focused",
                        "value": "sr-only-focusable"
                    }
                ]
            },
            "section-class": {
                "label": "Section style",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "None"
                    },
                    {
                        "caption": "First",
                        "value": "first"
                    },
                    {
                        "caption": "Container",
                        "value": "container"
                    },
                    {
                        "caption": "Fluid",
                        "value": "container-fluid"
                    }
                ]
            },
            "column-width": {
                "label": "Column width",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "None"
                    },
                    {
                        "caption": "Auto",
                        "value": "col"
                    }
                ]
            },
            "column-margin": {
                "label": "Column margin",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "None"
                    }
                ]
            },
            "div-styles": {
                "label": "Block styles",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'Container',
                        'value': "container"
                    },
                    {
                        'caption': 'Fluid width container',
                        'value': "container-fluid"
                    },
                    {
                        'caption': 'Row',
                        'value': "row"
                    },
                    {
                        'caption': 'Column',
                        'value': "col"
                    }
                ]
            },
            "header-styles": {
                "label": "Header styles",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'Title',
                        'value': "title"
                    },
                    {
                        'caption': 'Card title',
                        'value': "card-title"
                    },
                    {
                        'caption': 'Card subtitle',
                        'value': "card-subtitle"
                    },
                    {
                        'caption': 'As h1',
                        'value': "h1"
                    },
                    {
                        'caption': 'As h2',
                        'value': "h2"
                    },
                    {
                        'caption': 'As h3',
                        'value': "h3"
                    },
                    {
                        'caption': 'As h4',
                        'value': "h4"
                    },
                    {
                        'caption': 'As h5',
                        'value': "h5"
                    },
                    {
                        'caption': 'As h6',
                        'value': "h6"
                    },
                ]
            },
            "card-layout": {
                "label": "Card layout",
                "type": "select",
                "options": [
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'Deck',
                        'value': "card-deck"
                    },
                    {
                        'caption': 'Joined Group',
                        'value': "card-group"
                    },
                    {
                        'caption': 'Masonry',
                        'value': "card-columns"
                    },
                ]
            },
            "list-styles": {
                "label": "List styles",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'List group',
                        'value': "list-group"
                    },
                    {
                        'caption': 'List group flush',
                        'value': "list-group-flush"
                    },
                    {
                        'caption': 'List group item',
                        'value': "list-group-item"
                    }
                ]
            },
            "button-styles": {
                "label": "Button styles",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'Large',
                        'value': "btn-lg"
                    },
                    {
                        'caption': 'Small',
                        'value': "btn-sm"
                    },
                    {
                        'caption': 'Primary',
                        'value': "btn-primary"
                    },
                    {
                        'caption': 'Secondary',
                        'value': "btn-secondary"
                    },
                    {
                        'caption': 'Success',
                        'value': "btn-success"
                    },
                    {
                        'caption': 'Danger',
                        'value': "btn-danger"
                    },
                    {
                        'caption': 'Warning',
                        'value': "btn-warning"
                    },
                    {
                        'caption': 'Info',
                        'value': "btn-info"
                    },
                    {
                        'caption': 'Light',
                        'value': "btn-light"
                    },
                    {
                        'caption': 'Dark',
                        'value': "btn-dark"
                    },
                    {
                        'caption': 'Plain link',
                        'value': "btn-link"
                    },
                    
                ]
            },
            "card-bodies": {
                "label": "Card body types",
                "type": "select",
                "options": [
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'Card body',
                        'value': "card-body"
                    },
                    {
                        'caption': 'Card image overlay',
                        'value': "card-img-overlay"
                    }
                ]
            },
            "card-images": {
                "label": "Card image types",
                "type": "select",
                "options": [
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'Card top',
                        'value': "card-img-top"
                    },
                    {
                        'caption': 'Card image',
                        'value': "card-img"
                    }
                ]
            },
            "text-styles": {
                "label": "Text styles",
                "type": "select",
                "options": [
                    {
                        'caption': 'Multiple',
                        'value': "yes"
                    },
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'Muted',
                        'value': "text-muted"
                    },
                    {
                        'caption': 'Lead',
                        'value': "lead"
                    },
                    {
                        'caption': 'Centered',
                        'value': "text-center"
                    },
                    {
                        'caption': 'Centered',
                        'value': "text-center"
                    },
                    {
                        'caption': 'Left',
                        'value': "text-left"
                    },
                    {
                        'caption': 'Right',
                        'value': "text-right"
                    },
                    {
                        'caption': 'Justify',
                        'value': "text-justify"
                    },
                    {
                        'caption': 'Nowrap',
                        'value': "text-nowrap"
                    },
                    {
                        'caption': 'Lowercase',
                        'value': "text-lowercase"
                    },
                    {
                        'caption': 'Uppercase',
                        'value': "text-uppercase"
                    },
                    {
                        'caption': 'Capitalize',
                        'value': "text-capitalize"
                    },
                    {
                        'caption': 'Stretched Link',
                        'value': "stretched-link"
                    },
                ]
            },
            "alert-styles": {
                "label": "Alert styles",
                "type": "select",
                "options": [
                    {
                        "caption": "None"
                    },
                    {
                        'caption': 'Primary',
                        'value': "alert-primary"
                    },
                    {
                        'caption': 'Secondary',
                        'value': "alert-secondary"
                    },
                    {
                        'caption': 'Success',
                        'value': "alert-success"
                    },
                    {
                        'caption': 'Danger',
                        'value': "alert-danger"
                    },
                    {
                        'caption': 'Warning',
                        'value': "alert-warning"
                    },
                    {
                        'caption': 'Info',
                        'value': "alert-info"
                    },
                    {
                        'caption': 'Light',
                        'value': "alert-light"
                    },
                    {
                        'caption': 'Dark',
                        'value': "alert-dark"
                    }
                ]
            }
        },
        "groups": [
            {
                "label": "Compounds",
                "components": [
                    "content_section",
                    "hero_banner"
                ]
            },
            {
                "label": "Content",
                "components": [
                    "p",
                    "buttonlink",
                    "alert",
                    "quote",
                    "markdown",
                    "customhtml",
                    "wysiwyg"
                ]
            },

            {
                "label": "Images",
                "components": [
                    "image",
                    'captioned-image'
                ]
            },
            {
                "label": "Embeds",
                "components": [
                    "embeddeditem",
                    "shortcodeitem"
                ]
            },
            {
                "label": "Cards",
                "components": [
                    "card",
                    "cardbody",
                    "cardtext",
                    "cardlink",
                    // "cardimagetop",
                    "cardimage",
                    // "cardimgoverlay",
                    "cardheader",
                    "cardfooter",
                    "cardlayout" // "carddeck", cardgroup, cardcolumns as classes
                ]
            },
            {
                "label": "Layout",
                "components": [
                    "block",
                    "section",
                    "row",
                    "column",
                    "panel",
                    "main-and-sidebar",
                    "well"
                ]
            },
            {
                "label": "Headers",
                "components": [
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6"
                ]
            },
            {
                "label": "Lists",
                "components": [
                    "unordered-list",
                    "ordered-list",
                    "numbered-list", 
                    "list-item",
                    "list-group",
                    'numbered-list-group',
                    "list-group-item"
                ]
            },
            {
                "label": "Tables",
                "components": [
                    "table",
                    "headercell",
                    "tablerow",
                    "tablecell"
                ]
            }
        ],
        "defaultComponents": {
            "paragraph": null,
            "image": "image"
        },
        "defaultContent": [
            {
                "component": "header"
            },
            {
                "component": "wysiwyg"
            }
        ],
        "metadata": [
            {
                "identifier": "title",
                "type": "text",
                "matches": [
                    "h1.title",
                    "h2.title"
                ]
            },
            {
                "identifier": "description",
                "type": "text",
                "matches": [
                    "p.text"
                ]
            }
        ],
        "components": [
            {
                "name": "embeddeditem",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-exposure" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="4.6" y1="19.4" x2="19.4" y2="4.6" /><path d="M7 9h4m-2 -2v4" /><path d="M13 16h4" /></svg>',
                "html": "<div doc-embeditem=\"object\">Set embed url...\n</div>",
                "label": "Embed URL"
            },
            {
                "name": "shortcodeitem",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-exposure" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="4.6" y1="19.4" x2="19.4" y2="4.6" /><path d="M7 9h4m-2 -2v4" /><path d="M13 16h4" /></svg>',
                "html": "<div doc-embeditem=\"object\" data-use-sc='1'>Select component\n</div>",
                "label": "Global component"
            },
            {
                "name": "alert",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-alert-triangle" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v2m0 4v.01" /><path d="M5.07 19H19a2 2 0 0 0 1.75 -2.75L13.75 4a2 2 0 0 0 -3.5 0L3.25 16.25a2 2 0 0 0 1.75 2.75" /></svg>',
                "html": "<div doc-editable=\"alerttext\" class=\"alert\">Alert text</div>",
                "label": "Alert",
                "properties": [
                    'alert-styles',
                ]
            },
            {
                "name": "p",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-minus" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>',
                "html": "<p doc-editable=\"text\">Paragraph</p>",
                "label": "Paragraph",
                "properties": [
                    'text-styles'
                ]
            },
            {
                "name": "buttonlink",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-minus" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="9" y1="12" x2="15" y2="12" /></svg>',
                "html": "<a doc-link=\"Link\" class=\"btn\" doc-editable=\"buttontext\">Link</a>",
                "label": "Button",
                "properties": [
                    'button-styles'
                ]
            },
            {
                "name": "wysiwyg",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-columns" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="9.5" y2="6" /><line x1="4" y1="10" x2="9.5" y2="10" /><line x1="4" y1="14" x2="9.5" y2="14" /><line x1="4" y1="18" x2="9.5" y2="18" /><line x1="14.5" y1="6" x2="20" y2="6" /><line x1="14.5" y1="10" x2="20" y2="10" /><line x1="14.5" y1="14" x2="20" y2="14" /><line x1="14.5" y1="18" x2="20" y2="18" /></svg>',
                "html": "<div doc-wysiwyg=\"html\">Wyswiyg content</div>",
                "label": "WYSIWYG"
            },
            {
                "name": "quote",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-message-2" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20l-3 -3h-2a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-2l-3 3" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="14" y2="13" /></svg>',
                "html": "<blockquote>\n  <p>\n    <span class=\"quotation-mark\">&#x201C;</span><span class=\"quote\" doc-editable=\"text\">Quotation</span>\n  </p>\n  <div class=\"caption\" doc-editable=\"author\">Author</div>\n</blockquote>",
                "label": "Quote"
            },
            {
                "name": "customhtml",
                "html": "<div class=\"customhtml\" doc-html=\"html\">Click to modify...\n</div>",
                "label": "Raw HTML"
            },
            {
                "name": "markdown",
                "html": "<div class=\"customhtml js-living-markdown\" doc-html=\"html\">Click to modify...\n</div>",
                "label": "Markdown"
            },
            {
                "name": "block",
                "html": "<div class=\"\" doc-container=\"layout\" doc-image=\"BackgroundImage\">\n</div>",
                "label": "Empty block",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>',
                "properties": [
                    "display",
                    "position-relative",
                    "position-absolute",
                    "text-styles",
                    "div-styles",
                    // "column-width",
                    // 'column-margin'
                ]
            },
            {
                "name": "section",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-new-section" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="12" x2="15" y2="12" /><line x1="12" y1="9" x2="12" y2="15" /><path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" /></svg>',
                "html": "<section class=\"page-section container\" doc-container=\"section\">\n</section>",
                "label": "Section",
                "properties": [
                    "display",
                    "section-class",
                    "text-styles"
                ]
            },
            {
                "name": "row",
                "html": "<div class=\"row\" doc-container=\"row\" doc-image=\"bgimage\">\n</div>",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-layout-rows" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="4" y1="12" x2="20" y2="12" /></svg>',
                "label": "Row",
                "properties": [
                    "display",
                    "position-relative",
                    "text-styles"
                ],
                "directives": {
                    "row": {
                        "allowedChildren": [
                            "column",
                            "block"
                        ]
                    }
                }
            },
            {
                "name": "column",
                "html": "<div class=\"col\" doc-container=\"column\">\n</div>",
                "label": "Column",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-layout-columns" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
                "allowedParents": [
                    "row",
                    "block"
                ],
                "properties": [
                    "display",
                    "text-styles",
                    "column-width"
                    // 'column-margin'
                ]
            },

            {
                "name": "table",
                "html": "<table><thead doc-container=\"tablehead\"></thead><tbody doc-container=\"tablebody\"></tbody></table>",
                "label": "Table",
                "properties": [
                    "text-styles"
                ],
                "directives": {
                    "tablehead": {
                        "allowedChildren": [
                            "tablerow"
                        ]
                    },
                    "tablebody": {
                        "allowedChildren": [
                            "tablerow"
                        ]
                    }
                }
            },
            {
                "name": "tablerow",
                "html": "<tr doc-container=\"rowcells\"></tr>",
                "label": "Table Row",
                "properties": [
                    "text-styles"
                ],
                "allowedParents": [
                    "table"
                ],
                "directives": {
                    "rowcells": {
                        "allowedChildren": [
                            "tablecell",
                            "headercell"
                        ]
                    }
                }
            },
            {
                "name": "tablecell",
                "html": "<td doc-container=\"cellitems\"></td>",
                "label": "Table Cell",
                "properties": [
                    "text-styles"
                ],
                "allowedParents": [
                    "tablerow"
                ]
            },
            {
                "name": "headercell",
                "html": "<th doc-container=\"cellitems\"></td>",
                "label": "Table Header Cell",
                "properties": [
                    "text-styles"
                ],
                "allowedParents": [
                    "tablerow"
                ]
            },
            {
                "name": "h1",
                "html": "<h1 class=\"\" doc-editable=\"title\">\n  Title\n</h1>",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4v3h5.5v12h3V7H19V4z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
                "label": "Heading H1",
                "properties": [
                    "header-styles",
                    "text-styles"
                ]
            },
            {
                "name": "h2",
                "html": "<h2 class=\"\" doc-editable=\"title\">\n  Title\n</h2>",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4v3h5.5v12h3V7H19V4z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
                "label": "Heading H2",
                "properties": [
                    "header-styles",
                    "text-styles"
                ]
            },
            {
                "name": "h3",
                "html": "<h3 class=\"\" doc-editable=\"title\">\n  Title\n</h3>",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4v3h5.5v12h3V7H19V4z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
                "label": "Heading H3",
                "properties": [
                    "header-styles",
                    "text-styles"
                ]
            },
            {
                "name": "h4",
                "html": "<h4 class=\"\" doc-editable=\"title\">\n  Title\n</h4>",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4v3h5.5v12h3V7H19V4z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
                "label": "Heading H4",
                "properties": [
                    "header-styles",
                    "text-styles"
                ]
            },
            {
                "name": "h5",
                "html": "<h5 class=\"\" doc-editable=\"title\">\n  Title\n</h4>",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4v3h5.5v12h3V7H19V4z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
                "label": "Header H5",
                "properties": [
                    "header-styles",
                    "text-styles"
                ]
            },
            {
                "name": "h6",
                "html": "<h6 class=\"\" doc-editable=\"title\">\n  Title\n</h4>",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 4v3h5.5v12h3V7H19V4z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>',
                "label": "Header H6",
                "properties": [
                    "header-styles",
                    "text-styles"
                ]
            },
            {
                "name": "image",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
                "html": "<img doc-image=\"image\" class=\"img-responsive\">",
                "label": "Image"
            },
            {
                "name": "captioned-image",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
                "html": "<figure>\n\
             <img doc-image=\"image\" class=\"img-responsive\">\n\
                <figcaption doc-editable=\"caption\">\n\
                Caption.\n\
                </figcaption>\n</figure>",
                "label": "Image with Caption"
            },
            {
                "name": "cardlayout",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-layout-cards" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6" height="16" rx="2" /><rect x="14" y="4" width="6" height="10" rx="2" /></svg>',
                "html": "<div class=\"card-layout\" doc-container=\"cards\">\n</div>",
                "label": "Card layout",
                "properties": [
                    "display",
                    "card-layout"
                ]
            },
            {
                "name": "card",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-layout-bottombar" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="4" y1="15" x2="20" y2="15" /></svg>',
                "html": "<div class=\"card\" doc-container=\"carditems\">\n</div>",
                "label": "Card",
                "properties": [
                    "display",
                    "text-styles"
                ]
            },
            {
                "name": "cardbody",
                "html": "<div class=\"card-body\" doc-container=\"bodyitems\">\n</div>",
                "label": "Card body",
                "allowedParents": [
                    "card"
                ],
                "properties": [
                    "card-bodies",
                    "display",
                    "text-styles"
                ]
            },
            {
                "name": "cardtext",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-minus" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>',
                "html": "<p class=\"card-text\" doc-editable=\"cardtext\">\nCard text</p>",
                "label": "Card text",
                "allowedParents": [
                    "cardbody"
                ],
                "properties": [
                    "display",
                    "text-styles"
                ]
            },
            {
                "name": "cardlink",
                "icon": '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-link" width="52" height="52" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" /><path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" /></svg>',
                "html": "<a doc-link=\"Link\" class=\"card-link\" doc-editable=\"linktext\" href=\"#\">\nLink</a>",
                "label": "Card link",
                "allowedParents": [
                    "cardbody"
                ],
                "properties": [
                    "display",
                    "text-styles"
                ]
            },
            {
                "name": "cardimage",
                "icon": '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
                "html": "<img doc-image=\"Image\" class=\"\" />",
                "label": "Card image",
                "allowedParents": [
                    "card"
                ],
                "properties": [
                    "card-images"
                ]
            },
            {
                "name": "unordered-list",
                "html": "<ul doc-container=\"list\"></ul>",
                "label": "Unordered List",
                "properties": [
                    "text-styles",
                    "list-styles"
                ],
                "directives": {
                    "list": {
                        "allowedChildren": [
                            "list-item"
                        ]
                    }
                }
            },
            {
                "name": "numbered-list",
                "html": "<ol doc-container=\"list\"></ol>",
                "label": "Numbered List",
                "properties": [
                    "text-styles",
                    "list-styles"
                ],
                "directives": {
                    "list": {
                        "allowedChildren": [
                            "list-item"
                        ]
                    }
                }
            },
            {
                "name": "list-item",
                "html": "<li doc-editable=\"text\">List item</li>",
                "label": "List item",
                "properties": [
                    "text-styles",
                    "list-styles"
                ],
                "allowedParents": [
                    "numbered-list",
                    "unordered-list"
                ]
            },
            
            {
                "name": "list-group",
                "html": "<ul class=\"list-group\" doc-container=\"list\"></ul>",
                "label": "List",
                "directives": {
                    "list": {
                        "allowedChildren": [
                            "list-group-item",
                            "list-group-box-item"
                        ]
                    }
                }
            },
            {
                "name": "numbered-list-group",
                "html": "<ol class=\"list-group\" doc-container=\"list\"></ol>",
                "label": "Ordered List",
                "directives": {
                    "list": {
                        "allowedChildren": [
                            "list-group-item"
                        ]
                    }
                }
            },
            {
                "name": "list-group-item",
                "html": "<li class=\"list-group-item\" doc-editable=\"text\">List item</li>",
                "label": "List group item",
                "allowedParents": [
                    "list-group",
                    'numbered-list-group'
                ]
            },
        ],
        "prefilledComponents": {
            "table": {
                "components": {
                    "tablehead": [
                        {
                            "identifier": "bootstrap4.tablerow",
                            "containers": {
                                "rowcells": [
                                    {
                                        identifier: "bootstrap4.headercell",
                                        "containers": {
                                            "cellitems": [
                                                {
                                                    "identifier": "p"
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        identifier: "bootstrap4.headercell",
                                        "containers": {
                                            "cellitems": [
                                                {
                                                    "identifier": "p"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    "tablebody": [
                        {
                            "identifier": "bootstrap4.tablerow",
                            "containers": {
                                "rowcells": [
                                    {
                                        identifier: "bootstrap4.tablecell",
                                        "containers": {
                                            "cellitems": [
                                                {
                                                    "identifier": "wysiwyg"
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        identifier: "bootstrap4.tablecell",
                                        "containers": {
                                            "cellitems": [
                                                {
                                                    "identifier": "wysiwyg"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        "compounds": {
            "content_section": {
                label: "Content section",
                components: [
                    {
                        "identifier": "bootstrap4.block",
                        "styles": { "div-styles": "container" },   /* key value listing */
                        "data": {
                        },
                        "containers": {
                            "layout": [        // the name of the container inside the component to add to
                                {
                                    "identifier": "bootstrap4.row",
                                    "styles": {
                                    },
                                    "data": {},
                                    "containers": {
                                        "row": [
                                            {
                                                "identifier": "bootstrap4.column",
                                                "data_attributes": {}
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            "hero_banner": {
                label: "Hero banner",
                components: [
                    {
                        "identifier": "bootstrap4.row",
                        "content": {
                            "bgimage": {
                                "url": ""
                            }
                        },
                        "styles": {
                            "position-relative": "",
                            "display": ""
                        },
                        "data": {
                            "data_attributes": {
                                "bgimage": {
                                    "alt": "Ball on grasss",
                                    "title": "Not campaign",
                                    "width": "",
                                    "height": ""
                                }
                            },
                            "element_styles": {
                                "min-height": "450px",
                                "background-size": "auto 140%",
                                "background-repeat": "no-repeat",
                                "background-position": "right top",
                                "background-attachment": "",
                                "height": "25%",
                                "margin": "0px"
                            }
                        },
                        "containers": {
                            "row": [
                                {
                                    "identifier": "bootstrap4.block",
                                    "styles": {
                                        "div-styles": "container",
                                        "position-relative": "position-relative"
                                    },
                                    "data": {
                                        "element_styles": {
                                            "padding": "0px"
                                        }
                                    },
                                    "containers": {
                                        "layout": [
                                            {
                                                "identifier": "bootstrap4.block",
                                                "styles": {
                                                    "position-absolute": "position-absolute"
                                                },
                                                "data": {
                                                    "element_styles": {
                                                        "width": "20%",
                                                        "height": "auto",
                                                        "min-height": "250px",
                                                        "top": "30%",
                                                        "left": "",
                                                        "background": "#fff",
                                                        "right": "",
                                                        "min-width": "440px",
                                                        "padding": "3rem"
                                                    }
                                                },
                                                "containers": {
                                                    "layout": [
                                                        {
                                                            "identifier": "bootstrap4.h2",
                                                            "content": {
                                                                "title": "Get me to the place"
                                                            }
                                                        },
                                                        {
                                                            "identifier": "bootstrap4.wysiwyg",
                                                            "content": {
                                                                "html": "<p>As the  <a href=\"[sitetree_link,id=6]\" title=\"\" target=\"\"> Partner</a> of the Finals Series!</p><p></p>"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "identifier": "bootstrap4.block",
                                                "styles": {
                                                    "position-absolute": "position-absolute"
                                                },
                                                "data": {
                                                    "element_styles": {
                                                        "width": "20%",
                                                        "height": "20%",
                                                        "background-color": "",
                                                        "top": "45px",
                                                        "left": "",
                                                        "background-size": ""
                                                    }
                                                },
                                                "containers": {
                                                    "layout": [
                                                        {
                                                            "identifier": "bootstrap4.image",
                                                            "data": {
                                                                "data_attributes": {
                                                                    "image": {
                                                                        "alt": "",
                                                                        "title": "Logo",
                                                                        "width": "",
                                                                        "height": ""
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    };
    if (typeof module !== 'undefined' && module.exports) {
        return module.exports = designJSON;
    } else {
        this.design = this.design || {};
        this.design.bootstrap4 = designJSON;
    }

    // now update the design style options programmatically
    var sizeLabels = {
        'sm': 'Small',
        'md': 'Medium',
        'lg': 'Large'
    };

    for (var screen in sizeLabels) {
        var opt = {
            'caption': sizeLabels[screen] + ' and up',
            'value': 'col-' + screen
        }
        designJSON.componentProperties['column-width'].options.push(opt);

        for (var i = 1; i < 13; i++) {
            var opt = {
                'caption': sizeLabels[screen] + ' ' + i + ' wide',
                'value': 'col-' + screen + '-' + i
            }
            designJSON.componentProperties['column-width'].options.push(opt);
        }

        designJSON.componentProperties['column-margin'].options.push({
            'caption': sizeLabels[screen] + ' auto left margin',
            'value': 'ml-' + screen + '-auto'
        });
        designJSON.componentProperties['column-margin'].options.push({
            'caption': sizeLabels[screen] + ' auto right margin',
            'value': 'mr-' + screen + '-auto'
        });
    }


}).call(this);
