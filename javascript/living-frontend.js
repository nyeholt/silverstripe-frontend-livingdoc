;
(function ($) {
    
    if (!window.$) {
        window.$ = $;
    }

    var DOC_HOLDER = '.livingdocs-editor';
    
    var TOOLBAR_FORM = '#Form_LivingForm';
    
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
    
    $(document).on('click', 'form' + TOOLBAR_FORM +' input.action', function (e) { 
        
        // catuch the "live" click and redirect instead
        if ($(this).attr('name') == 'action_live') {
            e.preventDefault();
            location.href = location.href + '?edit=stop&stage=Live';
            return false;
        }
        
        var parentForm = $(this).parents('form');
        parentForm.find('input.hidden-action').remove();
        $('<input class="hidden-action">').attr({
            'type': 'hidden',
            'name': $(this).attr('name'),
            'value': '1'
        }).appendTo(parentForm);
    })

    $(document).on('submit', TOOLBAR_FORM, function () {
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
        if ($(TOOLBAR_FORM).attr('data-changed')) {
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
        
        // todo(Marcus) Remove this, it doesn't need to be global
        window.livingdoc = livingdoc;

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
            var $componentsList = $components.find('ul');
            var $properties = $('.livingdocs-item-properties');
            var componentGroupMap = {};
            
            var addGroup = function (label, num) {
                var $group = $('<li>');
                $group.append('<input type="checkbox" checked>');
                $group.append('<i>');
                $group.append('<h2>' + label + '</h2>');
                $group.append('<div class="group-component-holder" id="gch-'+num+'"></div>');
                
                $componentsList.append($group);
            }
            
            // use selectedDesign - the template, not active components at this point
            for (var i = 0; i < selectedDesign.groups.length; i++) {
                addGroup(selectedDesign.groups[i].label, i);
                for (var j in selectedDesign.groups[i].components) {
                    componentGroupMap[selectedDesign.groups[i].components[j]] = 'gch-' + i;
                }
            }

            addGroup('Misc', 'misc');
            
            for (var i = 0; i < activeDesign.components.length; i++) {
                var template = activeDesign.components[i];
                var $entry = $('<div class="toolbar-entry">');
                $entry.html(template.label);
                
                var groupId = componentGroupMap[template.name];
                if (!groupId) {
                    groupId = 'gch-misc';
                }
                
                var $holder = $('#' + groupId);
                $holder.append($entry);

                draggableComponent(doc, template.name, $entry);
            }
            
            delete componentGroupMap;
            
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
            
            // add in the structured components
            if (selectedDesign.structures && selectedDesign.structures.length > 0) {
                
                var createComponentList = function (components, parent, containerName) {
                    for (var i in components) {
                        // create the new one and set relevant styles
                        var newComponent = livingdoc.componentTree.getComponent(components[i].type);
                        
                        if (components[i].styles) {
                            for (var j in components[i].styles) {
                                newComponent.setStyle(j, components[i].styles[j]);
                            }
                        }
                        
                        if (components[i].data_attributes) {
                            for (var directive in components[i].data_attributes) {
                                for (var attrName in components[i].data_attributes[directive]) {
                                    newComponent.setDirectiveAttribute(directive, attrName, components[i].data_attributes[directive][attrName]);
                                }
                            }
                        }
                        
                        // if we don't have a containerName, that means we are most likely adding
                        // to the root 
                        if (containerName) {
                            parent.prepend(containerName, newComponent);
                        } else {
                            parent.prepend(newComponent);
                        }
                        
                        
                        if (components[i].components) {
                            for (var componentContainerName in components[i].components) {
                                createComponentList(components[i].components[componentContainerName], newComponent, componentContainerName);
                            }
                        }
                    }
                };
                
                var optionList = $('<select>').attr('id', 'component-structures');
                optionList.append('<option>-- structures --</option>');
                for (var i in selectedDesign.structures) {
                    var item = selectedDesign.structures[i];
                    optionList.append($('<option value="">').text(item.label).attr('value', item.label));
                }
                
                var structureFields = $('<div class="structure-options">');
                structureFields.append($('<label for="component-structures">Select a pre-defined set of components, or add individual components below</label>'));
                structureFields.append(optionList);
                var structureButton = $('<button>Add</button>');
                structureFields.append(structureButton);
                $components.prepend(structureFields);
                
                structureButton.click(function (e) {
                    var selected = optionList.val();
                    for (var i in selectedDesign.structures) {
                        var item = selectedDesign.structures[i];
                        if (item.label === selected) {
                            createComponentList(item.components, livingdoc.componentTree.root);
                            break;
                        }
                    }
                    optionList.val('');
                });
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
                $("." + PROPS_HOLDER).remove();
                var options = $("<div>").addClass(PROPS_HOLDER)
                options.append("<h4>" + component.model.componentName + " properties</h4>");
                
                for (var s_id in component.model.template.styles) {
                    var curr_style = component.model.template.styles[s_id];
                    
                    var el = null;
                    var lbl = $('<label>').text(curr_style.label);
                    
                    var currentVal = component.model.getStyle(s_id);
                    
                    switch (curr_style.type) {
                        case "select":
                            el = $("<select>");
                            var multi = false;
                            for (var op_id in curr_style.options) {
                                var curr_op = curr_style.options[op_id];
                                
                                // todo(Marcus) - this is such a hack
                                if (curr_op.caption.toLowerCase() == 'multiple') {
                                    multi = true;
                                    continue;
                                }
                                
                                el.append($("<option>").val(curr_op.value).text(curr_op.caption))
                            }
                            
                            if (multi) {
                                el.attr('size', 3).prop('multiple', true);
                                if (currentVal) {
                                    currentVal = currentVal.split(' ');
                                }
                            }
                            el.val(currentVal);

                            el.on("change", function (styleId) {
                                return function () {
                                    var selection = $(this).val();
                                    if (selection && (typeof selection) !== 'string' && selection.length) {
                                        selection = selection.join(' ');
                                    }
                                    component.model.setStyle(styleId, selection);
                                };
                            }(s_id))
                            break;
                        case "text":
                            el = $("<input>").attr({type: 'text'}).val(currentVal);
                            el.on("change", function (styleName) {
                                return function () {
                                    component.model.setStyle(styleName, el.val());
                                };
//                                curr_style.value = el.val();
                            }(curr_style.name));
                            break;
                        case "option":
                            el = $("<input>").attr({type: 'checkbox'})
                            el.on("change", function (styleName, styleValue) {
                                return function () {
                                    if ($(this).prop('checked')) {
                                        component.model.setStyle(styleName, styleValue)
                                    } else {
                                        component.model.setStyle(styleName, "")
                                    }
                                };
                            }(curr_style.name, curr_style.value));
                            if (curr_style.value == currentVal) {
                                el.prop('checked', true);
                            }
                            break;
                        default:
                            break;
                    }
                    if (el) {
                        $('<div>').append(el).appendTo(lbl);
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


        // todo(Marcus) Clean this up in some way
        function updateDataFields(realchange) {
            $(TOOLBAR_FORM).find('[name=PageStructure]').val(livingdoc.toJson());
            $(TOOLBAR_FORM).find('[name=Content]').val(livingdoc.toHtml());
            if (realchange) {
                $(TOOLBAR_FORM).attr('data-changed', 1);
                $(TOOLBAR_FORM).find('[name=action_publish]').prop('disabled', true);
            }
        }

    })

})(jQuery);