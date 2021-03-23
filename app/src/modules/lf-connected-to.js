import * as $ from 'jquery';
import { TextField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/TextField';
import { openPrompt } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/proseutil/prose-prompt';
import ContentSource from '../lib/FormContentSource';

import './lf-embed-selection.scss';
import { SelectField } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/SelectField';
import { FieldGroup } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/fields/FieldGroup';
import { Constants } from '../constants';



$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {

    livingdoc.interactiveView.page.connectedToClick.add(function (component, directiveName, event) {
        
        
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
                console.log(componentModel, directive);
                componentModel.setContent(directive.name, componentModel.get(directive.name));
                componentModel.componentTree.contentChanging(componentModel, directive.name);
            });
        })
    })
});