import LivingDocState from "./lib/LivingDocState";
import createComponentList from './lib/createComponentList';
import { Constants } from "./constants";
import ContentSource from './lib/FormContentSource';
import { ComponentTree } from "./modules/lf-component-tree";

const TOOLBAR = '.livingdocs-toolbar';
const TOOLBAR_FORM = '#Form_LivingForm';
const BOTTOM_BAR = '.livingdocs-bottom-bar';
const PAGE_OPTIONS = '#livingdocs-page-options';
const COOKIE_NAME = 'editor_settings';


export const init_interface = function (doc, selectedDesign) {

    init_toolbar_tabs();

    init_tree();

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

function init_toolbar_tabs() {
    $(document).on('click', '.ld-tab', function (e) {
        e.preventDefault();
        select_tab($(this).attr('href'));
        return false;
    })
}

function init_component_list(doc, selectedDesign) {
    const defaultIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.21 4.16l4 4v-4zm4 12l-4 4h4zm-12 4l-4-4v4zm-4-12l4-4h-4zm12.95-.95c-2.73-2.73-7.17-2.73-9.9 0s-2.73 7.17 0 9.9 7.17 2.73 9.9 0 2.73-7.16 0-9.9zm-1.1 8.8c-2.13 2.13-5.57 2.13-7.7 0s-2.13-5.57 0-7.7 5.57-2.13 7.7 0 2.13 5.57 0 7.7z" fill="#010101"/><path fill="none" d="M.21.16h24v24h-24z"/></svg>';

    var $components = $('#livingdocs-components');
    var $componentsList = $components.find('div.component-list');

    var componentGroupMap = {};

    var addGroup = function (label, num) {
        var $group = $('<div>');
        let componentSetId = "gch-" + num;
        $group.append('<h2 class="component-set-label" data-target="' + componentSetId + '">' + label + '</h2>');
        $group.append('<div class="group-component-holder" id="' + componentSetId + '"></div>');

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

            event.editorFrame = $(Constants.EDITOR_FRAME)[0];

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

    $(document).on('click', ".component-set-label", function (e) {
        toggle_component_group($(this).attr('data-target'));
    })

    display_component_groups();
}

function init_tree() {
    let tree = new ComponentTree(LivingDocState.livingdoc);

    let label = $('<h2 class="component-set-label" data-target="ld-component-tree">Page items</h2>')
    let treeHolder = $('<div class="ld-component-tree" id="ld-component-tree">');
    $('#livingdocs-page-options').prepend(treeHolder).prepend(label);
    tree.render(treeHolder[0]);

    $(document).on('click', '#ld-options-tab', function () {
        treeHolder.empty();
        tree.render(treeHolder[0]);
    });
}

function init_toolbar_toggles() {

    // let toolbarToggle = $('<button>').text("Toggle toolbar");
    // $(BOTTOM_BAR).find('.livingdocs-toolbar-controls').append(toolbarToggle);
    // toolbarToggle.click(function (e) {
    //     $('body').toggleClass('show-livingdocs-toolbar');
    // });
    const gridToggle = $('<input type="checkbox">');
    const enableGrid = $('<label class="ld-toggle">').append(gridToggle).append('Enable grid');

    var evalGrid = function () {
        if (gridToggle.is(':checked')) {
            $(Constants.EDITOR_FRAME).contents().find('body').removeClass('no-grid-display');
        } else {
            $(Constants.EDITOR_FRAME).contents().find('body').addClass('no-grid-display');
        }
    }

    const toggleHolder = $('<div class="ld-options-toggles">');


    $(toggleHolder).append(enableGrid);
    gridToggle.click(function (e) {
        evalGrid();
    });

    if (ContentSource.getConfig().showGrid) {
        gridToggle.click();
    } else {
        evalGrid();
    }


    const layoutToggle = $('<input type="checkbox">');
    const enableLayout = $('<label class="ld-toggle">').append(layoutToggle).append('Enable layout editing');
    $(toggleHolder).append(enableLayout);

    $(PAGE_OPTIONS).append(toggleHolder);

    if (ContentSource.getConfig().allowLayoutEditing) {
        layoutToggle.click();
    }

    LivingDocState.livingdoc.interactiveView.page.componentWillBeDragged.add(function (option) {
        if (layoutToggle.is(':checked')) {
            option.enable = true;
        } else {
            option.enable = false;
        }
    });

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


export function toggle_component_group(id) {
    const settings = load_settings();
    const groupState = settings['groups'] || {};

    let displayState = groupState[id];

    if (displayState == undefined) {
        // figure out initial state
        displayState = $('#' + id).is(':visible');
    }

    if (displayState) {
        groupState[id] = false;
    } else {
        groupState[id] = true;
    }

    settings['groups'] = groupState;

    save_setings(settings);

    display_component_groups();
}

function display_component_groups() {
    const settings = load_settings();
    const groupState = settings['groups'] || {};

    for (let groupId in groupState) {
        if (groupState[groupId]) {
            $('#' + groupId).show();
        } else {
            $('#' + groupId).hide();
        }
    }
}

window.toggleCg = toggle_component_group;

export function select_tab(name) {
    if (name == 'default') {
        name = '#livingdocs-components';
    }
    if (name[0] != '#') {
        name = '#' + name;
    }

    $('.ld-tab-panel').hide();
    $('.ld-tab').removeClass('active');

    $('.ld-tab[href="' + name + '"]').addClass('active');

    $(TOOLBAR).scrollTop(0, 0);

    $(name).show();
}

function load_settings() {
    let existing = localStorage.getItem(COOKIE_NAME);
    if (!existing) {
        existing = "{}";
    }
    return JSON.parse(existing);
}

function save_setings(settings) {
    if (!settings) {
        return;
    }

    localStorage.setItem(COOKIE_NAME, JSON.stringify(settings));
}
