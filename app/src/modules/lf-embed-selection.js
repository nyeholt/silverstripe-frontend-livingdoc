import * as $ from 'jquery';
import { TextField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';

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

        var isEditing = component.$html.attr('data-is-editing');
        if (isEditing) {
            return;
        }

        let isShortcode = component.$html.attr('data-use-sc');

        component.$html.attr('data-is-editing', 1);

        let holder = $('<div class="ld-embed-selection">');
        let propHolder = $('<div class="ld-embed-properties">');
        var attrInput = $("<input>").attr({ type: 'text', placeholder: 'Source url' });
        var attrlbl = $('<label>').text('Source');

        const fields = {};

        if (embeds && isShortcode) {
            attrInput = $('<select class="with-button">');
            attrInput.append('<option>-- select item --</option>');
            for (var label in embeds) {
                var opt = $('<option>').appendTo(attrInput);
                opt.attr('value', embeds[label]).text(label);
            }

            attrInput.change(function (e) {
                let v = $(this).val();
                let sc = extractShortcodeData(v);
                if (sc && sc.attrs) {
                    let fields = {};

                    for (var fieldName in sc.attrs) {
                        fields[fieldName] = new TextField({
                            label: fieldName,
                            value: sc.attrs[fieldName]
                        })
                    }

                    openPrompt({
                        title: "Options",
                        fields: fields,
                        showButtons: false,
                        update: function () {
                            console.log(arguments);
                        }
                    }, propHolder[0]);
                }
            })
        }

        if (attrInput && currentValue.url) {
            // let storedAttrs = JSON.parse(currentValue.attrs);
            attrInput.val(currentValue.url);
        }

        const cleanUp = function () {
            attrlbl.remove();
            component.$html.removeAttr('data-is-editing');
        }

        var attrButton = $('<button>✔</button>');
        var cancelButton = $('<button>X</button>');
        attrButton.on("click", function () {
            var selected = attrInput.val();
            attrButton.text("⏳").prop('disabled');
            if (selected) {
                var componentAttrs = component.model.getData('data_attributes');
                componentAttrs = componentAttrs || {};

                var attrStr = '';

                let source = 'embed';

                // do we have an actual URL to be embedded, or a shortcode style URL?
                let shortcodeData = extractShortcodeData(selected); // SHORTCODE_MATCH_REGEX.exec(selected);
                if (shortcodeData && shortcodeData.shortcode) {
                    source = shortcodeData.shortcode;
                    attrStr = shortcodeData.attrs ? JSON.stringify(shortcodeData.attrs) : '';
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