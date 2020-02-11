
import * as jQuery from 'jquery';

import './livingdocs/editable';
import './livingdocs/livingdocs-engine';

import LivingDocState from './lib/LivingDocState';
import ContentSource from './lib/FormContentSource';
import { initialise_property_editor } from './lib/ld-property-editor';
import createComponentList from './lib/createComponentList';
import { initialise_keyboard } from './modules/lf-keyboard-handler';
import { initialise_messages } from './modules/lf-messages';

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
    }, PING_TIME * 1000);


    var TOOLBAR_FORM = '#Form_LivingForm';
    var BOTTOM_BAR = '.livingdocs-bottom-bar';

    var TABLE_ROW_COMPONENT = 'tablerow';

    let toolbarToggle = $('<button>').text("Show toolbar");
    $(BOTTOM_BAR).find('.livingdocs-toolbar-controls').append(toolbarToggle);
    toolbarToggle.click(function (e) {
        $('body').toggleClass('show-livingdocs-toolbar');
    });

    const gridToggle = $('<button>Toggle Grid</button>');
    $(BOTTOM_BAR).find('.livingdocs-toolbar-controls').append(gridToggle);
    gridToggle.click(function (e) {
        $('body').toggleClass('no-grid-display');
    });

    initialise_messages();

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
    $(document).on('click', 'form' + TOOLBAR_FORM + ' > .Actions .action', function (e) {
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

            const layoutToggle = $('<button>Toggle Layout editing</button>');
            $(BOTTOM_BAR).find('.livingdocs-toolbar-controls').append(layoutToggle);
            layoutToggle.click(function (e) {
                var state = $(this).attr('data-layout-editing');
                if (state == 1) {
                    $(this).attr('data-layout-editing', 0);
                } else {
                    $(this).attr('data-layout-editing', 1);
                }
            });

            LivingDocState.livingdoc.interactiveView.page.componentWillBeDragged.add(function (option) {
                if (layoutToggle.attr('data-layout-editing') == 1) {
                    option.enable = false;
                } else {
                    option.enable = true;
                }
            })

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
                $group.append('<div class="group-component-holder" id="gch-' + num + '"></div>');

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
                var $entryLabel = $('<div class="toolbar-entry-title" data-name="'+name+'">');

                $entry.html(icon ? icon : defaultIcon);
                $entryLabel.html(label);

                $entryWrap.append($entry).append($entryLabel);

                var groupId = componentGroupMap[name];
                if (!groupId) {
                    groupId = 'gch-misc';
                }

                var $holder = $('#' + groupId);
                $holder.append($entryWrap);

                draggableComponent(doc, name, $entry);
            }

            // Adds in all the components in their appropriate grouping
            // this used to use LivingDoc.activeDesign, but that misses the icons
            for (var i = 0; i < selectedDesign.components.length; i++) {
                var template = selectedDesign.components[i];
                addMenuComponent(template.icon, template.label, template.name);
            }

            for (var compoundName in selectedDesign.compounds) {
                addMenuComponent(selectedDesign.compounds[compoundName].icon, selectedDesign.compounds[compoundName].label, compoundName);
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
            initialise_keyboard(LivingDocState);

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
                buttonEl.on('mousedown', function (theButton) { return function (e) { e.preventDefault(); theButton.click(); } }(b));

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

            outer_el.css({ position: "absolute", left: loc.left, top: loc.top - 40, background: "transparent", "z-index": 4000 });
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
