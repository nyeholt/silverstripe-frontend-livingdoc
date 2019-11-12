
import * as jQuery from 'jquery';

import './livingdocs/editable';
import './livingdocs/livingdocs-engine';

import ContentBridge from './modules/lf-editor-content-bridge';
import LivingDocState from './lib/LivingDocState';
import ContentSource from './lib/FormContentSource';
import { initialise_property_editor } from './lib/ld-property-editor';

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

        $.get('Security/ping').then(function () {
            pingErrors = 0;
        }).catch(function () {
            pingErrors++;
            if (pingErrors > 5) {
                alert("Your session may have expired, please try logging in again in a separate tab");
                clearInterval(pingterval);
            }
        });

        editingTime += PING_TIME;
    }, PING_TIME*1000);


    var TOOLBAR_FORM = '#Form_LivingForm';
    var BOTTOM_BAR = '.livingdocs-bottom-bar';

    var TABLE_ROW_COMPONENT = 'tablerow';
    var TABLE_CELL_COMPONENT = 'tablecell';
    var HEADER_CELL_COMPONENT = 'headercell';


    // ContentBridge.init();

    let toolbarToggle = $('<button>').text("Show toolbar");
    $(BOTTOM_BAR).find('.livingdocs-toolbar-controls').append(toolbarToggle);

    toolbarToggle.click(function (e) {
        $('body').toggleClass('show-livingdocs-toolbar');
    });

    $(document).on('mousedown', '#clicker', function (e) {
        e.preventDefault();
    })

    $(document).on('click', '#clicker', function () {
        // ContentBridge.setLinkObject({
        //     href: 'link/href', target: '', title: 'linktitle'
        // });
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
            const defaultIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.21 4.16l4 4v-4zm4 12l-4 4h4zm-12 4l-4-4v4zm-4-12l4-4h-4zm12.95-.95c-2.73-2.73-7.17-2.73-9.9 0s-2.73 7.17 0 9.9 7.17 2.73 9.9 0 2.73-7.16 0-9.9zm-1.1 8.8c-2.13 2.13-5.57 2.13-7.7 0s-2.13-5.57 0-7.7 5.57-2.13 7.7 0 2.13 5.57 0 7.7z" fill="#010101"/><path fill="none" d="M.21.16h24v24h-24z"/></svg>';
            // captures model changes that need updating
            LivingDocState.livingdoc.model.changed.add(function () {
                LivingDocState.notifyDocUpdate(true);
            });

            var $components = $('.livingdocs-components');
            var $componentsList = $components.find('div.component-list');

            var componentGroupMap = {};

            var addGroup = function (label, num) {
                var $group = $('<div>');
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

            let addMenuComponent = function (icon, label, name) {
                var $entryWrap = $('<div class="toolbar-entry-wrapper">');
                var $entry = $('<div class="toolbar-entry">');
                var $entryLabel = $('<div class="toolbar-entry-title">');

                $entry.html(icon ? icon : defaultIcon);
                $entryLabel.html(label);

                $entryWrap.append($entry).append($entryLabel);

                var groupId = componentGroupMap[name];
                if (!groupId) {
                    groupId = 'gch-misc';
                }

                var $holder = $('#' + groupId);
                $holder.append($entryWrap);

                console.log("Adding " + name + " item to " + groupId);
                draggableComponent(doc, name, $entry);
            }

            // Adds in all the components in their appropriate grouping
            for (var i = 0; i < LivingDocState.activeDesign.components.length; i++) {
                var template = LivingDocState.activeDesign.components[i];
                addMenuComponent(template.icon, template.label, template.name);
            }

            for (var compoundName in selectedDesign.compounds) {
                addMenuComponent(null, selectedDesign.compounds[compoundName].label, compoundName);
            }

            // Binds the drag behaviour when a menu item is dragged
            function draggableComponent(doc, name, $elem) {
                $elem.on('mousedown', function (event) {
                    let newComponent;
                    if (selectedDesign.compounds[name]) {
                        newComponent = createComponentList(selectedDesign.compounds[name].components);
                    } else {
                        newComponent = LivingDocState.livingdoc.createComponent(name);
                    }

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
                // var optionList = $('<select class="with-button">').attr('id', 'component-structures');
                // optionList.append('<option>-- Components --</option>');
                // for (var i in selectedDesign.structures) {
                //     var item = selectedDesign.structures[i];
                //     optionList.append($('<option value="">').text(item.label).attr('value', item.label));
                // }

                // var structureFields = $('<div class="structure-options">');
                // structureFields.append($('<label for="component-structures">Select a pre-defined set of components, or add individual components below</label>'));
                // structureFields.append(optionList);
                // var structureButton = $('<button>Add</button>');
                // structureFields.append(structureButton);
                // $components.prepend(structureFields);

                // structureButton.click(function (e) {
                //     var selected = optionList.val();
                //     for (var i in selectedDesign.structures) {
                //         var item = selectedDesign.structures[i];
                //         if (item.label === selected) {
                //             var container = LivingDocState.activeComponent ?
                //                 LivingDocState.activeComponent.model.parentContainer :
                //                 LivingDocState.livingdoc.componentTree.root;

                //             createComponentList(item.components, container);
                //             break;
                //         }
                //     }
                //     optionList.val('');
                // });
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


            // todo(Marcus)
            // figure out how to allow selection of 'background' components
            // let lastClickedComponent = "", lastClickedCount = 0;

            // LivingDocState.livingdoc.interactiveView.page.componentClick.add(function (componentView, page, directives, event) {
            //     if (componentView.model.hasContainers()) {
            //         if (lastClickedComponent === componentView.model.id) {
            //             lastClickedCount++;
            //             if (lastClickedCount == 2) {
            //                 // get the parent and select it
            //                 let parent = componentView.parent();
            //                 page.handleClickedComponent(event, parent);
            //                 page.startDrag({
            //                     componentView: parent,
            //                     event: event
            //                 });
            //                 lastClickedCount = 0;
            //             }
            //         } else {
            //             lastClickedCount = 0;
            //         }
            //         lastClickedComponent = componentView.model.id;
            //     }
            // });

            initialise_property_editor();

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
                if (!containerName && newComponents.length == 1) {
                    return newComponents[0];
                }
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
    });

})(jQuery);
