import * as $ from 'jquery';

var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';
var embeds = null; // moving away from this now... JSON.parse($('input[name=Embeds]').val());
var EMBED_LINK = $('input[name=EmbedLink]').val();

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    livingdoc.interactiveView.page.focus.componentFocus.add(function (component) {
        if (component.model.directives.embeditem && component.model.directives.embeditem.length) {
            for (var index in component.model.directives.embeditem) {
                var _thisItem = component.model.directives.embeditem[index];

                var currentValue = component.model.get(_thisItem.name);
                currentValue = currentValue || { source: '', attrs: '', content: null, url: '' };

                var attrInput = attrInput = $("<input>").attr({ type: 'text', placeholder: 'Source url' });;
                var attrlbl = $('<label>').text('Source URL');

                // if (embeds) {
                //     attrInput = $('<select class="with-button">');
                //     attrInput.append('<option>-- select item --</option>');
                //     for (var label in embeds) {
                //         var opt = $('<option>').appendTo(attrInput);
                //         opt.attr('value', label).text(label);
                //     }
                // } else {

                // }

                if (attrInput && currentValue.url) {
                    // let storedAttrs = JSON.parse(currentValue.attrs);
                    attrInput.val(currentValue.url);
                }

                var attrButton = $('<button>✔</button>');
                attrButton.on("click", function () {
                    var selected = attrInput.val();
                    if (selected) {
                        var componentAttrs = component.model.getData('data_attributes');
                        componentAttrs = componentAttrs || {};

                        var attrStr = '';

                        if (componentAttrs) {
                            componentAttrs = componentAttrs[_thisItem.name];
                            if (componentAttrs) {
                                componentAttrs.url = selected;
                                attrStr = JSON.stringify(componentAttrs);
                            }
                        }

                        let source = 'embed';

                        // do we have an actual URL to be embedded, or a shortcode style URL?
                        let shortcodeData = /\[(\w+)(.*?)\]/.exec(selected);
                        if (shortcodeData) {
                            source = shortcodeData[1];
                            attrStr = '';
                            if (shortcodeData[2] && shortcodeData[2].length > 0) {
                                var scAttrs = {};

                                for (let match of shortcodeData[2].matchAll(/(\w+)=['"]{1}(.*?)['"]{1}/g)) {
                                    scAttrs[match[1]] = match[2];
                                }
                                attrStr = JSON.stringify(scAttrs);
                            }
                        }

                        $.get(EMBED_LINK, { shortcode: source, attrs: attrStr }).then(function (data) {
                            const toSave = {
                                attrs: attrStr,
                                source: source,
                                content: data,
                                url: selected
                            };
                            component.model.setContent(_thisItem.name, toSave);
                        });
                    } else {
                        component.model.setContent(_thisItem.name, {
                            source: '',
                            attrs: '',
                            content: ''
                        });
                    }

                });
                attrlbl.append(attrInput).append(attrButton);
                $('.' + PROPS_HOLDER).append(attrlbl);
            }
        }
    })
});
