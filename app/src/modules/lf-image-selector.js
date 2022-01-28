import { imageSelectorDialog } from "../../../../../symbiote/silverstripe-prose-editor/editor/src/plugins/ss-image-selector";
import { refresh_property_editor } from "../lib/ld-property-editor";

export function selectImage(component, img, directiveId, path) {
    let params = {};
    params.src = component.model.get(img.name);
    params.width = component.model.getDirectiveAttribute(img.name, "width");
    params.height = component.model.getDirectiveAttribute(img.name, "height");
    params.alt = component.model.getDirectiveAttribute(img.name, "alt");
    params.title = component.model.getDirectiveAttribute(img.name, "title");
    const imageId = component.model.getDirectiveAttribute(img.name, "data-id") ? component.model.getDirectiveAttribute(img.name, "data-id") : component.model.getDirectiveAttribute(img.name, "data-imageid");
    params.id = imageId;

    params.uploadPath = path;

    imageSelectorDialog(params, function (newAttrs) {
        component.model.setDirectiveAttribute(img.name, 'alt', newAttrs.alt);
        component.model.setDirectiveAttribute(img.name, 'title', newAttrs.title);
        component.model.setDirectiveAttribute(img.name, 'width', newAttrs.width);
        component.model.setDirectiveAttribute(img.name, 'height', newAttrs.height);
        if (newAttrs.imageSel.id) {
            component.model.setDirectiveAttribute(img.name, 'data-imageid', newAttrs.imageSel.id);
        }

        component.model.setContent(img.name, { url: newAttrs.src ? newAttrs.src : '' });

        refresh_property_editor(component);
    });
}
