import * as $ from 'jquery';
import LivingDocState from '../lib/LivingDocState';
import { TextField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';
import { SelectField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/SelectField';

var STYLES_PROP = 'element_styles';

export function createStyleEditor(component, editContainer) {
    let customStyles = component.model.getData(STYLES_PROP);
    if (!customStyles) {
        customStyles = {};
    }

    let fields = {
        "extraClasses": new TextField({
            label: "Extra CSS classes",
            value: customStyles['extraClasses'] || ''
        }),
        "display": new SelectField({
            label: "Display",
            value: customStyles['display'] || '',
            options: [
                {value: "", label: "Default"},
                {value: 'block', label: 'Block'},
                {value: 'inline-block', label: 'Inline Block'},
                {value: 'inline', label: 'Inline'},
                {value: 'flex', label: "Flex"}
            ]
        }),
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
        "background": new TextField({
            label: 'Background',
            value: customStyles['background'] || '',
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
        "text-align": new TextField({
            label: "Text alignment",
            value: customStyles['text-align'] || '',
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

    if (customStyles['display'] == 'flex') {
        fields["flex-direction"] = new SelectField({
            label: "Flex direction",
            value: customStyles['flex-direction'] || '',
            options: [
                {value: "", label: "Default"},
                {value: 'row', label: 'row'},
                {value: 'row-reverse', label: 'row-reverse'},
                {value: 'column', label: 'column'},
                {value: 'column-reverse', label: "column-reverse"}
            ]
        });
        fields["flex-wrap"] = new SelectField({
            label: "Flex wrap",
            value: customStyles['flex-wrap'] || '',
            options: [
                {value: "", label: "Default"},
                {value: 'nowrap', label: 'nowrap'},
                {value: 'wrap', label: 'wrap'},
                {value: 'wrap-reverse', label: 'wrap-reverse'}
            ]
        });
        fields["justify-content"] = new SelectField({
            label: "Justify content",
            value: customStyles['justify-content'] || '',
            options: [
                {value: "", label: "Default"},
                {value: 'flex-start', label: 'flex-start'},
                {value: 'flex-end', label: 'flex-end'},
                {value: 'center', label: 'center'},
                {value: 'space-between', label: 'space-between'},
                {value: 'space-around', label: 'space-around'},
                {value: 'space-evenly', label: 'space-evenly'},
                {value: 'start', label: 'start'},
                {value: 'end', label: 'end'},
                {value: 'left', label: 'left'},
                {value: 'right', label: 'right'},
            ]
        });

        fields["align-items"] = new SelectField({
            label: "Align Items",
            value: customStyles['align-items'] || '',
            options: [
                {value: "", label: "Default"},
                {value: 'flex-start', label: 'flex-start'},
                {value: 'flex-end', label: 'flex-end'},
                {value: 'center', label: 'center'},
                {value: 'stretch', label: 'stretch'},
                {value: 'baseline', label: 'baseline'},
                {value: 'first baseline', label: 'first baseline'},
                {value: 'last baseline', label: 'last baseline'},
                {value: 'start', label: 'start'},
                {value: 'end', label: 'end'},
                {value: 'self-start', label: 'self-start'},
                {value: 'self-end', label: 'self-end'},
            ]
        });

        fields["align-content"] = new SelectField({
            label: "Align content",
            value: customStyles['align-content'] || '',
            options: [
                {value: "", label: "Default"},
                {value: 'flex-start', label: 'flex-start'},
                {value: 'flex-end', label: 'flex-end'},
                {value: 'center', label: 'center'},
                {value: 'stretch', label: 'stretch'},
                {value: 'space-between', label: 'space-between'},
                {value: 'space-around', label: 'space-around'},
                {value: 'space-evenly', label: 'space-evenly'},
                {value: 'start', label: 'start'},
                {value: 'end', label: 'end'},
                {value: 'baseline', label: 'baseline'},
                {value: 'first baseline', label: 'first baseline'},
                {value: 'last baseline', label: 'last baseline'},
            ]
        });
    }

    if (!editContainer) {
        editContainer = $('.livingdocs-item-properties')[0];
    }

    openPrompt({
        title: "Component Styles",
        fields: fields,
        forceRemainOpen: true,
        hideButtons: true,
        update: function (name, value) {
            let currentStyles = component.model.getData(STYLES_PROP);
            if (!currentStyles) {
                currentStyles = {};
            }

            if (name == 'extraClasses' && currentStyles['extraClasses']) {
                for (var style of currentStyles['extraClasses'].split(' ')) {
                    component.$html.removeClass(style);
                }
            }

            let newStyles = {
                ...currentStyles,
            }

            // if (!value || value.length == 0) {
            //     delete newStyles[name];
            // } else {
            //     newStyles[name] = value;
            // }

            newStyles[name] = value;
            
            component.model.setData(STYLES_PROP, newStyles);
            if (name == 'extraClasses') {
                for (var style of value.split(' ')) {
                    component.$html.addClass(style);
                }
            } else {
                updateComponentStyles(component, newStyles);
            }
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
    // component.$html.attr('style', '');
    for (let name in styleset) {
        component.$html.css(name, styleset[name]);
    }
}
