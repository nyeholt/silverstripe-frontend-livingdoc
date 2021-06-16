import * as $ from 'jquery';
import LivingDocState from '../lib/LivingDocState';
import { TextField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';
import { SelectField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/SelectField';
import { FourSideEditorField } from './fields/FourSideEditorField';

var STYLES_PROP = 'element_styles';

class StyleList {
    styles = [];

    constructor(styles) {
        if (Array.isArray(styles)) {
            this.styles = [ ... styles];
        } else {
            this.fromMap(styles);
        }
    }

    removeStyle(name) {
        this.styles = this.styles.filter((item) => {
            return item.name !== name;
        })
    }

    addStyle(name, value) {
        let update = false;
        this.styles.forEach((item) => {
            if (item.name == name) {
                update = true;
                if (!value || value.length === 0) {
                    item.style = 'inherit';
                } else {
                    item.style = value;
                }
            }
        })
        if (!update) {
            this.styles.push({
                name: name,
                style: value,
            });
        }
    }

    fromMap(map) {
        if (!map) {
            return;
        }
        this.styles = Object.keys(map).map((key) => { return { name: key, style: map[key] } });
    }

    toMap() {
        const map = {};
        this.styles.forEach((item) => {
            map[item.name] = item.style;
        });
        return map;
    }
}

export function createStyleEditor(component, editContainer) {

    let styleList = component.model.getData(STYLES_PROP);

    let appliedStyles = new StyleList(styleList);

    const customStyles = appliedStyles.toMap();

    let fields = {
        "extraClasses": new TextField({
            label: "Extra CSS classes",
            value: customStyles['extraClasses'] || ''
        }),
        "display": new SelectField({
            label: "Display",
            value: customStyles['display'] || '',
            options: [
                { value: "", label: "Default" },
                { value: 'block', label: 'Block' },
                { value: 'inline-block', label: 'Inline Block' },
                { value: 'inline', label: 'Inline' },
                { value: 'flex', label: "Flex" }
            ]
        }),
        "flex": new TextField({
            label: "Flex",
            value: customStyles['flex'] || '',
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
        'padding': new FourSideEditorField({
            name: "padding",
            label: "Padding",
            value: customStyles['padding_values'] || {}
        }),
        'margin': new FourSideEditorField({
            name: "margin",
            label: "Margin",
            value: customStyles['margin_values'] || {}
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
        "line-height": new TextField({
            label: "Line height",
            value: customStyles['line-height'] || '',
        }),
        'border': new FourSideEditorField({
            name: "border",
            value: customStyles['border_values'] || {}
        })
    };

    // fields['background-color'].textType = 'color';
    fields.color.textType = 'color';

    if (component.model.styles['position-absolute']) {
        fields['layout-position'] = new FourSideEditorField({
            name: "layout-position",
            label: "Position",
            value: customStyles['layout-position_values'] || {},
            nobase: true,
            noprefix: true,
        });
    }

    if (customStyles['display'] == 'flex') {
        fields["flex-direction"] = new SelectField({
            label: "Flex direction",
            value: customStyles['flex-direction'] || '',
            options: [
                { value: "", label: "Default" },
                { value: 'row', label: 'row' },
                { value: 'row-reverse', label: 'row-reverse' },
                { value: 'column', label: 'column' },
                { value: 'column-reverse', label: "column-reverse" }
            ]
        });
        fields["flex-wrap"] = new SelectField({
            label: "Flex wrap",
            value: customStyles['flex-wrap'] || '',
            options: [
                { value: "", label: "Default" },
                { value: 'nowrap', label: 'nowrap' },
                { value: 'wrap', label: 'wrap' },
                { value: 'wrap-reverse', label: 'wrap-reverse' }
            ]
        });
        fields["justify-content"] = new SelectField({
            label: "Justify content",
            value: customStyles['justify-content'] || '',
            options: [
                { value: "", label: "Default" },
                { value: 'flex-start', label: 'flex-start' },
                { value: 'flex-end', label: 'flex-end' },
                { value: 'center', label: 'center' },
                { value: 'space-between', label: 'space-between' },
                { value: 'space-around', label: 'space-around' },
                { value: 'space-evenly', label: 'space-evenly' },
                { value: 'start', label: 'start' },
                { value: 'end', label: 'end' },
                { value: 'left', label: 'left' },
                { value: 'right', label: 'right' },
            ]
        });

        fields["align-items"] = new SelectField({
            label: "Align Items",
            value: customStyles['align-items'] || '',
            options: [
                { value: "", label: "Default" },
                { value: 'flex-start', label: 'flex-start' },
                { value: 'flex-end', label: 'flex-end' },
                { value: 'center', label: 'center' },
                { value: 'stretch', label: 'stretch' },
                { value: 'baseline', label: 'baseline' },
                { value: 'first baseline', label: 'first baseline' },
                { value: 'last baseline', label: 'last baseline' },
                { value: 'start', label: 'start' },
                { value: 'end', label: 'end' },
                { value: 'self-start', label: 'self-start' },
                { value: 'self-end', label: 'self-end' },
            ]
        });

        fields["align-content"] = new SelectField({
            label: "Align content",
            value: customStyles['align-content'] || '',
            options: [
                { value: "", label: "Default" },
                { value: 'flex-start', label: 'flex-start' },
                { value: 'flex-end', label: 'flex-end' },
                { value: 'center', label: 'center' },
                { value: 'stretch', label: 'stretch' },
                { value: 'space-between', label: 'space-between' },
                { value: 'space-around', label: 'space-around' },
                { value: 'space-evenly', label: 'space-evenly' },
                { value: 'start', label: 'start' },
                { value: 'end', label: 'end' },
                { value: 'baseline', label: 'baseline' },
                { value: 'first baseline', label: 'first baseline' },
                { value: 'last baseline', label: 'last baseline' },
            ]
        });
    }

    if (!editContainer) {
        editContainer = $('.livingdocs-item-properties')[0];
    }

    openPrompt({
        title: component.model.componentName + " styles",
        fields: fields,
        forceRemainOpen: true,
        hideButtons: true,
        update: function (name, value) {
            let currentStyleData = component.model.getData(STYLES_PROP);

            let currentStyles = new StyleList(currentStyleData);

            const newStyleMap = currentStyles.toMap();

            if (name == 'extraClasses' && newStyleMap['extraClasses']) {
                for (var style of newStyleMap['extraClasses'].split(' ')) {
                    component.$html.removeClass(style);
                }
            }

            // if (!value || value.length == 0) {
            //     delete newStyles[name];
            // } else {
            //     newStyles[name] = value;
            // }

            if (fields[name] && fields[name].constructor.name == 'FourSideEditorField') {
                currentStyles.addStyle(name + '_values', value);
                const fieldNames = ['base', 'top', 'left', 'bottom', 'right'];

                const prefix = fields[name].options.noprefix ? '' : name + '-';

                fieldNames.forEach((f) => {
                    const fname = f == 'base' ? name : prefix + f;
                    currentStyles.removeStyle(fname);
                    component.$html.css(fname, '');
                });

                fieldNames.forEach((f) => {
                    const fname = f == 'base' ? name : prefix + f;
                    if (value[f]) {
                        currentStyles.addStyle(fname, value[f]);
                    }
                })
            } else {
                currentStyles.addStyle(name, value);
            }

            component.model.setData(STYLES_PROP, currentStyles.styles);
            if (name == 'extraClasses') {
                for (var style of value.split(' ')) {
                    component.$html.addClass(style);
                }
            } else {
                updateComponentStyles(component, currentStyles.styles);
            }
        },
        callback: function callback(attrs) {

        },
        cancel: function () {
            component.model.setData(STYLES_PROP, appliedStyles.styles);
            updateComponentStyles(component, appliedStyles.styles);
        }
    }, editContainer);
}

function updateComponentStyles(component, styleset) {
    styleset.forEach((styleitem) => {
        if (typeof styleitem.style == "object") {
            return;
        }
        component.$html.css(styleitem.name, styleitem.style);
    })
}
