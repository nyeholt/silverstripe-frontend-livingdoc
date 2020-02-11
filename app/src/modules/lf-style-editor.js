import * as $ from 'jquery';
import LivingDocState from '../lib/LivingDocState';
import { TextField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';

var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

var STYLES_PROP = 'element_styles';

export function createStyleEditor(component) {
    let customStyles = component.model.getData(STYLES_PROP);
    if (!customStyles) {
        customStyles = {};
    }

    let fields = {
        "width": new TextField({
            label: 'Width',
            value: customStyles['width'] || '',
        }),
        "min-width": new TextField({
            label: 'Minimum Width',
            value: customStyles['min-width'] || '',
        }),
        "height": new TextField({
            label: 'Height',
            value: customStyles['height'] || '',
        }),
        "min-height": new TextField({
            label: 'Minumum Height',
            value: customStyles['min-height'] || '',
        }),
        "padding": new TextField({
            label: 'Padding',
            value: customStyles['padding'] || '',
        }),
        "margin": new TextField({
            label: 'Margin',
            value: customStyles['margin'] || '',
        }),
        "background-color": new TextField({
            label: 'Background Colour',
            value: customStyles['background-color'] || '',
        }),
        'background-size': new TextField({
            label: 'Background Size',
            value: customStyles['background-size'] || '',
        }),
        'background-position': new TextField({
            label: 'Background Position',
            value: customStyles['background-position'] || '',
        }),
        'background-attachment': new TextField({
            label: 'Background Attachment',
            value: customStyles['background-attachment'] || '',
        }),
        "background-repeat": new TextField({
            label: 'Background Repeat',
            value: customStyles['background-repeat'] || '',
        }),
        "object-fit": new TextField({
            label: 'Object fit',
            value: customStyles['object-fit'] || '',
        }),
        "color": new TextField({
            label: "Text colour",
            value: customStyles['color'] || '',
        }),
    };

    // fields['background-color'].textType = 'color';
    fields.color.textType = 'color';

    if (component.model.styles['position-absolute']) {
        fields["top"] = new TextField({
            label: 'Top',
            value: customStyles['top'] || '',
        });
        fields["left"] = new TextField({
            label: 'Left',
            value: customStyles['left'] || '',
        });
        fields["bottom"] = new TextField({
            label: 'Bottom',
            value: customStyles['bottom'] || '',
        });
        fields["right"] = new TextField({
            label: 'Right',
            value: customStyles['right'] || '',
        });
    }

    let editContainer = $('.livingdocs-item-properties')[0];
    openPrompt({
        title: "Component Styles",
        fields: fields,
        update: function (name, value) {
            let currentStyles = component.model.getData(STYLES_PROP);
            if (!currentStyles) {
                currentStyles = {};
            }

            let newStyles = {
                ...currentStyles,
            }
            newStyles[name] = value;
            component.model.setData(STYLES_PROP, newStyles);
            updateComponentStyles(component, newStyles);
        },
        callback: function callback(attrs) {

        },
        cancel: function () {
            component.model.setData(STYLES_PROP, customStyles);
            updateComponentStyles(component, customStyles);
        }
    }, editContainer);
}

function updateComponentStyles(component, styleset) {
    for (let name in styleset) {
        component.$html.css(name, styleset[name]);
    }
}
