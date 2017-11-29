
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

                        var secId = $(TOOLBAR_FORM).find('[name=SecurityID]').val();

                        PASTING = true;

                        $.post(UPLOAD_ENDPOINT, {SecurityID: secId, rawData: evt.target.result}).then(function (res) {
                            if (res && res.success) {
                                var im = ContentBridge.livingdoc.design.defaultImage;
                                var newComponent = im.createModel();

                                if (!im.directives.image || im.directives.image.length === 0) {
                                    // can't paste into an empty block!
                                    console.log("No place to paste");
                                }

                                var updateDirective = im.directives.image[0].name;

                                var obj1 = LivingFrontendHelper.activeComponent.model.after(newComponent);
                                var newView = LivingFrontendHelper.activeComponent.next();
                                newView.focus();
                                newView.model.setContent(updateDirective, {url: res.url});
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