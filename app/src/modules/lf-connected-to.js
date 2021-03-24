import * as $ from 'jquery';
import { ComponentTree } from "./lf-component-tree";
import { Constants } from '../constants';

import './lf-connected-to.scss';


$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {

    let tree = new ComponentTree(livingdoc, null, true);
    let holderForm;

    livingdoc.interactiveView.page.focus.componentBlur.add((componentView, page, directives, event) => {
        $(Constants.EDITOR_FRAME).contents().find('.ld-select-component').removeClass('ld-select-component');
        $(Constants.EDITOR_FRAME).contents().find('.ld-connected-form').remove();
    });

    livingdoc.interactiveView.page.connectedToClick.add(function (component, directiveName) {

        if (component.$html.hasClass('ld-select-component')) {
            return;
        }

        component.$html.addClass('ld-select-component');

        holderForm = $('<div class="ld-connected-form">');

        let treeHolder = $('<div class="ld-component-tree" id="ld-component-tree-' + component.model.id + '">');
        
        holderForm.append(treeHolder);

        

        tree.nodeClickHandler = function (node) {
            component.$html.find('.ld-directive-selector').remove();
            if (node.id == component.model.id) {
                return;
            }
            let selectedComponent = livingdoc.model.findById(node.id);
            if (!selectedComponent) {
                return;
            }
            let directiveSelectHolder = $('<div class="ld-directive-selector">');
            let directiveSelect = $('<select>');
            directiveSelect.append("<option value=''>Select a field</option>");

            let addOptions = false;

            selectedComponent.directives.each(function (directive) {
                if (directive.type != 'embeditem' && directive.type != 'container' && directive.type != 'image') {
                    directiveSelect.append('<option>' + directive.name + "</option>");
                    addOptions = true;
                }
            })

            if (addOptions) {
                directiveSelectHolder.append(directiveSelect);
                holderForm.append(directiveSelectHolder);

                let button = $('<button class="ld-directive-button">').text("Update");
                holderForm.append(button);

                button.on('click', function (e) {
                    let dottedName = '';
                    if (directiveSelect.val()) {
                        dottedName = node.id + '.' + directiveSelect.val();
                    }
                    component.$html.removeClass('ld-select-component');
                    holderForm.remove();
                    component.model.setContent(directiveName, dottedName);
                });
            } else {
                directiveSelectHolder.remove();
            }
        }

        component.$html.append(holderForm);
        tree.render(treeHolder[0]);

        // if (!component.model.setContent(directiveName, 'doc-1evf0gjfl0.notification')) {
        //     // we need to force this as the content set by rawContent may not
        //     // be different and trigger the HTML update
        //     if (component.model.componentTree) {
        //         component.model.componentTree.contentChanging(component.model, directiveName);
        //     }
        // }
    });


    livingdoc.model.componentContentChanged.add(function (model, directive) {
        if (model.directives.get(directive) && model.directives.get(directive).type == 'connectedto') {
            return;
        }

        livingdoc.model.each(function (componentModel) {
            componentModel.directives.eachOfType('connectedto', function (directive) {
                componentModel.setContent(directive.name, componentModel.get(directive.name));
                componentModel.componentTree.contentChanging(componentModel, directive.name);
            });
        })
    })
});