;
(function ($) {
    
    if (!window.$) {
        window.$ = $;
    }
    
    var livingdoc;
    
    window.LivingFrontendHelper = {
        
    };

    var DOC_HOLDER = '.livingdocs-editor';
    
    var TOOLBAR_FORM = '#Form_LivingForm';
    
    var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

    
    var TABLE_ROW_COMPONENT = 'tablerow';
    var TABLE_CELL_COMPONENT = 'tablecell';
    var HEADER_CELL_COMPONENT = 'headercell';

    ContentBridge.init();

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
        ContentBridge.setLinkObject({
            href: 'link/href', target: '', title: 'linktitle'
        });
    });
    
    $(document).on('click', 'form' + TOOLBAR_FORM +' > .Actions .action', function (e) { 
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
            _this.find('button.action').each(function () {
                $(this).prop('disabled', false);
            });
        });
        
        _this.find('button.action').each(function () {
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
            // really not sure if this matters here, but we'll run with it for now. 
            directives: {
                dataobject: {
                    attr: 'doc-dataobject',
                    renderedAttr: 'calculated in augment_config',
                    overwritesContent: true
                }
            }
        });

        livingdoc = doc.new(structure);

        // bind it into the bridge
        ContentBridge.setLivingDoc(livingdoc);

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
            
            // use selectedDesign - the template, not active components at this point, as it is simpler to 
            // iterate
            for (var i = 0; i < selectedDesign.groups.length; i++) {
                addGroup(selectedDesign.groups[i].label, i);
                for (var j in selectedDesign.groups[i].components) {
                    componentGroupMap[selectedDesign.groups[i].components[j]] = 'gch-' + i;
                }
            }

            addGroup('Misc', 'misc');
            
            // Adds in all the components in their appropriate grouping 
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
            
            // Binds the drag behaviour when a menu item is dragged
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
            
            // add in the structured components that can be chosen to have fully created
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
            
            // when adding a component, see if it has a set of components that should
            // be immediately created. Useful for something like a table cell that should always
            // have a paragraph in it when added
            livingdoc.componentTree.componentAdded.add(function (newComponent) {
                var toCreate = selectedDesign.prefilledComponents[newComponent.componentName];
                
                if (toCreate && toCreate.components) {
                    for (var containerName in toCreate.components) {
                        createComponentList(toCreate.components[containerName], newComponent, containerName);
                    }
                }
            });
            
            /**
             * Show a list of buttons in a toolbar. The button list should be
             * [
             *     { label: 'Label', title: 'tooltop', click: function () {} }
             * ]
             * 
             * @param an array of button objects
             * @param an object with a .left and .top  property that defines where to show the bar
             * @returns void
             */
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

                var appendTo = $('body');
                if (!loc.left) {
                    // we have a node instead
                    appendTo = $(loc).parent();
                    
                    var newloc = {
                        top: loc.offsetTop + 20,
                        left: loc.offsetLeft + 20
                    };
                    loc = newloc;
                }
                
                outer_el.css({position: "absolute", left: loc.left, top: loc.top - 40, background: "transparent", "z-index": 1000});
                appendTo.append(outer_el);
            };
            
            LivingFrontendHelper.showDialog = function () {
                var popup;
                var dialog = $('#lf-dialog');
                if (!dialog.length) {
                    dialog = $('<div class="lf-overlay" id="lf-dialog">');
                    popup = $('<div class="lf-popup">').appendTo(dialog);
                    popup.append('<a class="lf-dialog-close" href="#">&times;</a>');
                    popup.append('<div class="lf-dialog-content">');
                    $('body').append(dialog);
                }

                popup = dialog.find('.lf-popup');
                popup.empty();
                $(dialog).addClass('active-dialog');
                return popup;
            }
            
            LivingFrontendHelper.closeDialog = function () {
                var dialog = $('#lf-dialog');
                if (dialog.length) {
                    dialog.removeClass('active-dialog');
                    dialog.find('lf-dialog-content').html('');
                }
            }
            
            $(document).on('click', 'a.lf-dialog-close', function (e) {
                LivingFrontendHelper.closeDialog();
                return false;
            });

            livingdoc.interactiveView.page.editableController.editable.on('paste', function (elem, blocks, cursor) {
                
            });

            // text formatting options
            // @TODO - provide more in-paragraph options
            //  - sup/sub
            //  - strike
            //  - text-alignment (an option maybe?) 
            livingdoc.interactiveView.page.editableController.selection.add(function (view, editableName, selection) {
                if (selection && selection.isSelection) {
                    var rect = selection.getCoordinates();
                    
                    var barOptions = [
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
                    ];

                    $(document).trigger('livingfrontend.updateContentButtonBar', [barOptions, selection, ContentBridge]);
                    showButtonBar(barOptions, rect);
                }
            });

            // HTML directive handling
            livingdoc.interactiveView.page.htmlElementClick.add(function (component, directiveName, event) {
                
                var isEditing = component.$html.attr('data-is-editing');
                component.$html.addClass('js-editor-block');
                if (isEditing) {
                    return;
                }
                
                component.$html.attr('data-is-editing', 1);
                
                var currentContent = component.model.getData(directiveName + '-raw');
                
                var $edBlock = $('<div>').css({
                    'width': '100%',
                    'position': 'absolute',
                    'top': 0,
                    'right': 0,
                    'bottom': '20px',
                    'left': 0,
                });
                var aceeditor = null;

                var $actions = $('<div>');
                var $save = $('<button>OK</button>');
                var $cancel = $('<button>Cancel</button>');
                $actions.css({position: 'absolute', 'bottom': 0}).append($save).append($cancel);
                
                $edBlock.text(currentContent);
                component.$html.html($edBlock);
                component.$html.append($actions);
                
                $edBlock.focus();

                var aceeditor = ace.edit($edBlock[0]);
                aceeditor.session.setMode('ace/mode/html');

                if (component.$html.hasClass('js-living-markdown')) {
                    aceeditor.session.setMode('ace/mode/markdown');
                }

                var cleanUp = function () {
                    if (aceeditor) {
                        aceeditor.destroy();
                    }
                    $edBlock.remove();
                    component.$html.removeAttr('data-is-editing');
                    component.$html.removeClass('js-editor-block');
                }
                
                $cancel.click(function () {
                    component.$html.html(component.model.get(directiveName));
                    cleanUp();
                });
                
                $save.click(function () {
                    var newContent = $edBlock.html();
                    if (aceeditor) {
                        newContent = aceeditor.getValue();
                    }
                    
                    var catcher = $('<div>');
                    catcher.append(newContent); 
                    catcher.find('script').remove().find('textarea').remove();

                    var rawContent = catcher.html();
                    component.model.setData(directiveName + '-raw', rawContent);

                    if (component.$html.hasClass('js-living-markdown')) {
                        // parse it first
                        var converter = new showdown.Converter();
                        rawContent = converter.makeHtml(rawContent);
                    }

                    // highlight code blocks
                    catcher.html(rawContent);
                    catcher.find('pre > code').each (function (i, block) {
                        hljs.highlightBlock(block);
                    })

                    rawContent = catcher.html();

                    if (!component.model.setContent(directiveName, rawContent)) {
                        // we need to force this as the content set by rawContent may not
                        // be different and trigger the HTML update
                        if (component.model.componentTree) {
                            component.model.componentTree.contentChanging(component.model, directiveName);
                        }
                    }
                    
                    cleanUp();
                })
            });
            
            livingdoc.interactiveView.page.embedItemClick.add(function (component, directiveName, event) {
                
            })

            livingdoc.interactiveView.page.focus.componentFocus.add(function (component) {
                $("." + PROPS_HOLDER).remove();
                $(".livingdocs_EditorField_Toolbar_textopts").remove();
                var options = $("<div>").addClass(PROPS_HOLDER)
                options.append("<h4>" + component.model.componentName + " properties</h4>");
                
                var closer = $('<button class="close properties-closer" title="Close properties"><span class="icon"></span>&times;</button>')
                    .on('click', function(e){
                        e.preventDefault();
                        $("." + PROPS_HOLDER).remove();
                        return false;
                    })
                    .appendTo(options);
                
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

                    var tableNode = component.$html[0];
                    if (tableNode) {
                        
                        showButtonBar([
                            {
                                label: 'Add row',
                                click: function () {
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
                                }
                            },
                            {
                                label: 'Add col',
                                click: function () {
                                    var headerRow = component.model.containers.tablehead.first;
                                    addCellToRows(headerRow, HEADER_CELL_COMPONENT);

                                    var bodyRow = component.model.containers.tablebody.first;
                                    addCellToRows(bodyRow, TABLE_CELL_COMPONENT);
                                }
                            }
                            
                        ], tableNode);
                        
                    }
                }
                
                var $delete_button = $("<button class='alert alert-danger'>").text("Remove").on("click", function () {
                    component.model.remove();
                    $("." + PROPS_HOLDER).remove();
                })
                
                $('<div class="Actions">').appendTo(options).append($delete_button);
                
                $properties.html(options)
                
            })

            $(document).trigger('livingfrontend.updateLivingDoc', [livingdoc]);
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
            ContentBridge.setCallback(callback);
            ContentBridge.showDialog('link');
        }

        function selectImage(callback) {
            ContentBridge.setCallback(function (content) {
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
            ContentBridge.showDialog('image');
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