import { exportComponent } from "./lf-component-export";
import createComponentList from "../lib/createComponentList";
import { showMessage } from "./lf-messages";

const PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';

/**
 *
 * @param {LivingDocState} state
 */
export function initialise_keyboard(state, editorDocument, rootDocument) {
    editorDocument.addEventListener("keydown", function (e) {
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
            // check that what we have selected is copyable
            const selection = editorDocument.getSelection();

            // we used to check for classes,
            // but this ignores having selected a text-based component, ie 'p' 
            // .classList && selection.anchorNode.classList.contains('doc-component')) {
            if (selection.anchorNode && selection.type.toLowerCase() === 'caret') {
                // if it's an input type, ignore

                const nodeType = selection.anchorNode.nodeName.toLowerCase();

                if (nodeType == 'input' || nodeType == 'textarea' || nodeType == 'select') {
                    console.log("Form input")
                } else {
                    const content = exportComponent(state.activeComponent);
                    copyTextToClipboard(JSON.stringify(content).replace(/"id":"doc-(.*?)",/g, ""));
                    showMessage("Copied " + state.activeComponent.model.componentName);
                }
            } else {
                console.log("Not copying text node");
            }
        }
    });

    editorDocument.addEventListener('paste', function (e) {
        let clipboardData = e.clipboardData || window.clipboardData;
        let content = clipboardData.getData('Text');

        if (content && content.length > 0 && content.indexOf('identifier') > 0) {
            try {
                const newComponent = JSON.parse(content);
                if (newComponent && newComponent.identifier) {
                    // we use the first available container on the target component
                    if (state.activeComponent && state.activeComponent.directives.container && state.activeComponent.directives.container.length > 0) {
                        const targetContainerName = state.activeComponent.directives.container[0].name;
                        const targetContainer = state.activeComponent.model.containers[targetContainerName];
                        createComponentList([newComponent], targetContainer, null, true);
                    } else {
                        if (state.activeComponent) {
                            alert("Cannot paste into this component");
                            e.preventDefault();
                        } else {
                            createComponentList([newComponent], null, null, true);
                        }
                    }
                }
            } catch (err) {
                console.log("Paste of non-component text detected - ", err);
            }
        }
    })
}

export function copyTextToClipboard(text, editorDocument) {
    if (!editorDocument) {
        editorDocument = document;
    }
    const textArea = getTempField();
    textArea.value = text;
    textArea.focus();
    textArea.select();

    try {
        var successful = editorDocument.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
        console.log('Unable to copy');
    }
    editorDocument.body.removeChild(textArea);
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
