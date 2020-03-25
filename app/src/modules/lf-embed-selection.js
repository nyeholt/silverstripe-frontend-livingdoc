import * as $ from 'jquery';

var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';
var embeds = null; // moving away from this now... JSON.parse($('input[name=Embeds]').val());
var EMBED_LINK = $('input[name=EmbedLink]').val();

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    livingdoc.interactiveView.page.embedItemClick.add(function (component, directiveName, event) {
        var currentValue = component.model.get(directiveName);
        currentValue = currentValue || { source: '', attrs: '', content: null, url: '' };

        var isEditing = component.$html.attr('data-is-editing');
        if (isEditing) {
            return;
        }

        component.$html.attr('data-is-editing', 1);

        var attrInput = attrInput = $("<input>").attr({ type: 'text', placeholder: 'Source url' });
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
            component.$html.html(currentValue.content);
        })

        attrlbl.append(attrInput).append(attrButton).append(cancelButton);

        component.$html.empty();
        component.$html.append(attrlbl);
    })
});
