import * as $ from 'jquery';
import { TextField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';
import ContentSource from '../lib/FormContentSource';

import './lf-embed-selection.scss';
import { SelectField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/SelectField';
import { FieldGroup } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/FieldGroup';
import { Constants } from '../constants';

// TODO : Move this hardcoded crap to the contentsource.config
var embeds = JSON.parse($('input[name=Embeds]').val());
var EMBED_LINK = $('input[name=EmbedLink]').val();

const SHORTCODE_MATCH_REGEX = /\[(\w+)(.*?)\]/;
const SHORTCODE_ATTRS_REGEX = /(\w+)=['"]{1}(.*?)['"]{1}/g;


$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {

    $(Constants.EDITOR_FRAME).contents().on('click', '[data-doc-embeditem] a', function (e) {
        e.preventDefault();
    });

    livingdoc.interactiveView.page.embedItemClick.add(function (component, directiveName, event) {
        var currentValue = component.model.get(directiveName);
        currentValue = currentValue || { source: '', attrs: '', content: null, url: '' };

        let currentHtml = component.$html.html();

        var isEditing = component.$html.find('.ld-embed-selection');
        if (isEditing && isEditing.length > 0) {
            return;
        }

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
                    let componentAttrs = component.model.getData('data_attributes');

                    let props = sc.attrs || {};

                    if (componentAttrs && componentAttrs[directiveName]) {
                        for (let name in componentAttrs[directiveName]) {
                            props[name] = componentAttrs[directiveName][name]
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
                        component.model.setDirectiveAttribute(directiveName, compKey, compValue);
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
        }

        const form = openPrompt({
            title: "Options",
            fields: fields,
            update: function (key, value, container) {
                handleSourceUpdate(key, value, form);
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
                    if (componentAttrs[directiveName] && shortcodeData) {
                        for (let name in componentAttrs[directiveName]) {
                            shortcodeData.attrs[name] = componentAttrs[directiveName][name]
                        }
                    }

                    if (shortcodeData && shortcodeData.shortcode) {
                        source = shortcodeData.shortcode;
                        if (shortcodeData.attrs) {
                            shortcodeData.attrs.context_id = ContentSource.getConfig().contextId;
                            attrStr = JSON.stringify(shortcodeData.attrs);
                        }
                    } else {
                        attrStr = JSON.stringify({
                            url: selected
                        });
                    }

                    $.get(EMBED_LINK, { shortcode: source, attrs: attrStr, stage: 'Stage' }).then(function (data) {
                        const toSave = {
                            attrs: attrStr,
                            source: source,
                            content: data,
                            url: selected
                        };
                        component.model.setContent(directiveName, toSave);
                        if (component.model.componentTree) {
                            component.model.componentTree.contentChanging(component.model);
                        }
                    });
                } else {
                    component.$html.html(currentValue.content ? currentValue.content : currentHtml);
                    component.model.setContent(directiveName, {
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
            handleSourceUpdate('source', currentValue.url, form);
        }
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
