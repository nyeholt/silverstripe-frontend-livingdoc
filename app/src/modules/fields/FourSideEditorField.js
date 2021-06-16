import { Field } from "../../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/Field";
import { TextField } from "../../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField";

import './FourSideEditorField.scss';

export class FourSideEditorField extends Field {
    textType = "text";

    read(dom) {
        const fieldNames = ['top', 'left', 'base', 'right', 'bottom'];
        const fieldMap = {};
        const myname = this.options.name ? this.options.name : this.options.label;

        fieldNames.forEach((value) => {
            if (this.options.nobase && value === 'base') {
                return;
            }
            const fieldName = myname + "-" + value;
            const domfield = dom.querySelector('input[name="' + fieldName + '"]');
            fieldMap[value] = domfield ? domfield.value : null;
        });

        return fieldMap;
    }

    render() {

        const container = document.createElement("div");
        container.classList.add('FourSideEditorField');

        const myname = this.options.name ? this.options.name : this.options.label;

        const topRow = document.createElement("div");
        topRow.classList.add('FourSideEditorField_Top', 'FourSideEditorField_Row')
        const midRow = document.createElement("div");
        midRow.classList.add('FourSideEditorField_Middle', 'FourSideEditorField_Row')
        const botRow = document.createElement("div");
        botRow.classList.add('FourSideEditorField_Bottom', 'FourSideEditorField_Row')

        const fieldNames = ['top', 'left', 'base', 'right', 'bottom'];
        const fieldMap = {};

        fieldNames.forEach((value) => {
            const fieldName = myname + "-" + value;
            if (this.options.nobase && value === 'base') {
                return;
            }
            fieldMap[value] = new TextField({
                label: "",
                name: fieldName,
                value: this.options.value[value] || '',
                placeholder: value
            });
        });

        topRow.append(fieldMap['top'].render());
        midRow.append(fieldMap['left'].render())
        fieldMap['base'] && midRow.append(fieldMap['base'].render())
        midRow.append(fieldMap['right'].render());
        botRow.append(fieldMap['bottom'].render());
        container.append(topRow)
        container.append(midRow)
        container.append(botRow);

        container.name = myname;

        return container;
    }
}
