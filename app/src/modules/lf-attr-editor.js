import * as $ from 'jquery';
import LivingDocState from '../lib/LivingDocState';
import { Constants } from '../constants';

export function initialise_attribute_editor(holder, component) {
    var componentAttrs = component.model.getData('data_attributes');

    if (componentAttrs) {
        holder.append("<h4>Component Attributes</h4>");
        var changeAttribute = function (directiveName, name) {
            return function () {
                component.model.setDirectiveAttribute(directiveName, name, $(this).val());
                if (component.model.componentTree) {
                    component.model.componentTree.contentChanging(component.model, directiveName);
                }
            }
        };

        for (var directiveName in componentAttrs) {
            var itemAttrs = componentAttrs[directiveName];
            if (!itemAttrs) {
                continue;
            }
            holder.append('<h5>' + directiveName + '</h5>');
            for (var key in itemAttrs) {
                var attrInput = null;
                var attrlbl = $('<label>').text(key);
                attrInput = $("<input>").attr({ type: 'text' }).val(itemAttrs[key]);
                attrInput.on("change", changeAttribute(directiveName, key));
                attrlbl.append(attrInput);
                holder.append(attrlbl);
            }
        }
    }


    var newAttr = $('<button class="' + Constants.btnCls('btn-info') + '">New Attribute</button>').prependTo(holder.find('.Actions.component-actions'));
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

        var dialog = LivingDocState.showDialog();

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

            LivingDocState.closeDialog();
        });
    })
}
