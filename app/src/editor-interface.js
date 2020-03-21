import LivingDocState from "./lib/LivingDocState";
import createComponentList from './lib/createComponentList';

const TOOLBAR_FORM = '#Form_LivingForm';
const BOTTOM_BAR = '.livingdocs-bottom-bar';



export const init_interface = function (doc, selectedDesign) {

    init_toolbar_toggles();
    init_toolbar_form();

    init_component_list(doc, selectedDesign);


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
};

function init_component_list(doc, selectedDesign) {
    const defaultIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.21 4.16l4 4v-4zm4 12l-4 4h4zm-12 4l-4-4v4zm-4-12l4-4h-4zm12.95-.95c-2.73-2.73-7.17-2.73-9.9 0s-2.73 7.17 0 9.9 7.17 2.73 9.9 0 2.73-7.16 0-9.9zm-1.1 8.8c-2.13 2.13-5.57 2.13-7.7 0s-2.13-5.57 0-7.7 5.57-2.13 7.7 0 2.13 5.57 0 7.7z" fill="#010101"/><path fill="none" d="M.21.16h24v24h-24z"/></svg>';

    var $components = $('#livingdocs-components');
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
        var $entryLabel = $('<div class="toolbar-entry-title" data-name="' + name + '">');

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

    if (selectedDesign.compounds) {
        for (var compoundName in selectedDesign.compounds) {
            addMenuComponent(selectedDesign.compounds[compoundName].icon, selectedDesign.compounds[compoundName].label, compoundName);
        }
    }


    // Binds the drag behaviour when a menu item is dragged
    function draggableComponent(doc, name, $elem) {
        $elem.on('mousedown', function (event) {
            let newComponent;
            if (selectedDesign.compounds && selectedDesign.compounds[name]) {
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
}

function init_toolbar_toggles() {
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
}


function init_toolbar_form() {
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
}
