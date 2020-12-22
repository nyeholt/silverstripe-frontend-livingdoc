import LivingDocState from "./LivingDocState";
import * as $ from 'jquery';
import { createStyleEditor } from "../modules/lf-style-editor";
import { componentExportForm } from "../modules/lf-component-export";
import { selectImage } from "../modules/lf-image-selector";
import { linkSelectorDialog } from "../../../../../symbiote/silverstripe-prose-editor/editor/src/plugins/ss-link-selector";
import createComponentList from "./createComponentList";
import { select_tab } from "../editor-interface";
import { initialise_attribute_editor } from "../modules/lf-attr-editor";
import { Constants } from "../constants";

var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';
var STYLE_HOLDER = 'livingdocs-style-holder';
var BOTTOM_BAR = '.livingdocs-bottom-bar';

var ITEM_PROPERTIES_HOLDER = '.livingdocs-item-properties';
var ITEM_STYLES_HOLDER = '.livingdocs-item-styles';

$(document).on('click', function (e) {
    if ($(e.target).parents('#livingdocs-container').length <= 0 &&
        $(e.target).parents('.livingdocs-toolbar').length <= 0 &&
        $(e.target).parents(ITEM_PROPERTIES_HOLDER).length <= 0 &&
        $(e.target).parents(BOTTOM_BAR).length <= 0) {
        // remove the properties editing
        select_tab('default');
        $('.' + PROPS_HOLDER).remove();
        $('.' + STYLE_HOLDER).remove();
    }
})

export function initialise_property_editor() {
    LivingDocState.livingdoc.interactiveView.page.focus.componentFocus.add(function (component) {
        $("." + PROPS_HOLDER).remove();
        $('.' + STYLE_HOLDER).remove();
        $(Constants.EDITOR_FRAME).contents().find(Constants.BUTTON_BAR).remove();
        $(Constants.BUTTON_BAR).remove();

        var options = $("<div>").addClass(PROPS_HOLDER);
        var styles = $('<div>').addClass(STYLE_HOLDER);
        var $properties = $(ITEM_PROPERTIES_HOLDER);
        var $styleHolder = $(ITEM_STYLES_HOLDER);

        LivingDocState.focusOn(component);

        options.append("<h4>" + component.model.componentName + " properties</h4>");

        // handles all the 'styles' ie css classes that this
        // component can have
        for (var s_id in component.model.template.styles) {
            var curr_style = component.model.template.styles[s_id];

            var el = null;
            var lbl = $('<label>').text(curr_style.label);

            var currentVal = component.model.getStyle(s_id);

            switch (curr_style.type) {
                case "select":
                    el = $("<select>");
                    var multi = false;
                    // some options will have spaces so
                    // need to detect along the way
                    var selectOpts = [];
                    for (var op_id in curr_style.options) {
                        var curr_op = curr_style.options[op_id];

                        // todo(Marcus) - this is such a hack
                        if (curr_op.caption.toLowerCase() == 'multiple') {
                            multi = true;
                            continue;
                        }

                        if (currentVal && currentVal.length > 0 && currentVal.indexOf(curr_op.value) >= 0) {
                            selectOpts.push(curr_op.value);
                        }

                        if (!currentVal || currentVal.length == 0 && curr_op.value == '') {
                            selectOpts.push('');
                        }

                        el.append($("<option>").val(curr_op.value).text(curr_op.caption))
                    }

                    if (multi) {
                        el.attr('size', 3).prop('multiple', true);
                        // if (currentVal) {
                        //     currentVal = currentVal.split(' ');
                        // }
                    }
                    el.val(selectOpts);

                    el.on("change", function (styleId) {
                        return function () {
                            var selection = $(this).val();
                            if (selection && (typeof selection) !== 'string' && selection.length) {
                                selection = selection.join(' ');
                            }
                            component.model.setStyle(styleId, selection);
                        };
                    }(s_id))
                    break;
                case "text":
                    el = $("<input>").attr({ type: 'text' }).val(currentVal);
                    el.on("change", function (styleName) {
                        return function () {
                            component.model.setStyle(styleName, el.val());
                        };
                        //                                curr_style.value = el.val();
                    }(curr_style.name));
                    break;
                case "option":
                    el = $("<input>").attr({ type: 'checkbox' })
                    el.on("change", function (styleName, styleValue) {
                        return function () {
                            if ($(this).prop('checked')) {
                                component.model.setStyle(styleName, styleValue)
                            } else {
                                component.model.setStyle(styleName, "")
                            }
                        };
                    }(curr_style.name, curr_style.value));
                    if (curr_style.value == currentVal) {
                        el.prop('checked', true);
                    }
                    break;
                default:
                    break;
            }
            if (el) {
                $('<div>').append(el).appendTo(lbl);
                styles.append('<div>').append(lbl);
            }
        }

        if (component.model.directives.image && component.model.directives.image.length) {
            for (var directive_id in component.model.directives.image) {
                var curr_img = component.model.directives.image[directive_id];
                var $image_button = $("<button class='ld-item-selector " + Constants.btnCls('btn-primary') + "'>").text("Select \"" + curr_img.name + '"');
                $image_button.on("click", function (comp, img, did) {
                    return function () {
                        selectImage(comp, img, did);
                    }
                }(component, curr_img, directive_id));
                options.append($image_button)
            }
        }

        if (component.model.directives.link && component.model.directives.link.length) {
            for (var linkIndex in component.model.directives.link) {
                var updateLink = component.model.directives.link[linkIndex];

                var $link_button = $("<button class='ld-item-selector " + Constants.btnCls('btn-primary') + "'>").text('Select "' + updateLink.name + '"').on("click", function (comp, link) {
                    return function () {
                        const linkAttrs = {
                            href: comp.get(link.name),
                            title: '',
                            target: '',
                            text: comp.get(link.name),
                        };

                        linkSelectorDialog(linkAttrs, {internal: true}, function (attrs) {
                            // ComponentView.prototype.set
                            comp.model.setContent(link.name, attrs.href);
                        }, ['pageLink', 'externalLink'])
                    }

                }(component, updateLink))
                options.append($link_button)
            }
        }

        var $delete_button = $("<button class='" + Constants.btnCls('btn-danger') + "'>").text("Remove").on("click", function () {
            if (confirm("Remove this?")) {
                component.model.remove();
                $("." + PROPS_HOLDER).remove();
                $("." + STYLE_HOLDER).remove();
            }
        });

        var $dupe_button = $("<button class='" + Constants.btnCls('btn-info') + "'>").text("Duplicate").on("click", function () {
            var tmpTree = new doc.ComponentTree({ design: LivingDocState.livingdoc.componentTree.design });

            // need to swap out 'next' for the moment otherwise the serialize walker
            // will do _all_ siblings.
            var oldNext = component.model.next;
            component.model.next = null;
            var jsonRep = tmpTree.serialize(component.model, true);
            component.model.next = oldNext;

            createComponentList(jsonRep.content, component.model.parentContainer, null, true);

        });

        var exportButton = $('<button>Export</button>').addClass(Constants.btnCls());

        exportButton.click(function (e) {
            componentExportForm(component);
        })

        $('<div class="Actions component-actions">').appendTo(options).append($dupe_button).append($delete_button).append(exportButton);

        // TODO Re-evaluate whether we need access to the raw attribute values
        initialise_attribute_editor(options, component);

        let styleDiv = $('<div>').appendTo(styles);

        $properties.html(options);
        $styleHolder.html(styles);

        createStyleEditor(component, styleDiv[0]);

        // select_tab('livingdocs-style-tab');
    });
}

