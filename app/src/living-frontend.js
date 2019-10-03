
import * as jQuery from 'jquery';

import './livingdocs/editable';
import './livingdocs/livingdocs-engine';

import ContentBridge from './modules/lf-editor-content-bridge';
import LivingDocState from './lib/LivingDocState';
import ContentSource from './lib/FormContentSource';

(function ($) {
    
    if (!window.$) {
        window.$ = $;
    }
    
    var PING_TIME = 300;
    var MAX_TIME = 86400;
    
    var pingErrors = 0;
    
    var editingTime = 0;
    
    var pingterval = setInterval(function () {
        
        if (editingTime > MAX_TIME) {
            clearInterval(pingterval);
            return;
        }
        
        $.get('Security/ping').success(function () {
            pingErrors = 0;
        }).error(function () {
            pingErrors++;
            if (pingErrors > 5) {
                alert("Your session may have expired, please try logging in again in a separate tab");
                clearInterval(pingterval);
            }
        });
        
        editingTime += PING_TIME;
    }, PING_TIME*1000);
    
    
    var TOOLBAR_FORM = '#Form_LivingForm';
    var PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

    var TABLE_ROW_COMPONENT = 'tablerow';
    var TABLE_CELL_COMPONENT = 'tablecell';
    var HEADER_CELL_COMPONENT = 'headercell';
    

    // ContentBridge.init();

    $(document).on('click', function (e) {
        if ($(e.target).parents('#livingdocs-editor').length <= 0 &&
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
    
    // re-structures the form to ensure ajax submits pass through the 
    // triggered action
    $(document).on('click', 'form' + TOOLBAR_FORM +' > .Actions .action', function (e) { 
        // catuch the "live" click and redirect instead
        if ($(this).attr('name') == 'action_live') {
            e.preventDefault();
            location.href = location.href + '?edit=stop&stage=Live';
            return false;
        }
        
        if ($(this).hasClass('link-action')) {
            e.preventDefault();
            location.href = $(this).attr('data-link');
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

    $(function () {


        var structure = ContentSource.getPageStructure();

        // relies on a design file having been loaded earlier
        // TODO - abstract this in _some_ manner. TBA
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
        
        // provides 3rd party hooks
        $(document).trigger('updateLivingdocsDesign', selectedDesign);

        // hard coded against the design for now??
        // selectedDesign.assets.basePath = "frontend-livingdoc/javascript/livingdocs/";

        // doc.design.load(selectedDesign);

        // doc.config({
        //     livingdocsCssFile: "frontend-livingdoc/javascript/livingdocs/css/livingdocs.css",
        //     editable: {
        //         browserSpellcheck: true,
        //         changeDelay: 50
        //     }
        //     // ,
        //     // // really not sure if this matters here, but we'll run with it for now. 
        //     // directives: {
        //     //     dataobject: {
        //     //         attr: 'doc-dataobject',
        //     //         renderedAttr: 'calculated in augment_config',
        //     //         overwritesContent: true
        //     //     }
        //     // }
        // });

        // livingdoc = doc.new(structure);

        LivingDocState.loadLivingdoc(doc, selectedDesign, structure, ContentSource);

        // bind it into the bridge
        // ContentBridge.setLivingDoc(livingdoc);

        LivingDocState.notifyDocUpdate();

        var ready = LivingDocState.livingdoc.createView({
            interactive: true,
            iframe: false,
            host: ContentSource.getConfig().editorHost,
            wrapper: LivingDocState.activeDesign.wrapper
        });

        ready.then(function () {
            // captures model changes that need updating
            LivingDocState.livingdoc.model.changed.add(function () {
                LivingDocState.notifyDocUpdate(true);
            });
            
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
            for (var i = 0; i < LivingDocState.activeDesign.components.length; i++) {
                var template = LivingDocState.activeDesign.components[i];
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
            
            // Binds the drag behaviour when a menu item is dragged
            function draggableComponent(doc, name, $elem) {
                $elem.on('mousedown', function (event) {
                    var newComponent = LivingDocState.livingdoc.createComponent(name);
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
                var optionList = $('<select class="with-button">').attr('id', 'component-structures');
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
                            var container = LivingDocState.activeComponent ? 
                                LivingDocState.activeComponent.model.parentContainer : 
                                LivingDocState.livingdoc.componentTree.root;
                            
                            createComponentList(item.components, container);
                            break;
                        }
                    }
                    optionList.val('');
                });
            }
            
            // when adding a component, see if it has a set of components that should
            // be immediately created. Useful for something like a table cell that should always
            // have a paragraph in it when added
            LivingDocState.livingdoc.componentTree.componentAdded.add(function (newComponent) {
                var toCreate = selectedDesign.prefilledComponents[newComponent.componentName];
                
                if (toCreate && toCreate.components) {
                    for (var containerName in toCreate.components) {
                        createComponentList(toCreate.components[containerName], newComponent, containerName);
                    }
                }
            });


            LivingDocState.livingdoc.interactiveView.page.focus.componentFocus.add(function (component) {
                $("." + PROPS_HOLDER).remove();
                $(".livingdocs_EditorField_Toolbar_textopts").remove();
                var options = $("<div>").addClass(PROPS_HOLDER);

                LivingDocState.focusOn(component);

                options.append("<h4>" + component.model.componentName + " properties</h4>");
                
                var closer = $('<button class="close properties-closer" title="Close properties"><span class="icon"></span>&times;</button>')
                    .on('click', function(e){
                        e.preventDefault();
                        LivingDocState.blur();
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
                
                if (component.model.componentName === 'table') {
                    // add row and add column

                    var tableNode = component.$html[0];
                    if (tableNode) {
                        
                        LivingDocState.showButtonBar([
                            {
                                label: 'Add row',
                                click: function () {
                                    alert("NEW");
                                    var currentRow = component.$html.find('tr:first');
                                    var numCells = 0;
                                    if (currentRow.length) {
                                        numCells = currentRow.find('th').length ?
                                                currentRow.find('th').length :
                                                currentRow.find('td').length;
                                    }

                                    var newComponent = LivingDocState.livingdoc.componentTree.getComponent(TABLE_ROW_COMPONENT);
                                    component.model.append('tablebody', newComponent);

                                    //create cells
                                    for (var i = 0; i < numCells; i++) {
                                        var newCell = LivingDocState.livingdoc.componentTree.getComponent(TABLE_CELL_COMPONENT);
                                        newComponent.append('rowcells', newCell);
                                        
                                        var newP = LivingDocState.livingdoc.componentTree.getComponent("p");
                                        newCell.append("cellitems", newP);
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
                    if (confirm("Remove this?")) {
                        component.model.remove();
                        $("." + PROPS_HOLDER).remove();
                    }
                });
                
                var $dupe_button = $("<button class='alert alert-warning'>").text("Duplicate").on("click", function () {
                    var tmpTree = new doc.ComponentTree({design: LivingDocState.livingdoc.componentTree.design});
                    
                    // need to swap out 'next' for the moment otherwise the serialize walker
                    // will do _all_ siblings. 
                    var oldNext = component.model.next;
                    component.model.next = null;
                    var jsonRep = tmpTree.serialize(component.model, true);
                    component.model.next = oldNext;
                    
                    createComponentList(jsonRep.content, component.model.parentContainer);
                    
                });
                
                $('<div class="Actions component-actions">').appendTo(options).append($dupe_button).append($delete_button)

                $properties.html(options);
                if ($.fn.drags) {
                    $('.livingdocs-item-properties').drags({
                        handle: "h4"
                    });
                }
            });

            $(document).trigger('livingfrontend.updateLivingDoc', [LivingDocState.livingdoc]);
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
        LivingDocState.showButtonBar = function (buttons, loc) {
            $(".livingdocs_EditorField_Toolbar_textopts").remove()
            var outer_el = $("<div>").addClass("livingdocs_EditorField_Toolbar_textopts");

            for (var i = 0; i < buttons.length; i++) {
                var b = buttons[i];
                var buttonEl = $('<button>').html(b.label);
                if (b.title) {
                    buttonEl.attr('title', b.title);
                }
                buttonEl.on('mousedown', function (theButton) { return function (e) { e.preventDefault(); theButton.click(); } }(b) );
                
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

            outer_el.css({position: "absolute", left: loc.left, top: loc.top - 40, background: "transparent", "z-index": 4000});
            appendTo.append(outer_el);
        };

        LivingDocState.showDialog = function () {
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

        LivingDocState.closeDialog = function () {
            var dialog = $('#lf-dialog');
            if (dialog.length) {
                dialog.removeClass('active-dialog');
                dialog.find('lf-dialog-content').html('');
            }
        }

        $(document).on('click', 'a.lf-dialog-close', function (e) {
            LivingDocState.closeDialog();
            return false;
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
                parent = LivingDocState.livingdoc.componentTree.root;
            }
            var newComponents = LivingDocState.livingdoc.componentTree.componentsFromList(components, LivingDocState.activeDesign);
            
            if (parent) {
                for (var i in newComponents) {
                    if (containerName) {
                        parent.append(containerName, newComponents[i]);
                    } else {
                        parent.append(newComponents[i]);
                    }
                }
            }

//            for (var i in newComponents) {
//                if (newComponents[i]) {
//                    parent.append(newComponents[i]);
//                }
//            }
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
                    var newCell = LivingDocState.livingdoc.componentTree.getComponent(cellType);
                    firstRow.append('rowcells', newCell);
                    firstRow = firstRow.next;
                    
                    var newP = LivingDocState.livingdoc.componentTree.getComponent("p");
                    newCell.append("cellitems", newP);
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
    });
    
    
    (function($) {
        $.fn.drags = function(opt) {

            opt = $.extend({handle:"",cursor:"move"}, opt);
            
            var $el = this;
            
            if(opt.handle === "") {
                var $handle = this;
            } else {
                var $handle = this.find(opt.handle);
            }

            return $handle.css('cursor', opt.cursor).on("mousedown", function(e) {
                var $drag = $el.addClass('__draggable');
                
                if(opt.handle === "") {
                    
                } else {
                    $handle.addClass('active-handle');
                }
                var z_idx = $drag.css('z-index'),
                    drg_h = $drag.outerHeight(),
                    drg_w = $drag.outerWidth(),
                    pos_y = $drag.offset().top + drg_h - e.pageY,
                    pos_x = $drag.offset().left + drg_w - e.pageX;
                $drag.css({'z-index': '3000'}).parents().on("mousemove", function(e) {
                    $('.__draggable').css('right', 'auto');
                    $('.__draggable').offset({
                        top:e.pageY + pos_y - drg_h,
                        left:e.pageX + pos_x - drg_w
                    }).on("mouseup", function() {
                        $(this).css({'z-index': z_idx});
                        $handle.removeClass('__draggable');
                    });
                });
                e.preventDefault(); // disable selection
            }).on("mouseup", function() {
                $el.removeClass('__draggable');
                if(opt.handle === "") {
                    
                } else {
                    $handle.removeClass('active-handle');
                }
            });

        }
    })(jQuery);

})(jQuery);