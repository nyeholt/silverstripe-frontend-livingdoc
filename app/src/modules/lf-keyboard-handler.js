import { exportComponent } from "./lf-component-export";
import createComponentList from "../lib/createComponentList";


const PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

/**
 *
 * @param {LivingDocState} state
 */
export function initialise_keyboard(state) {
    document.addEventListener("keydown", function (e) {
        // we need ctrl for delete too
        if (!e.ctrlKey) {
            return;
        }
        if (e.keyCode == 46) {
            if (state.activeComponent) {
                // check that the component is a container
                if (confirm("Remove this " + state.activeComponent.model.componentName)) {
                    state.activeComponent.model.remove();
                    $("." + PROPS_HOLDER).remove();
                }
            }
        }

        if (e.keyCode == 67) {
            const content = exportComponent(state.activeComponent);
            copyTextToClipboard(JSON.stringify(content).replace(/"id":"doc-(.*?)",/g, ""));
        }
    });


    document.addEventListener('paste', function (e) {
        let clipboardData = e.clipboardData || window.clipboardData;
        let content = clipboardData.getData('Text');

        if (content && content.length > 0) {
            try {
                const newComponent = JSON.parse(content);
                if (newComponent && newComponent.identifier) {
                    console.log("Creating component", newComponent, state.activeComponent);
                    // we use the first available container on the target component
                    let targetContainer = null;

                    if (state.activeComponent.directives.container && state.activeComponent.directives.container.length > 0) {
                        const targetContainerName = state.activeComponent.directives.container[0].name;
                        const targetContainer = state.activeComponent.model.containers[targetContainerName];
                        createComponentList([newComponent], targetContainer, null, true);
                    } else {
                        alert("Can't paste components here, choose a container first");
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    })

}





export function copyTextToClipboard(text) {
    const textArea = getTempField();
    textArea.value = text;
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}



function getTempField() {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a
    // flash, so some of these are just precautions. However in
    // Internet Explorer the element is visible whilst the popup
    // box asking the user for permission for the web page to
    // copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    document.body.appendChild(textArea);

    return textArea;
}
