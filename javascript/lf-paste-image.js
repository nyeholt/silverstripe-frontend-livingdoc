
;
(function ($) {
    var UPLOAD_ENDPOINT = '';
    var MAX_PASTE_SIZE = 500000;
    var PASTING = false;
    var TOOLBAR_FORM = '#Form_LivingForm';
    
    $(function () {
        var endpointUrl = $(TOOLBAR_FORM).attr('action');
        if (endpointUrl.length > 0) {
            UPLOAD_ENDPOINT = endpointUrl.substring(0, endpointUrl.lastIndexOf('/')) + '/pastefile';
        }
    })
    
    $(document).on('paste.editable', function (event) {
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
                var reader = new FileReader();
                reader.onload = function (evt) {
//                            dataURL: evt.target.result,
//                event: evt,
//                file: file,
//                name: file.name
//                            console.log(file);
                    if (evt.target.result && evt.target.result.length > 0 && evt.target.result.length < MAX_PASTE_SIZE) {
                        
                        // declared here, otherwise the paste action can change the focused element before the post responds
                        var selectedComponent = LivingFrontendHelper.activeComponent;

                        var secId = $(TOOLBAR_FORM).find('[name=SecurityID]').val();

                        PASTING = true;

                        $.post(UPLOAD_ENDPOINT, {SecurityID: secId, rawData: evt.target.result}).then(function (res) {
                            PASTING = false;
                            if (res && res.success) {
                                var updateModel = null;
                                var updateDirective = null;
                                
                                if (!selectedComponent) {
                                    return;
                                }
                                // figure out the item we're updating; do we have a selected image, or are we creating
                                // a new one?
                                if (selectedComponent.model.directives.image && 
                                    selectedComponent.model.directives.image.length > 0) {
                                    updateModel = selectedComponent.model; //.directives.image[0];
                                    
                                } else {
                                    // need to create a new one; this may be inside the container, _or_ as
                                    // a sibling to the current item
                                    var im = ContentBridge.livingdoc.design.defaultImage;
                                    var newComponent = im.createModel();

                                    if (!im.directives.image || im.directives.image.length === 0) {
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
                                }
                                
                                updateDirective = updateModel.directives.image[0].name;
                                updateModel.setContent(updateDirective, {url: res.url});
                                
                            }
                        }).done(function (done) {
                            PASTING = false;
                        })
                    }
                };
                reader.readAsDataURL(file);
            }
        }

//                
//                var im = ContentBridge.livingdoc.design.defaultImage;
//                var newComponent = im.createModel();
//                LivingFrontendHelper.activeComponent.model.after(newComponent);
    })
})(jQuery);