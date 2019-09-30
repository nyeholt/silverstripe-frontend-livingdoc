import * as $ from 'jquery';

var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    livingdoc.interactiveView.page.focus.componentFocus.add(function (component) {
        var componentAttrs = component.model.getData('data_attributes');
        var options = $('.' + PROPS_HOLDER);

        if (componentAttrs) {
            options.append("<h4>Attributes</h4>");
            var changeAttribute = function (componentName, name) {
                return function () {
                    componentAttrs[componentName][name] = $(this).val();
                    if (component.model.componentTree) {
                        component.model.componentTree.contentChanging(component.model);
                    }
                }
            };

            for (var componentName in componentAttrs) {
                var itemAttrs = componentAttrs[componentName];
                if (!itemAttrs) {
                    continue;
                }
                options.append('<h5>' + componentName + '</h5>');
                for (var key in itemAttrs) {
                    var attrInput = null;
                    var attrlbl = $('<label>').text(key);
                    attrInput = $("<input>").attr({ type: 'text' }).val(itemAttrs[key]);
                    attrInput.on("change", changeAttribute(componentName, key));
                    attrlbl.append(attrInput);
                    options.append(attrlbl);
                }
            }
        }

        var newAttr = $('<button class="alert">New Attr</button>').prependTo(options.find('.component-actions'));
        newAttr.click(function (e) {
            var names = [];

            for (var name in component.model.directives.all) {
                names.push(name);
            }
            for (var name in component.model.containers) {
                names.push(name);
            }

            if (names.length === 0) {
                return;
            }

            var dialog = LivingFrontendHelper.showDialog();

            var directiveSelect = $('<select>');
            for (var i = 0; i < names.length; i++) {
                $('<option>').text(names[i]).appendTo(directiveSelect);
            }
            dialog.append('<label>Add attribute to directive:</label>');
            dialog.append(directiveSelect);

            dialog.append('<label>Add attribute named:</label>');
            dialog.append('<input name="attr_name">');

            dialog.append('<label>Attribute value</label>');
            dialog.append('<input name="attr_value">');

            dialog.append('<br/>');
            var action = $('<button>OK</button>').appendTo(dialog);

            action.click(function (e) {
                var todirective = directiveSelect.val();
                var attr = dialog.find('input[name=attr_name]').val();
                var value = dialog.find('input[name=attr_value]').val();
                if (todirective && todirective.length && attr && attr.length > 0) {
                    component.model.setDirectiveAttribute(todirective, attr, value);
                    if (component.model.componentTree) {
                        component.model.componentTree.contentChanging(component.model);
                    }
                }

                LivingFrontendHelper.closeDialog();
            });
        })
    });
});
