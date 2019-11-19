import { imageSelectorDialog } from "../../../../vendor/symbiote/silverstripe-prose-editor/editor/src/plugins/ss-image-selector";

export function selectImage(component, img, directiveId) {
    let params = {};
    params.src = component.model.get(img.name);
    params.width = component.model.getDirectiveAttribute(img.name, "width");
    params.height = component.model.getDirectiveAttribute(img.name, "height");
    params.alt = component.model.getDirectiveAttribute(img.name, "alt");
    params.title = component.model.getDirectiveAttribute(img.name, "title");
    params.id = component.model.getDirectiveAttribute(img.name, "data-id");

    imageSelectorDialog(params, function (newAttrs) {
        component.model.setDirectiveAttribute(img.name, 'alt', newAttrs.alt);
        component.model.setDirectiveAttribute(img.name, 'title', newAttrs.title);
        component.model.setDirectiveAttribute(img.name, 'width', newAttrs.width);
        component.model.setDirectiveAttribute(img.name, 'height', newAttrs.height);
        component.model.setDirectiveAttribute(img.name, 'data-id', newAttrs.imageId.id);
        component.model.setContent(img.name, { url: newAttrs.src });
    }, ['imageId', 'src', 'title', 'alt', 'width', 'height']);
}
