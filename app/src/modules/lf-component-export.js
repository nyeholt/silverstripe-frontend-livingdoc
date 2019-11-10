import { TextareaField } from "../../../../vendor/symbiote/silverstripe-prose-editor/editor/src/fields/TextareaField";
import { openPrompt } from "../../../../vendor/symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt";


export function componentExport(component) {

console.log(component);

    let output = component.model.componentTree.serialize(component.model);

    let fields = {
        "exportdata": new TextareaField({
            name: "exportdata",
            label: "Data",
            value: JSON.stringify(output)
        })
    };

    let editContainer = $('.livingdocs-item-properties')[0];
    openPrompt({
        title: "Export",
        fields: fields,
        update: function (name, value) {

        },
        callback: function callback(attrs) {

        },
        cancel: function () {
        }
    }, editContainer);
}
