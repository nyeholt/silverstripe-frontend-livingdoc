;
(function ($) {
    
    if (!window.$) {
        window.$ = $;
    }

    var DOC_HOLDER = '.livingdocs-editor';
    
    var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

    var mediaUrl = 'FrontendInsertDialog/MediaForm';
    var imageUrl = 'FrontendInsertDialog/ImageForm';
    var linkUrl = 'FrontendInsertDialog/LinkForm';

    var windowPrefs = "height=600,width=750,menubar=no,location=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no";

    window.ContentWrapper = {
        callback: null,
        currentLink: '',
        currentContent: '',
        dialogFrame: null,
        closer: null,
        linkDialogFrame: null,
        mediaDialogFrame: null,

        dialogDiv: null,

        setCallback: function (callback) {
            this.callback = callback;
            this.currentLink = null;
            this.currentContent = '';
        },

        setLinkObject: function (obj) {
            this.currentLink = obj;
            this.callback.call(this, obj);
        },
        setContent: function (content) {
            this.callback(content);
        },
        init: function () {
            this.linkDialogFrame = this.createFrame();
            this.mediaDialogFrame = this.createFrame();
            
            this.closer = $('<a href="#" class="dialog-close">X</a>');
            this.closer.click(function (e) {
                e.preventDefault();
                ContentWrapper.closeDialog();
                return false;
            });

            $('body').append(this.closer);

            this.linkDialogFrame.attr({'src': linkUrl});
            this.mediaDialogFrame.attr({'src': mediaUrl});
        },
        createFrame: function () {
            var frame = $('<iframe src="about:">');
            frame.attr({
                'class': "living-dialog"
            });

            $('body').append(frame);
            return frame;
        },
        showDialog: function (type) {
            // we may show a different dialog for images in future
            switch (type) {
                case 'media': {
                    this.mediaDialogFrame.show();
                    break;
                }
                case 'image': {
                    this.mediaDialogFrame.show();
                    break;
                }
                case 'link': {
                    this.linkDialogFrame.show();
                    break;
                }
            }
            if (type == 'media') {
                
            } else {
                
            }
            this.closer.show();
        },
        showTestDialog: function (link) {
            var _this = this;
            _this.dialogDiv.html('<input type="button" value="clickit" id="clicker" />');
            _this.dialogDiv.show();
            return;
            $.get(link).done(function (html) {
                _this.dialogDiv.html(html);
                _this.dialogDiv.show();
            });
        },
        closeDialog: function () {
            this.mediaDialogFrame.hide();
            this.linkDialogFrame.hide();
            this.closer.hide();
            
            this.linkDialogFrame.attr({'src': 'about:'});
            this.mediaDialogFrame.attr({'src': 'about:'});

            this.linkDialogFrame.attr({'src': linkUrl});
            this.mediaDialogFrame.attr({'src': mediaUrl});
        }
    };

    ContentWrapper.init();

    $(document).on('click', function (e) {
        if ($(e.target).parents('.livingdocs-editor').length <= 0 &&
                $(e.target).parents('.livingdocs-toolbar').length <= 0) {
            // remove the properties editing
            $('.'+PROPS_HOLDER).remove();
        }
    })

    $(document).on('mousedown', '#clicker', function (e) {
        e.preventDefault();
    })

    $(document).on('click', '#clicker', function () {
        ContentWrapper.setLinkObject({
            href: 'link/href', target: '', title: 'linktitle'
        });
    });
    
    $(document).on('click', 'form#Form_LivingForm input.action', function () { 
        var parentForm = $(this).parents('form');
        parentForm.find('input.hidden-action').remove();
        $('<input class="hidden-action">').attr({
            'type': 'hidden',
            'name': $(this).attr('name'),
            'value': '1'
        }).appendTo(parentForm);
    })

    $(document).on('submit', 'form#Form_LivingForm', function () {
        var _this = $(this);
        
        _this.removeAttr('data-changed');
        
        $(this).ajaxSubmit(function (response) {
            _this.find('input.action').each(function () {
                $(this).prop('disabled', false);
            });
        });
        
        _this.find('input.action').each(function () {
            $(this).prop('disabled', true);
        });
        
        return false;
    });
    
    $(window).bind('beforeunload', function(){
        if ($('#Form_LivingForm').attr('data-changed')) {
            return "You may have unsaved changes, sure?";
        }
    });

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
        
        $(document).trigger('updateLivingdocsDesign', selectedDesign);

        selectedDesign.assets.basePath = "frontend-livingdoc/javascript/livingdocs/";

        doc.design.load(selectedDesign);

        doc.config({livingdocsCssFile: "frontend-livingdoc/javascript/livingdocs/css/livingdocs.css"});

        var livingdoc = doc.new(structure);

        updateDataFields();

        var activeDesign = doc.design.designs[selectedDesignName];

        var ready = livingdoc.createView({
            interactive: true,
            iframe: false,
            host: DOC_HOLDER,
            wrapper: activeDesign.wrapper
        });

        ready.then(function () {
            var toolbarHolder = $('.livingdocs-toolbar');

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
                updateDataFields(true);
            });

            // text formatting options
            // @TODO - provide more in-paragraph options
            //  - sup/sub
            //  - strike
            //  - text-alignment (an option maybe?) 
            livingdoc.interactiveView.page.editableController.selection.add(function (view, editableName, selection) {
                $(".livingdocs_EditorField_Toolbar_textopts").remove()
                var outer_el = $("<div>").addClass("livingdocs_EditorField_Toolbar_textopts")
                if (selection && selection.isSelection) {
                    var rect = selection.getCoordinates()

                    var $el = $("<button>").text("Add Link")
                            .on('mousedown', function (e) {
                                e.preventDefault()
                            })
                            .on('click', function () {
                                selection.save();
                                // prevents range saving from being cleared on focus lost
                                selection.host.setAttribute('data-editable-is-pasting', true);
                                selectLink(function (linkObj) {
                                    selection.restore();
                                    selection.setVisibleSelection();
                                    selection.link(linkObj.href, {target: linkObj.target, title: linkObj.title})
                                    selection.host.setAttribute('data-editable-is-pasting', false);
                                    selection.triggerChange();
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
                $("." + PROPS_HOLDER).remove()
                console.log(component);
                var options = $("<div>").addClass(PROPS_HOLDER)
                options.append("<h4>" + component.model.componentName + " properties</h4>");

                for (var s_id in component.model.template.styles) {
                    var curr_style = component.model.template.styles[s_id];
                    
                    var el = null;
                    var lbl = $('<label>').text(curr_style.label);
                    
                    var currentVal = component.model.getStyle(s_id);
                    
                    switch (curr_style.type) {
                        case "select":
                            el = $("<select>")
                            for (var op_id in curr_style.options) {
                                var curr_op = curr_style.options[op_id];
                                el.append($("<option>").val(curr_op.value).text(curr_op.caption))
                            }
                            
                            el.val(currentVal);
                            
                            el.on("change", function (value) {
                                component.model.setStyle(s_id, $(this).val());
                            })
                            break;
                        case "text":
                            el = $("<input>").attr({type: 'text'}).val(currentVal);
                            el.on("change", function () {
                                console.log("changing  a thing to " + curr_style.name + " to val " + el.val());
                                component.model.setStyle(curr_style.name, el.val());
//                                curr_style.value = el.val();
                            });
                            break;
                        case "option":
                            el = $("<input>").attr({type: 'checkbox'})
                            el.on("change", function () {
                                if (el.prop('checked')) {
                                    component.model.setStyle(curr_style.name, curr_style.value)
                                } else {
                                    component.model.setStyle(curr_style.name, "")
                                }
                            });
                            if (curr_style.value == currentVal) {
                                el.prop('checked', true);
                            }
                            break;
                        default:
                            break;
                    }
                    if (el) {
                        lbl.append(el);
                        options.append(lbl);
                    }
                }
                
                var componentAttrs = component.model.getData('data_attributes');
                if (componentAttrs) {
                    options.append("<h4>Attributes</h4>");
                    
                    var changeAttribute = function (componentName, name) {
                        return function () {
                            componentAttrs[componentName][name] = $(this).val();
                            if (component.model.componentTree) {
                                component.model.componentTree.contentChanging(component.model, componentName);
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
                            attrInput = $("<input>").attr({type: 'text'}).val(itemAttrs[key]);
                            attrInput.on("change", changeAttribute(componentName, key));
                            attrlbl.append(attrInput);
                            options.append(attrlbl);
                        }
                    }
                }
                

                if (component.model.directives.image && component.model.directives.image.length) {
                    for (var directive_id in component.model.directives.image) {
                        var curr_img = component.model.directives.image[directive_id];
                        var $image_button = $("<button>").text("Select \"" + curr_img.name +'"').on("click", function () {
                            selectImage(function (attrs) {
                                // ComponentView.prototype.set
                                
                                component.model.setDirectiveAttribute(curr_img.name, 'width', attrs.width);
                                component.model.setDirectiveAttribute(curr_img.name, 'height', attrs.height);
                                
                                component.model.setContent(curr_img.name, {url: attrs.src});
                            })
                        })
                        options.append($image_button)
                    }
                }

                if (component.model.directives.link && component.model.directives.link.length) {
                    for (var linkIndex in component.model.directives.link) {
                        var _thisLink = component.model.directives.link[linkIndex];
                        var $link_button = $("<button>").text('Select "' + _thisLink.name + '"').on("click", function () {
                            selectLink(function (attrs) {
                                // ComponentView.prototype.set
                                component.model.setContent(_thisLink.name, attrs.href);
                            })
                        })
                        options.append($link_button)
                    }
                }
                
                $properties.html(options)
                
                
                var $delete_button = $("<button>").text("Remove").on("click", function () {
                    component.model.remove();
                    $("." + PROPS_HOLDER).remove();
                })
                
                $('<div class="Actions">').appendTo(options).append($delete_button);
            })
        });


        function selectLink(callback) {
            ContentWrapper.setCallback(callback);
            ContentWrapper.showDialog('link');
        }

        function selectImage(callback) {
            ContentWrapper.setCallback(function (content) {
                var attrs = {};
                var node = $(content)[0];
                if (!node) {
                    return;
                }
                if (node.nodeName !== 'IMG') {
                    alert("Image not selected");
                    return;
                }
                var nodeAttrs = node.attributes;
                for (var i = 0; i < nodeAttrs.length; i++ ) {
                    attrs[nodeAttrs[i].name] = nodeAttrs[i].value;
                }
                callback(attrs);
            });
            ContentWrapper.showDialog('image');
        }


        function updateDataFields(realchange) {
            $('#Form_LivingForm').find('[name=PageStructure]').val(livingdoc.toJson());
            $('#Form_LivingForm').find('[name=Content]').val(livingdoc.toHtml());
            if (realchange) {
                $('#Form_LivingForm').attr('data-changed', 1);
            }
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