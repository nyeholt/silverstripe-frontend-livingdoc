;
(function ($) {

    var DOC_HOLDER = '.livingdocs-editor';

    var mediaUrl = 'FrontendInsertDialog/MediaForm';
    var linkUrl = 'FrontendInsertDialog/LinkForm';

    var windowPrefs = "height=600,width=750,menubar=no,location=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no";

    window.ContentWrapper = {
        callback: null,
        currentLink: '',
        currentContent: '',

        setCallback: function (callback) {
            this.callback = callback;
            this.currentLink = null;
            this.currentContent = '';
        },

        setLinkObject: function (obj) {
            this.currentLink = obj;
            this.callback(obj);
        },
        setContent: function (content) {
            this.callback(content);
        },
        showDialog: function (link) {
            this.closeDialog();
            var iframeDialog = $('<iframe>').css({
                'width': '50%',
                'height': "50%",
                'position': "absolute",
                "z-index": "20001",
                "top": "100px",
                "right": "100px"
            }).attr({
                'class': "living-dialog",
                'src': link
            });
            
            $('body').append(iframeDialog);
        },
        closeDialog: function () {
            $('.living-dialog').remove();
        }
    };

    $(document).on('click', '.media-insert', function (e) {

    });

    $(document).on('click', '#Form_LivingForm_action_save', function (e) {

    })

    $(function () {
        var structure = $('#page-structure').length > 0 ? $('#page-structure').data('structure') : null;
        if (structure) {
        } else {
            alert("No struct");
        }

        if (!window.design) {
            alert("No design loaded");
            return;
        }

        var selectedDesignName = structure.data.design.name;
        var selectedDesign = design[selectedDesignName];

        selectedDesign.assets.basePath = "frontend-livingdoc/javascript/livingdocs/";

        doc.design.load(selectedDesign);

        doc.config({livingdocsCssFile: "frontend-livingdoc/javascript/livingdocs/css/livingdocs.css"});

        var livingdoc = doc.new(structure);

        var activeDesign = doc.design.designs[selectedDesignName];

        var ready = livingdoc.createView({
            interactive: true,
            iframe: false,
            host: DOC_HOLDER,
            wrapper: activeDesign.wrapper
        });

        ready.then(function () {
            var $host = $(DOC_HOLDER)

            var $components = $('.livingdocs-components');
            var $properties = $('.livingdocs-item-properties');

            for (var i = 0; i < activeDesign.components.length; i++) {
                var template = activeDesign.components[i];
                var $entry = $('<div class="toolbar-entry">');
                $entry.html(template.label);
                $components.append($entry);

                draggableComponent(doc, template.name, $entry);
            }

            livingdoc.model.changed.add(function () {
                updateDataFields();
            });

            // text formatting options
            // @TODO - provide more in-paragraph options
            //  - sup/sub
            //  - strike
            //  - text-alignment (an option maybe?) 
            livingdoc.interactiveView.page.editableController.selection.add(function (view, editableName, selection) {
                console.log("Selection event : ");
                console.log(selection);
            })
            livingdoc.interactiveView.page.editableController.selection.add(function (view, editableName, selection) {
                $(".livingdocs_EditorField_Toolbar_textopts").remove()
                var outer_el = $("<div>").addClass("livingdocs_EditorField_Toolbar_textopts")
                if (selection && selection.isSelection) {
                    var offset = $host.offset()
                    var rect = selection.getCoordinates()
                    
                    var $el = $("<button>").text("Add Link")
                            .on('mousedown', function (e) {
                                e.preventDefault()
                            })
                            .on('click', function () {
                                selectLink(function (linkObj) {
                                    // our selection is lost, so we create a _new_ range and 
                                    // use that for our selection object 
                                    var el = selection.host;
                                    var range = rangy.createRange();
                                    console.log(selection);
                                    range.setStart(selection.range.startContainer, selection.range.startOffset);
                                    range.setEnd(selection.range.endContainer, selection.range.endOffset);
                                    selection.range = range;
                                    
                                    selection.link(linkObj.href, {target: linkObj.target, title: linkObj.title})
                                    selection.triggerChange()
                                });
                            })
                    outer_el.append($el);
                    var $el = $("<button>").text("Bold")
                            .on('mousedown', function (e) {
                                e.preventDefault()
                            })
                            .on('click', function () {
                                selection.toggleBold()
                                selection.triggerChange()
                            })
                    outer_el.append($el);
                    var $el = $("<button>").text("Italic")
                            .on("mousedown", function (e) {
                                e.preventDefault()
                            })
                            .on('click', function () {
                                selection.toggleEmphasis()
                                selection.triggerChange();
                            })

                    outer_el.append($el);
                    $("button", outer_el)
                    outer_el.css({position: "absolute", left: rect.left, top: rect.top - 80, background: "black", "z-index": 1000})
                    $("body").append(outer_el)
                }
            });


            livingdoc.interactiveView.page.focus.componentFocus.add(function (component) {
                $(".livingdocs_EditorField_Toolbar_options").remove()
                var options = $("<div>").addClass("livingdocs_EditorField_Toolbar_options")
                options.append("<h3>").text("Properties")

                for (var s_id in component.model.template.styles) {
                    var curr_style = component.model.template.styles[s_id];
                    var el;
                    switch (curr_style.type) {
                        case "select":
                            el = $("<select>")
                            for (var op_id in curr_style.options) {
                                var curr_op = curr_style.options[op_id];
                                el.append($("<option>").val(curr_op.value).text(curr_op.caption))
                            }
                            el.on("change", function (value) {
                                component.setStyle(curr_style.name, this.value)
                            })
                            break
                        case "option":
                            el = $("<input>").attr({type: 'checkbox'})
                            el.on("change", function () {
                                if (el.prop('checked'))
                                    component.setStyle(curr_style.name, curr_style.value)
                                else
                                    component.setStyle(curr_style.name, "")
                            });
                            el = $("<label>").text(curr_style.label).prepend(el)

                        default:
                            break;
                    }
                    options.append(el);
                }

                if (component.model.directives.image && component.model.directives.image.length) {
                    for (var directive_id in component.model.directives.image) {
                        var curr_img = component.model.directives.image[directive_id];
                        var $image_button = $("<button>").text("Select Image").on("click", function () {
                            selectImage(function (src) {
                                component.model.setContent(curr_img.name, {url: src});
                            })
                        })
                        options.append($image_button)
                    }
                }
                $properties.html(options)
                var $delete_button = $("<button>").text("Delete Component").on("click", function () {
                    component.model.remove()
                    $(".livingdocs_EditorField_Toolbar_options").remove()

                })
                options.append($delete_button);
            })
        });


        function selectLink(callback) {
            ContentWrapper.setCallback(callback);
            ContentWrapper.showDialog(linkUrl);
        }

        function selectImage(callback) {
            ContentWrapper.setCallback(function (content) {
                callback($(content).attr('src'));
            });
            var mediaDialog = window.open(mediaUrl, "frontend-dialog", windowPrefs);
        }
        

        function updateDataFields() {
            $('#Form_LivingForm').find('[name=PageStructure]').val(livingdoc.toJson());
            $('#Form_LivingForm').find('[name=Content]').val(livingdoc.toHtml());
        }

        function draggableComponent(doc, name, $elem) {
            $elem.on('mousedown', function (event) {
                var newComponent = livingdoc.createComponent(name);
                doc.startDrag({
                    componentModel: newComponent,
                    event: event,
                    config: {
                        preventDefault: true,
                        direct: true
                    }
                });
            });
        }
    })

})(jQuery);