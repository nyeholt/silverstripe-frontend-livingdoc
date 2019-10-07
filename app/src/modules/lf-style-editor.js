import * as $ from 'jquery';
import LivingDocState from '../lib/LivingDocState';
import { TextField } from '../../../../vendor/symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../vendor/symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';

var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

export function createStyleEditor(component) {
    let customStyles = component.model.getData('element_styles');
    if (!customStyles) {
        customStyles = {};
    }
    
    let fields = {
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
    };

    let editContainer = $('.livingdocs-item-properties')[0];
    openPrompt({
        title: "Component Styles",
        fields: fields,
        update: function (name, value) {
            let currentStyles = component.model.getData('element_styles');
            if (!currentStyles) {
                currentStyles = {};
            }

            let newStyles = {
                ...currentStyles,
            }
            newStyles[name] = value;
            component.model.setData('element_styles', newStyles);
            updateComponentStyles(component, newStyles);
        },
        callback: function callback(attrs) {
            
        },
        cancel: function () {
            component.model.setData('element_styles', customStyles);
            updateComponentStyles(component, customStyles);
        }
    }, editContainer);
}

function updateComponentStyles(component, styleset) {
    let styleString = '';
    for (let name in styleset) {
        styleString += name + ": " + styleset[name] + ";";
    }
    component.$html.attr('style', styleString);
}