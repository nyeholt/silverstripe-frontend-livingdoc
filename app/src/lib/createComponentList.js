import LivingDocState from "./LivingDocState";

/**
 * creates components, inside a given parent.
 *
 * @param array components
 * @param ComponentModel parent
 * @param string containerName
 * @returns void
 */
export default function createComponentList(components, parent, containerName, forceAdd = false) {
    console.log(arguments);
    if (!parent) {
        parent = LivingDocState.livingdoc.componentTree.root;
    }
    var newComponents = LivingDocState.livingdoc.componentTree.componentsFromList(components, LivingDocState.activeDesign);

    if (parent) {
        if (!containerName && newComponents.length == 1 && !forceAdd) {
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
};
