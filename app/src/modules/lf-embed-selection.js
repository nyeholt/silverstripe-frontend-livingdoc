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

                var attrInput = null;
                var attrlbl = $('<label>').text('Source URL');

                if (embeds) {
                    attrInput = $('<select class="with-button">');
                    attrInput.append('<option>-- select item --</option>');
                    for (var label in embeds) {
                        var opt = $('<option>').appendTo(attrInput);
                        opt.attr('value', label).text(label);
                    }
                } else {
                    attrInput = $("<input>").attr({ type: 'text', placeholder: 'Source url' });
                }

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
                        componentAttrs[_thisItem.name] = componentAttrs[_thisItem.name] || {};
                        componentAttrs[_thisItem.name].url = selected;

                        var attrStr = '';

                        if (componentAttrs) {
                            componentAttrs = componentAttrs[_thisItem.name];
                            if (componentAttrs) {
                                attrStr = JSON.stringify(componentAttrs);
                            }
                        }

                        $.get(EMBED_LINK, { shortcode: 'embed', attrs: attrStr }).then(function (data) {
                            const toSave = {
                                attrs: attrStr,
                                source: 'embed',
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
