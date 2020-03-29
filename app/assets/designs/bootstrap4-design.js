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
                        "value": ".sr-only"
                    },
                    {
                        "caption": "Screen reader focused",
                        "value": ".sr-only-focusable"
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
        },
        "groups": [
            {
                "label": "Modules",
                "components": [
                    "content_section",
                ]
            },
            {
                "label": "Text",
                "components": [
                    "p",
                    "buttonlink",
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
                    "embeddeditem"
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
                    "h5"
                ]
            },
            {
                "label": "Lists",
                "components": [
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
                "html": "<div doc-embeditem=\"object\">Select an item...\n</div>",
                "label": "Embed object"
            },
            {
                "name": "p",
                "html": "<p doc-editable=\"text\">Paragraph</p>",
                "label": "Paragraph",
                "properties": [
                    'text-styles'
                ]
            },
            {
                "name": "buttonlink",
                "html": "<a doc-link=\"Link\" class=\"btn\">Link</a>",
                "label": "Button",
                "properties": [
                    'button-styles'
                ]
            },
            {
                "name": "wysiwyg",
                "html": "<div doc-wysiwyg=\"html\">Wyswiyg content</div>",
                "label": "WYSIWYG"
            },
            {
                "name": "quote",
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
                "html": "<div class=\"\" doc-container=\"layout\">\n</div>",
                "label": "Empty block",
                // "allowedParents": [
                // "row"
                // ],
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
                "html": "<div class=\"card-layout\" doc-container=\"cards\">\n</div>",
                "label": "Card layout",
                "properties": [
                    "display",
                    "card-layout"
                ]
            },
            {
                "name": "card",
                "html": "<div class=\"card\" doc-container=\"carditems\">\n</div>",
                "label": "Card",
                "properties": [
                    "display",
                    "text-styles"
                ]
            },
            {
                "name": "cardbody",
                "html": "<div class=\"\" doc-container=\"bodyitems\">\n</div>",
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
                "html": "<a doc-link=\"Link\" class=\"card-link\" href=\"#\">\nLink</a>",
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
                "html": "<img doc-image=\"Image\" class=\"\" />",
                "label": "Card image",
                "allowedParents": [
                    "card"
                ],
                "properties": [
                    "card-images"
                ]
            }
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
