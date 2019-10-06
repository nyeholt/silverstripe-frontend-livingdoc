(function () {
    var designJSON = {
        "name": "bootstrap3",
        "label": "Bootstrap 3",
        "version": "0.0.1",
        "author": "upfront.io",
        "assets": {
            "basePath": 'frontend-livingdoc/',
            "css": [
                "./css/base.css"
            ]
        },
        "wrapper": "<div class='doc-section'></div>",
        "componentProperties": {
            "well-large": {
                "label": "Large",
                "type": "option",
                "value": "well-lg"
            },
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
            "custom-class": {
                "label": "Custom Styles",
                "type": "text",
                "value": "fillitin"
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
            "padded-styles": {
                "label": "Padding",
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
                        "caption": "Padded Top",
                        'value': "padded-top"
                    },
                    {
                        "caption": "Padded Right",
                        'value': "padded-right"
                    },
                    {
                        "caption": "Padded Bottom",
                        'value': "padded-bottom"
                    },
                    {
                        "caption": "Padded Left",
                        'value': "padded-left"
                    },
                    {
                        "caption": "Margin Top",
                        'value': "top-margin"
                    },
                    {
                        "caption": "Margin Right",
                        'value': "right-margin"
                    },
                    {
                        "caption": "Margin Bottom",
                        'value': "bottom-margin"
                    },
                    {
                        "caption": "Padded Left",
                        'value': "left-margin"
                    }
                    
                ]
            },
            "column-width": {
                "label": "Width",
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
            "column-float": {
                "label": "Float",
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
            'background-styles': {
                'label': 'Background',
                'type': 'select',
                'options': [
                    {
                        "caption": "None"
                    }
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
                    }
                ]
            },
            "panel-styles": {
                "label": "Panel Styles",
                "type": "select",
                "options": [
                    {
                        "caption": "Default"
                    },
                    {
                        "caption": "Primary",
                        "value": "panel-primary"
                    },
                    {
                        "caption": "Success",
                        "value": "panel-success"
                    },
                    {
                        "caption": "Info",
                        "value": "panel-info"
                    },
                    {
                        "caption": "Warning",
                        "value": "panel-warning"
                    },
                    {
                        "caption": "Danger",
                        "value": "panel-danger"
                    }
                ]
            }
        },
        "groups": [
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
                "label": "Text",
                "components": [
                    "p",
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
                    'teaser'
                ]
            },
            {
                "label": "Embeds",
                "components": [
                    "embeddeditem"
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
                "label": "Layout",
                "components": [
                    "block",
                    "section",
                    "pagecontainer",
                    "row",
                    "column",
                    "panel",
                    "main-and-sidebar",
                    "well"
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
                "name": "wysiwyg",
                "html": "<div doc-wysiwyg=\"content\">Wyswiyg content</div>",
                "label": "WYSIWYG",
                "properties": [
                    'text-styles'
                ]
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
                "name": "well",
                "html": "<div class=\"well\" doc-container=\"well\">\n</div>",
                "label": "Well",
                "properties": [
                    "well-large"
                ]
            },
            {
                "name": "section",
                "html": "<section class=\"page-section container\" doc-container=\"section\">\n</section>",
                "label": "Section",
                "properties": [
                    "section-class",
                    "background-styles",
                    "padded-styles",
                    "text-styles"
                ]
            },
            {
                "name": "pagecontainer",
                "html": "<div class=\"container\" doc-container=\"container\">\n</div>",
                "label": "Simple container",
                "properties": [
                    "section-class",
                    "background-styles",
                    "padded-styles",
                    "text-styles"
                ]
            },
            {
                "name": "row",
                "html": "<div class=\"row\" doc-container=\"row\" doc-image=\"bgimage\">\n</div>",
                "label": "Row",
                "properties": [
                    "background-styles",
                    "padded-styles",
                    "text-styles"
                ],
                "directives": {
                    "row": {
                        "allowedChildren": [
                            "column"
                        ]
                    }
                }
            },
            {
                "name": "column",
                "html": "<div class=\"col\" doc-container=\"column\">\n</div>",
                "label": "Column",
                "allowedParents": [
                    "row"
                ],
                "properties": [
                    "background-styles",
                    "padded-styles",
                    "text-styles",
                    "column-width",
                    'column-float'
                ]
            },
            {
                "name": "panel",
                "html": "<div class=\"panel panel-default\">\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\" doc-editable=\"title\">Panel Title</h3>\n  </div>\n  <div class=\"panel-body\" doc-editable=\"body\">\n    Panel content\n  </div>\n</div>",
                "label": "Panel",
                "properties": [
                    "panel-styles"
                ]
            },
            {
                "name": "block",
                "html": "<div class=\"\" doc-container=\"layout\">\n</div>",
                "label": "Empty block",
                // "allowedParents": [
                    // "row"
                // ],
                "properties": [
                    "position-relative",
                    "position-absolute",
                    "background-styles",
                    "padded-styles",
                    "text-styles",
                    "column-width",
                    'column-float'
                ]
            },
            {
                "name": "table",
                "html": "<table><thead doc-container=\"tablehead\"></thead><tbody doc-container=\"tablebody\"></tbody></table>",
                "label": "Table",
                "properties": [
                    "background-styles",
                    "padded-styles",
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
                    "background-styles",
                    "padded-styles",
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
                    "background-styles",
                    "padded-styles",
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
                    "background-styles",
                    "padded-styles",
                    "text-styles"
                ],
                "allowedParents": [
                    "tablerow"
                ]
            },
            {
                "name": "main-and-sidebar",
                "html": "<div class=\"row\">\n  <div class=\"col-md-8\" doc-container=\"main\"></div>\n  <div class=\"col-md-4\" doc-container=\"sidebar\"></div>\n</div>",
                "label": "Main and Sidebar"
            },
            {
                "name": "h1",
                "html": "<h1 class=\"title\" doc-editable=\"title\">\n  Title\n</h1>",
                "label": "Title H1"
            },
            {
                "name": "h2",
                "html": "<h2 class=\"title\" doc-editable=\"title\">\n  Title\n</h2>",
                "label": "Title H2"
            },
            {
                "name": "h3",
                "html": "<h3 class=\"title\" doc-editable=\"title\">\n  Title\n</h3>",
                "label": "Title H3"
            },
            {
                "name": "h4",
                "html": "<h4 class=\"title\" doc-editable=\"title\">\n  Title\n</h4>",
                "label": "Title H4"
            },
            {
                "name": "h5",
                "html": "<h5 class=\"title\" doc-editable=\"title\">\n  Title\n</h5>",
                "label": "Title h5"
            },
            {
                "name": "image",
                "html": "<figure>\n\
             <img doc-image=\"image\" class=\"img-responsive\">\n\
                <figcaption doc-editable=\"caption\">\n\
                Caption.\n\
                </figcaption>\n</figure>",
                "label": "Image"
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
            {
                "name": "teaser",
                "html": "<div class=\"thumbnail\">\n  <a doc-link=\"link\" href=\"#\">\n    <img doc-image=\"image\">\n    <div class=\"caption\">\n      <h3 doc-editable=\"label\">Label</h3>\n      <p doc-editable=\"description\">Description</p></div>\n</a>\n</div>",
                "label": "Teaser"
            }
            
        ],
        "prefilledComponents": {
            "table": {
                "components": {
                    "tablehead": [
                        {
                            "identifier": "bootstrap3.tablerow",
                            "containers": {
                                "rowcells": [
                                    {
                                        identifier: "bootstrap3.headercell",
                                        "containers": {
                                            "cellitems": [
                                                {
                                                    "identifier": "p"
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        identifier: "bootstrap3.headercell",
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
                            "identifier": "bootstrap3.tablerow",
                            "containers": {
                                "rowcells": [
                                    {
                                        identifier: "bootstrap3.tablecell",
                                        "containers": {
                                            "cellitems": [
                                                {
                                                    "identifier": "wysiwyg"
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        identifier: "bootstrap3.tablecell",
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
        "structures": [
            {
                label: "Content section",
                components: [
                    {
                        "identifier": "bootstrap3.section",
                        "styles": {"section-class" : "container"},   /* key value listing */
                        "data": {
                            "data_attributes": {
                                "section": {
                                    "data-sample": "add your own attributes in this collection"
                                }
                            }, /* inner-directive => { }  */
                        },
                        "containers": {
                            "section": [        // the name of the container inside the component to add to
                                {
                                    "identifier": "bootstrap3.row",
                                    "styles": {
                                        "text-styles": "text-center"
                                    },
                                    "data": {},
                                    "containers": {
                                        "row": [
                                            {
                                                "identifier": "bootstrap3.column",
                                                "data_attributes": {}
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    };
    if (typeof module !== 'undefined' && module.exports) {
        return module.exports = designJSON;
    } else {
        this.design = this.design || {};
        this.design.bootstrap3 = designJSON;
    }
    
    // now update the design style options programmatically
    var sizeLabels = {
        'sm': 'Small',
        'md': 'Medium', 
        'lg': 'Large'
    };
    
    for (var screen in sizeLabels) {
        for (var i = 1; i < 13; i++) {
            var opt = {
                'caption' : sizeLabels[screen] + ' ' + i + ' wide',
                'value' : 'col-' + screen + '-' + i
            }
            designJSON.componentProperties['column-width'].options.push(opt);
            
            var pushOpt = {
                'caption': sizeLabels[screen] + ' push ' + i,
                'value': 'col-' + screen + '-push-' + i
            };
            var pullOpt = {
                'caption': sizeLabels[screen] + ' pull ' + i,
                'value': 'col-' + screen + '-pull-' + i
            };
            
            designJSON.componentProperties['column-float'].options.push(pushOpt);
            designJSON.componentProperties['column-float'].options.push(pullOpt);
        }
    }

    
}).call(this);