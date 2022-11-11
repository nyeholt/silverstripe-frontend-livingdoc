import * as $ from 'jquery';
import { TextField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';
import ContentSource from '../lib/FormContentSource';

import './lf-embed-selection.scss';
import { SelectField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/SelectField';
import { FieldGroup } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/FieldGroup';
import { Constants } from '../constants';
import LivingDocState from '../lib/LivingDocState';

// TODO : Move this hardcoded crap to the contentsource.config
var embeds = JSON.parse($('input[name=Embeds]').val());
var EMBED_LINK = $('input[name=EmbedLink]').val();

const SHORTCODE_MATCH_REGEX = /\[(\w+)(.*?)\]/;
const SHORTCODE_ATTRS_REGEX = /(\w+)=['"]{1}(.*?)['"]{1}/g;

$(document).on('livingfrontend.updatePropertyEditor', function (e, container, componentBeingEdited) {
    if (componentBeingEdited.model.directives.embeditem && componentBeingEdited.model.directives.embeditem.length) {
        for (var eIndex in componentBeingEdited.model.directives.embeditem) {
            var updateEmbed = componentBeingEdited.model.directives.embeditem[eIndex];

            var $button = $("<button class='ld-item-selector " + Constants.btnCls('btn-primary') + "'>").text('Select "' + updateEmbed.name + '"').on("click", function (component, directive) {
                return function () {
                    var currentValue = component.model.get(directive.name);
                    currentValue = currentValue || { source: '', attrs: '', content: null, url: '' };

                    let componentAttrs = component.model.getData('data_attributes');

                    let currentHtml = component.$html.html();

                    let isShortcode = component.$html.attr('data-use-sc');

                    let fields = {};

                    let subgroup = null;

                    const handleSourceUpdate = (key, value, form) => {
                        // let newParams = props;
                        // newParams[key] = value;
                        // component.model.setDirectiveAttribute(directiveName, key, value);
                        if (subgroup) {
                            subgroup.removeFields();
                        }
                        if (key == 'source' && isShortcode) {
                            let sc = extractShortcodeData(value);
                            if (sc) {
                                componentAttrs = component.model.getData('data_attributes');

                                let props = sc.attrs || {};

                                if (componentAttrs && componentAttrs[directive.name]) {
                                    for (let name in componentAttrs[directive.name]) {
                                        props[name] = componentAttrs[directive.name][name]
                                    }
                                }

                                let subFields = [];
                                for (var fieldName in props) {
                                    subFields[fieldName] = new TextField({
                                        label: fieldName,
                                        value: props[fieldName]
                                    })
                                }


                                subgroup = new FieldGroup({
                                    name: "shortcodeData",
                                    fields: subFields
                                });

                                subgroup.updateCallback = (compKey, compValue) => {
                                    component.model.setDirectiveAttribute(directive.name, compKey, compValue);
                                };

                                subgroup.renderFields(form);
                            }
                        }
                    };

                    if (embeds && isShortcode) {
                        let opts = [{ label: "-- choose --", value: "" }];
                        for (var label in embeds) {
                            opts.push({
                                label: label,
                                value: embeds[label]
                            })
                        }

                        fields["source"] = new SelectField({
                            label: "Source",
                            value: currentValue.url,
                            options: opts
                        });

                    } else {
                        fields["source"] = new TextField({
                            label: "Source",
                            placeholder: "Source URL",
                            value: currentValue.url || "",
                        });

                        fields["width"] = new TextField({
                            label: "Width",
                            placeholder: "Leave empty for responsive sizing",
                            value: componentAttrs && componentAttrs[directive.name] && componentAttrs[directive.name].width || "",
                        });
                        fields["caption"] = new TextField({
                            label: "Caption",
                            placeholder: "Caption",
                            value: componentAttrs && componentAttrs[directive.name] && componentAttrs[directive.name].caption || "",
                        });
                    }

                    const prompt = openPrompt({
                        title: "Options",
                        fields: fields,
                        update: function (key, value, container) {
                            handleSourceUpdate(key, value, prompt.form);
                        },
                        callback: function (values) {
                            if (values.source && values.source.length > 0) {
                                let selected = values.source;
                                let componentAttrs = component.model.getData('data_attributes');
                                componentAttrs = componentAttrs || {};

                                var attrStr = '';

                                let source = 'embed';

                                // do we have an actual URL to be embedded, or a shortcode style URL?
                                let shortcodeData = extractShortcodeData(selected); // SHORTCODE_MATCH_REGEX.exec(selected);

                                // if we've customised props, let's grab them
                                if (componentAttrs[directive.name] && shortcodeData) {
                                    for (let name in componentAttrs[directive.name]) {
                                        shortcodeData.attrs[name] = componentAttrs[directive.name][name]
                                    }
                                }

                                if (shortcodeData && shortcodeData.shortcode) {
                                    source = shortcodeData.shortcode;
                                    if (shortcodeData.attrs) {
                                        shortcodeData.attrs.context_id = ContentSource.getConfig().contextId;
                                        attrStr = JSON.stringify(shortcodeData.attrs);
                                    }
                                } else {
                                    // we've just stuck a URL in place so use that

                                    attrStr = JSON.stringify({
                                        url: selected,
                                        width: values.width,
                                        caption: values.caption
                                    });
                                }

                                $.get(EMBED_LINK, { shortcode: source, attrs: attrStr, stage: 'Stage' }).then(function (data) {
                                    const toSave = {
                                        attrs: attrStr,
                                        source: source,
                                        content: data,
                                        url: selected
                                    };
                                    component.model.setContent(directive.name, toSave);
                                    if (values.width || values.caption) {
                                        component.model.setDirectiveAttribute(directive.name, "width", values.width);
                                        component.model.setDirectiveAttribute(directive.name, "caption", values.caption);
                                    }
                                    if (component.model.componentTree) {
                                        component.model.componentTree.contentChanging(component.model);
                                    }
                                });
                            } else {
                                component.$html.html(currentValue.content ? currentValue.content : currentHtml);
                                component.model.setContent(directive.name, {
                                    source: '',
                                    attrs: '',
                                    content: ''
                                });
                            }
                        },
                        cancel: function () {
                            component.$html.html(currentValue.content ? currentValue.content : currentHtml);
                        }
                    });

                    if (isShortcode && currentValue.url) {
                        handleSourceUpdate('source', currentValue.url, prompt.form);
                    }

                }
            }(componentBeingEdited, updateEmbed))
            container.append($button)
        }
    }
});

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {

    $(Constants.EDITOR_FRAME).contents().on('click', '[data-doc-embeditem] a', function (e) {
        e.preventDefault();
    });

    livingdoc.interactiveView.page.focus.componentBlur.add((componentView, page, directives, event) => {
        $(Constants.EDITOR_FRAME).contents().find('.ld-embed-selected').removeClass('ld-embed-selected');
    });

    livingdoc.interactiveView.page.embedItemClick.add(function (component, directiveName, event) {
        return;
        var currentValue = component.model.get(directive.name);
        currentValue = currentValue || { source: '', attrs: '', content: null, url: '' };

        let componentAttrs = component.model.getData('data_attributes');

        let currentHtml = component.$html.html();



    })
});


function extractShortcodeData(shortcodeStr) {
    let shortcodeData = SHORTCODE_MATCH_REGEX.exec(shortcodeStr);
    if (shortcodeData) {
        var shortcode = shortcodeData[1];
        var scAttrs = null;

        if (shortcodeData[2] && shortcodeData[2].length > 0) {
            scAttrs = {};
            for (let match of shortcodeData[2].matchAll(SHORTCODE_ATTRS_REGEX)) {
                scAttrs[match[1]] = match[2];
            }
            // attrStr = JSON.stringify(scAttrs);
        }

        return {
            shortcode: shortcode,
            attrs: scAttrs
        };
    }
}
