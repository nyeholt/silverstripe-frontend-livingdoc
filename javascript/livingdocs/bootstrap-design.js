(function () { var designJSON = {
  "name": "bootstrap3",
  "label": "Bootstrap 3",
  "version": "0.0.1",
  "author": "upfront.io",
  "assets": {
    "css": [
      "./css/base.css"
    ]
  },
  "wrapper": "<div class='container doc-section'></div>",
  "componentProperties": {
    "well-large": {
      "label": "Large",
      "type": "option",
      "value": "well-lg"
    },
    "custom-class": {
        "label": "Custom Styles",
        "type": "text",
        "value": "fillitin"
    },
    "column-class": {
        "label": "Column Styles",
        "type": "text",
        "value": "col"
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
        "h2"
      ]
    },
    {
      "label": "Text",
      "components": [
        "p",
        "quote"
      ]
    },
    {
      "label": "Images",
      "components": [
        "image"
      ]
    },
    {
      "label": "Embeds",
      "components": [
        "media"
      ]
    },
    {
      "label": "Lists",
      "components": [
        "list-group",
        "list-group-item"
      ]
    },
    {
      "label": "Layout",
      "components": [
        "section",
        "row",
        "column",
        "panel",
        "main-and-sidebar",
        "well"
      ]
    }
  ],
  "defaultComponents": {
    "paragraph": "p",
    "image": "image"
  },
  "defaultContent": [
    {
      "component": "header"
    },
    {
      "component": "p"
    }
  ],
  "prefilledComponents": {},
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
      "name": "well",
      "html": "<div class=\"well\" doc-container=\"well\">\n</div>",
      "label": "Well",
      "properties": [
        "well-large"
      ]
    },
    {
        "name": "section",
        "html": "<section class=\"page-section\"><div class=\"container\" doc-container=\"section\">\n</div>\n</div>",
        "label": "Section",
        "properties": [
            "custom-class"
        ]
    },
    {
        "name": "row",
        "html": "<div class=\"row\" doc-container=\"row\">\n</div>",
        "label": "Row",
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
            "custom-class"
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
      "name": "main-and-sidebar",
      "html": "<div class=\"row\">\n  <div class=\"col-md-8\" doc-container=\"main\"></div>\n  <div class=\"col-md-4\" doc-container=\"sidebar\"></div>\n</div>",
      "label": "Main and Sidebar"
    },
    
    {
      "name": "header",
      "html": "<div class=\"page-header\">\n  <h1 doc-editable=\"title\">Example page header Subtext for header</h1>\n</div>",
      "label": "Header"
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
      "name": "list-group",
      "html": "<ul class=\"list-group\" doc-container=\"list\"></ul>",
      "label": "List Group",
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
      "name": "list-group-item",
      "html": "<li class=\"list-group-item\" doc-editable=\"text\">List item</li>",
      "label": "List Group Item",
      "allowedParents": [
        "list-group"
      ]
    },
    {
      "name": "teaser",
      "html": "<div class=\"thumbnail\">\n  <a doc-link=\"link\" href=\"#\">\n    <img doc-image=\"image\">\n    <div class=\"caption\">\n      <h3 doc-editable=\"label\">Label</h3>\n      <p doc-editable=\"description\">Description</p></div>\n</a>\n</div>",
      "label": "Teaser"
    },
    {
      "name": "p",
      "html": "<p doc-editable=\"text\">Paragraph content</p>",
      "label": "Paragraph"
    },
    {
      "name": "quote",
      "html": "<blockquote>\n  <p>\n    <span class=\"quotation-mark\">&#x201C;</span><span class=\"quote\" doc-editable=\"text\">Quotation</span>\n  </p>\n  <div class=\"caption\" doc-editable=\"author\">Author</div>\n</blockquote>",
      "label": "Quote"
    }
  ]
}; if(typeof module !== 'undefined' && module.exports) {return module.exports = designJSON;} else { this.design = this.design || {}; this.design.bootstrap3 = designJSON;} }).call(this);