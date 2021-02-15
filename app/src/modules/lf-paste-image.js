import * as $ from 'jquery';
import LivingDocState from '../lib/LivingDocState';
import ContentSource from '../lib/FormContentSource';
import { Constants } from '../constants';

import * as loadingImg from './lf-paste-loading.png';

var UPLOAD_ENDPOINT = ContentSource.getConfig().endpoints.paste;
var MAX_PASTE_SIZE = 500000;
var PASTING = false;
var TOOLBAR_FORM = '#Form_LivingForm';

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {

    let iFrame = $(Constants.EDITOR_FRAME).contents();
    iFrame.on('paste.editable', function (event) {
        var imageType = /image.*/
        // LivingFrontendHelper.activeComponent.model.parentContainer.insertAfter
        var clipboardData;

        if (PASTING) {
            return;
        }

        if (event.clipboardData) {
            clipboardData = event.clipboardData;
        }
        if (event.originalEvent && event.originalEvent.clipboardData) {
            clipboardData = event.originalEvent.clipboardData;

            // https://codepen.io/netsi1964/pen/IoJbg
        }

        for (var i = 0; i < clipboardData.types.length; i++) {
            if (clipboardData.types[i].match(imageType) || clipboardData.items[i].type.match(imageType)) {
                var file = clipboardData.items[i].getAsFile();
                if (!file) {

                    file = clipboardData.items[i].getAsString(function (s) {
                        console.log(s);
                    });
                    alert("Could not convert clipboard data to file, please try a smaller image");
                    continue;
                }
                var reader = new FileReader();
                reader.onload = function (evt) {
                    if (evt.target.result && evt.target.result.length > 0 && evt.target.result.length < MAX_PASTE_SIZE) {

                        // declared here, otherwise the paste action can change the focused element before the post responds
                        var selectedComponent = LivingDocState.activeComponent;

                        var secId = $(TOOLBAR_FORM).find('[name=SecurityID]').val();

                        PASTING = true;

                        var updateModel = null;
                        var updateDirective = null;

                        if (!selectedComponent) {
                            console.log("no selected component");
                            return;
                        }

                        var srcTemplate = LivingDocState.livingdoc.design.defaultImage;

                        // figure out the item we're updating; do we have a selected image, or are we creating
                        // a new one from the default template?
                        if (selectedComponent.model.directives.image &&
                            selectedComponent.model.directives.image.length > 0) {
                            srcTemplate = selectedComponent.template; //.directives.image[0];
                        }

                        // need to create a new one; this may be inside the container, _or_ as
                        // a sibling to the current item
                        var newComponent = srcTemplate.createModel();

                        if (!srcTemplate.directives.image || srcTemplate.directives.image.length === 0) {
                            // can't paste into an empty block!
                            console.log("No place to paste");
                        }

                        var newView = selectedComponent;
                        if (selectedComponent.directives.container && selectedComponent.directives.container.length > 0) {
                            var containerName = selectedComponent.directives.container[0].name;
                            selectedComponent.model.containers[containerName].append(newComponent);
                        } else {
                            selectedComponent.model.after(newComponent);
                            newView = selectedComponent.next();
                        }

                        newView.focus();
                        updateModel = newComponent;

                        updateDirective = updateModel.directives.image[0].name;
                        updateModel.setContent(updateDirective, { url: '/resources/vendor/nyeholt/silverstripe-frontend-livingdoc/app/dist/' + loadingImg });

                        $.post(UPLOAD_ENDPOINT, { SecurityID: secId, rawData: evt.target.result }).then(function (res) {
                            PASTING = false;
                            if (res && res.success) {
                                updateModel.setContent(updateDirective, { url: res.url });
                            }
                        }).done(function (done) {
                            PASTING = false;
                        })
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    })
});
