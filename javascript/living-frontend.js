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

    var TABLE_ROW_COMPONENT = 'tablerow';
    var TABLE_CELL_COMPONENT = 'tablecell';
    var HEADER_CELL_COMPONENT = 'headercell';

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
        
        // catuch the "live" click and redirect instead
        if ($(this).attr('name') == 'action_preview') {
            e.preventDefault();
            location.href = location.href + '?preview=1&stage=Stage';
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
        
        var embeds = JSON.parse($('input[name=Embeds]').val());
        var EMBED_LINK = $('input[name=EmbedLink]').val();

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
        
        if (!selectedDesign) {
            alert("Selected design " + selectedDesignName + " couldn't be found");
            return;
        }
        
        $(document).trigger('updateLivingdocsDesign', selectedDesign);

        selectedDesign.assets.basePath = "frontend-livingdoc/javascript/livingdocs/";

        doc.design.load(selectedDesign);

        doc.config({
            livingdocsCssFile: "frontend-livingdoc/javascript/livingdocs/css/livingdocs.css",
            editable: {
                browserSpellcheck: true
            }
            ,
            directives: {
                dataobject: {
                    attr: 'doc-dataobject',
                    renderedAttr: 'calculated in augment_config',
                    overwritesContent: true
                }
            }
        });

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
            
            // captures model changes that need updating
            livingdoc.model.changed.add(function () {
                updateDataFields(true);
            });
            
            
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
                            createComponentList(item.components);
                            break;
                        }
                    }
                    optionList.val('');
                });
            }
            
            livingdoc.componentTree.componentAdded.add(function (newComponent) {
                var toCreate = selectedDesign.prefilledComponents[newComponent.componentName];
                
                if (toCreate && toCreate.components) {
                    for (var containerName in toCreate.components) {
                        createComponentList(toCreate.components[containerName], newComponent, containerName);
                    }
                }
            });
            
            var showButtonBar = function (buttons, loc) {
                $(".livingdocs_EditorField_Toolbar_textopts").remove()
                var outer_el = $("<div>").addClass("livingdocs_EditorField_Toolbar_textopts");
                
                for (var i = 0; i < buttons.length; i++) {
                    var b = buttons[i];
                    var buttonEl = $('<button>').html(b.label);
                    if (b.title) {
                        buttonEl.attr('title', b.title);
                    }
                    buttonEl.on('mousedown', function (e) { e.preventDefault();})
                    buttonEl.on('click', b.click);
                    
                    outer_el.append(buttonEl);
                }

                outer_el.css({position: "absolute", left: loc.left, top: loc.top - 40, background: "transparent", "z-index": 1000});
                $('body').append(outer_el);
            };

            // text formatting options
            // @TODO - provide more in-paragraph options
            //  - sup/sub
            //  - strike
            //  - text-alignment (an option maybe?) 
            livingdoc.interactiveView.page.editableController.selection.add(function (view, editableName, selection) {
                $(".livingdocs_EditorField_Toolbar_textopts").remove()
                var outer_el = $("<div>").addClass("livingdocs_EditorField_Toolbar_textopts");
                if (selection && selection.isSelection) {
                    var rect = selection.getCoordinates();
                    
                    showButtonBar([
                        {
                            label: 'Add link',
                            click: function () {
                                selection.save();
                                // prevents range saving from being cleared on focus lost. @see editable.js pastingAttribute
                                selection.host.setAttribute('data-editable-is-pasting', true);
                                selectLink(function (linkObj) {
                                    selection.restore();
                                    selection.setVisibleSelection();
                                    selection.link(linkObj.href, {target: linkObj.target, title: linkObj.title})
                                    selection.host.setAttribute('data-editable-is-pasting', false);
                                    selection.triggerChange();
                                });
                            }
                        },
                        {
                            label: '<strong>B</strong>',
                            title: 'Bold',
                            click: function () {
                                selection.toggleBold()
                                selection.triggerChange()
                            }
                        },
                        {
                            label: '<em>I</em>',
                            title: 'Italics',
                            click: function () {
                                selection.toggleEmphasis()
                                selection.triggerChange();
                            }
                        },
                        {
                            label: '<sub>s</sub>',
                            title: 'Subscript',
                            click: function () {
                                var s = selection.createElement('sub');
                                selection.toggle(s);
                                selection.triggerChange();
                            }
                        },
                        {
                            label: '<sup>s</sup>',
                            title: 'Superscript',
                            click: function () {
                                var s = selection.createElement('sup');
                                selection.toggle(s);
                                selection.triggerChange();
                            }
                        },
                        {
                            label: 'Clear',
                            click: function () {
                                selection.removeFormatting();
                            }
                        }
                    ], rect);
                }
            });

            livingdoc.interactiveView.page.htmlElementClick.add(function (component, directiveName, event) {
                
                var isEditing = component.$html.attr('data-is-editing');
                if (isEditing) {
                    return;
                }
                
                component.$html.attr('data-is-editing', 1);
                
                var currentContent = component.model.get(directiveName);
                
                var $editor = $('<textarea>').css({'width': '100%'}).attr('rows', 10);
                
                var $actions = $('<div>');
                var $save = $('<button>Save</button>');
                var $cancel = $('<button>Cancel</button>');
                $actions.append($save).append($cancel);
                
                $editor.html(currentContent);
                component.$html.html($editor);
                component.$html.append($actions);
                
                $editor.focus();
                
                $cancel.click(function () {
                    component.$html.html(currentContent);
                    component.$html.removeAttr('data-is-editing');
                    $editor.remove();
                });
                
                $save.click(function () {
                    var newContent = $editor.val();
                    var catcher = $('<div>');
                    catcher.append(newContent);
                    catcher.find('script').remove();
                    component.model.setContent(directiveName, catcher.html());
                    component.$html.removeAttr('data-is-editing');
                    $editor.remove();
                })
            });
            
            livingdoc.interactiveView.page.embedItemClick.add(function (component, directiveName, event) {
                
            })

            livingdoc.interactiveView.page.focus.componentFocus.add(function (component) {
                $("." + PROPS_HOLDER).remove();
                var options = $("<div>").addClass(PROPS_HOLDER)
                options.append("<h4>" + component.model.componentName + " properties</h4>");
                
                var closer = $('<a href="#">X</a>').appendTo(options);
                closer.css({
                    'float': 'right'
                });
                closer.click(function (e) {
                    e.preventDefault();
                    $("." + PROPS_HOLDER).remove();
                    return false;
                })
                
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
                        options.append('<div>').append(lbl);
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
                
                if (component.model.directives.embeditem && component.model.directives.embeditem.length) {
                    for (var index in component.model.directives.embeditem) {
                        var _thisItem  = component.model.directives.embeditem[index];
                        
                        var currentValue = component.model.get(_thisItem.name);
                        currentValue = currentValue || {source: '', content: null};
                        
                        var attrInput = null;
                        var attrlbl = $('<label>').text(_thisItem.name + ' source');
                        
                        if (embeds) {
                            attrInput = $('<select>');
                            attrInput.append('<option>-- select item --</option>');
                            for (var label in embeds) {
                                var opt = $('<option>').appendTo(attrInput);
                                opt.attr('value', label).text(label);
                            }
                        } else {
                            attrInput = $("<input>").attr({type: 'text', placeholder: 'Source string'});
                        }
                        
                        if (attrInput) {
                            attrInput.val(currentValue.source);
                        }
                        
                        var attrButton = $('<button>✔</button>');
                        attrButton.on("click", function () {
                            var selected = attrInput.val();
                            if (selected) {
                                $.get(EMBED_LINK, {embed: selected}).success(function (data) {
                                    component.model.setContent(_thisItem.name, {
                                        source: selected,
                                        content: data
                                    });
                                });
                            } else {
                                component.model.setContent(_thisItem.name, {
                                    source: '',
                                    content: ''
                                });
                            }
                            
                        });
                        attrlbl.append(attrInput).append(attrButton);
                        options.append(attrlbl);
                    }
                    
                }
                
                if (component.model.componentName === 'table') {
                    // add row and add column
                    
//                    showButtonBar([
//                        
//                    ]);
                    
                    var addRow = $('<button>').text('Add row').on('click',function () {
                        var currentRow = component.$html.find('tr:first');
                        var numCells = 0;
                        if (currentRow.length) {
                            numCells = currentRow.find('th').length ? 
                                    currentRow.find('th').length : 
                                    currentRow.find('td').length;
                        }
                        
                        var newComponent = livingdoc.componentTree.getComponent(TABLE_ROW_COMPONENT);
                        component.model.append('tablebody', newComponent);
                        
                        //create cells
                        for (var i = 0; i < numCells; i++) {
                            var newCell = livingdoc.componentTree.getComponent(TABLE_CELL_COMPONENT);
                            newComponent.append('rowcells', newCell);
                        }
                        
                    });
                    
                    var addCol = $('<button>').text('Add column').on('click', function () {
                        var headerRow = component.model.containers.tablehead.first;
                        addCellToRows(headerRow, HEADER_CELL_COMPONENT);
                        
                        var bodyRow = component.model.containers.tablebody.first;
                        addCellToRows(bodyRow, TABLE_CELL_COMPONENT);
                        
                    });
                    
                    $('<div>').append(addRow).append(addCol).appendTo(options);
                }
                
                var $delete_button = $("<button class='alert alert-danger'>").text("Remove").on("click", function () {
                    component.model.remove();
                    $("." + PROPS_HOLDER).remove();
                })
                
                $('<div class="Actions">').appendTo(options).append($delete_button);
                
                $properties.html(options)
                
            })
        });
        
        /**
         * creates components, inside a given parent.
         * 
         * @param array components
         * @param ComponentModel parent
         * @param string containerName
         * @returns void
         */
        function createComponentList (components, parent, containerName) {
            if (!parent) {
                parent = livingdoc.componentTree.root;
            }
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
                    parent.append(containerName, newComponent);
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

        /**
         * Iteratively add cells to all the rows in a given table container
         * 
         * @param {type} firstRow
         * @param {type} cellType
         * @returns {.firstRow.next.next}
         */
        function addCellToRows(firstRow, cellType) {
            if (firstRow) {
                while (firstRow && firstRow.componentName == TABLE_ROW_COMPONENT) {
                    var newCell = livingdoc.componentTree.getComponent(cellType);
                    firstRow.append('rowcells', newCell);
                    firstRow = firstRow.next;
                }
            }
            return firstRow;
        }

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

    });

})(jQuery);