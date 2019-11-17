import { TextareaField } from "../../../../vendor/symbiote/silverstripe-prose-editor/editor/src/fields/TextareaField";
import { openPrompt } from "../../../../vendor/symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt";


export function componentExport(component) {
    // // store the 'next' pointer; the serializer
    // // walks all siblings
    // var oldNext = component.model.next;
    //         component.model.next = null;
    //         var jsonRep = tmpTree.serialize(component.model, true);
    //         component.model.next = oldNext;

    let output = component.model.componentTree.serialize(component.model);

    // our component is in content.[0]
    if (output.content && output.content.length >= 1) {
        output = output.content[0];
    }

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
