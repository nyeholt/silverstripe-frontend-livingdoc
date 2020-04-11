import * as $ from 'jquery';
import { TextField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';
import ContentSource from '../lib/FormContentSource';

var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

// TODO : Move this hardcoded crap to the contentsource.config 
var embeds = JSON.parse($('input[name=Embeds]').val());
var EMBED_LINK = $('input[name=EmbedLink]').val();

const SHORTCODE_MATCH_REGEX = /\[(\w+)(.*?)\]/;
const SHORTCODE_ATTRS_REGEX = /(\w+)=['"]{1}(.*?)['"]{1}/g;

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    livingdoc.interactiveView.page.embedItemClick.add(function (component, directiveName, event) {
        var currentValue = component.model.get(directiveName);
        currentValue = currentValue || { source: '', attrs: '', content: null, url: '' };

        let currentHtml = component.$html.html();

        var isEditing = component.$html.find('.ld-embed-selection');
        if (isEditing && isEditing.length > 0) {
            return;
        }

        let isShortcode = component.$html.attr('data-use-sc');

        let holder = $('<div class="ld-embed-selection">');
        let propHolder = $('<div class="ld-embed-properties">');
        var attrInput = $("<input>").attr({ type: 'text', placeholder: 'Source url' });
        var attrlbl = $('<label>').text('Source');

        if (embeds && isShortcode) {
            attrInput = $('<select class="with-button">');
            attrInput.append('<option>-- select item --</option>');
            for (var label in embeds) {
                var opt = $('<option>').appendTo(attrInput);
                opt.attr('value', embeds[label]).text(label);
            }

            attrInput.change(function (e) {
                let v = $(this).val();
                showAttrEditor(v, propHolder[0], component, directiveName);
            })
        }

        if (attrInput && currentValue.url) {
            // let storedAttrs = JSON.parse(currentValue.attrs);
            attrInput.val(currentValue.url);
            if (isShortcode) {
                showAttrEditor(currentValue.url, propHolder[0], component, directiveName);
            }
        }

        const cleanUp = function () {
            holder.remove();
        }

        var attrButton = $('<button>✔</button>');
        var cancelButton = $('<button>X</button>');
        attrButton.on("click", function () {
            var selected = attrInput.val();
            attrButton.text("⏳").prop('disabled');
            if (selected) {
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

                $.get(EMBED_LINK, { shortcode: source, attrs: attrStr }).then(function (data) {
                    cleanUp();

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
                cleanUp();
                component.$html.html(currentValue.content ? currentValue.content : currentHtml);
                component.model.setContent(directiveName, {
                    source: '',
                    attrs: '',
                    content: ''
                });
            }
        });

        cancelButton.on('click', function () {
            // component.model.setContent(directiveName, currentValue);
            cleanUp();
            component.$html.html(currentValue.content ? currentValue.content : currentHtml);
        })

        holder.append(attrlbl.append(attrInput)).append(attrButton).append(cancelButton).append(propHolder);

        component.$html.empty();
        component.$html.append(holder);
    })
});

function showAttrEditor(v, container, component, directiveName) {
    let sc = extractShortcodeData(v);
    if (!sc) {
        return;
    }

    let componentAttrs = component.model.getData('data_attributes');

    let props = sc.attrs || {};

    if (componentAttrs && componentAttrs[directiveName]) {
        for (let name in componentAttrs[directiveName]) {
            props[name] = componentAttrs[directiveName][name]
        }
    }

    if (sc && props) {
        let fields = {};

        for (var fieldName in props) {
            fields[fieldName] = new TextField({
                label: fieldName,
                value: props[fieldName]
            })
        }

        openPrompt({
            title: "Options",
            fields: fields,
            hideButtons: true,
            update: function (key, value) {
                let newParams = props;
                newParams[key] = value;
                component.model.setDirectiveAttribute(directiveName, key, value);
            },
            callback: function () {

            }
        }, container);
    }
}

function buildShortcode(name, props) {
    let parts = [name];
    if (props) {
        for (let key in props) {
            parts.push(key + '="' + props[key].replace('"', '\"') + '"');
        }
    }
    return '[' + parts.join(' ') + ']';
}

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