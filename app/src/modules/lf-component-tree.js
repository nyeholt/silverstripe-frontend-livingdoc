
import InfiniteTree from 'infinite-tree';

import classNames from 'classnames';
import escapeHTML from 'escape-html';
import tag from 'html5-tag';

export class ComponentTree {

    livingdoc;

    activeComponentId;

    tree;

    nodeClickHandler;

    constructor(livingdoc, nodeClickHandler, ignoreLivingdocs) {
        this.livingdoc = livingdoc;
        this.nodeClickHandler = nodeClickHandler;

        if (!ignoreLivingdocs) {
            livingdoc.interactiveView.page.focus.componentFocus.add((componentView, page, directives, event) => {
                this.activeComponentId = componentView.model.id;
                if (this.tree) {
                    const node = this.tree.getNodeById(this.activeComponentId);
                    // → Node { id: 'fruit', ... }
                    if (node) {
                        node.fromFocus = true;
                        this.tree.selectNode(node);
                    }
                }
            });
            livingdoc.interactiveView.page.focus.componentBlur.add((componentView, page, directives, event) => {
                this.activeComponentId = 0;
            });
        }
    }

    buildNode(component) {
        let name = component.componentName;
        if (component.styles) {
            const allClasses = [];
            for (let styleName in component.styles) {
                allClasses.push(component.styles[styleName]);
            }

            name += allClasses.length > 0 ? " (" + allClasses.join(' ') + ")" : '';
        }

        let node = {
            id: component.id,
            name: name,
            children: [],
            icon: null,
            data: component.content
        }

        // build the child components based on the directives
        if (component.containers) {
            for (let name in component.containers) {
                let containerChildren = this.buildTree(component.containers[name]);
                // let fakeNode = {
                //     id: component.id + '#' + name,
                //     name: name,
                //     children: containerChildren,
                //     data: null
                // }
                // node.children.push(fakeNode);
                for (let i = 0; i < containerChildren.length; i++) {
                    node.children.push(containerChildren[i]);
                }

            }
        }

        return node;
    }

    buildTree(componentRoot) {
        let nodes = [];

        let thisNode = componentRoot.first;
        while (thisNode) {
            nodes.push(this.buildNode(thisNode));
            thisNode = thisNode.next;
        }
        return nodes;
    }

    render(parentNode) {
        let div = document.createElement('div');
        div.className = 'TreeField';
        let treeDiv = document.createElement('div');
        div.className = 'TreeField__Tree';

        div.appendChild(treeDiv);

        parentNode.appendChild(div);

        const childNodes = this.buildTree(this.livingdoc.componentTree.root);

        this.tree = new InfiniteTree({
            el: treeDiv,
            data: childNodes,
            autoOpen: true,
            loadNodes: function (parentNode, next) {
                console.log("load nodes");
            },
            rowRenderer: customRowRenderer,
        });

        const clickHandler = this.nodeClickHandler;
        this.tree.on('selectNode',  function (node) {
            if (!node || !node.id) {
                return;
            }
            if (clickHandler) {
                return clickHandler.call(this, node);
            }

            // console.log(arguments);
            let view = this.livingdoc.componentTree.getMainComponentView(node.id);

            const fakeEvent = {
                target: view.$elem[0],
                which: 0
            }

            if (view && !node.fromFocus) {
                this.livingdoc.interactiveView.page.handleClickedComponent(fakeEvent, view);
            }
        }.bind(this));

        if (this.activeComponentId) {
            const node = this.tree.getNodeById(this.activeComponentId);
            // → Node { id: 'fruit', ... }
            this.tree.selectNode(node);
        }

    }
}

const customRowRenderer = (node, treeOptions) => {
    const { id, name, loadOnDemand = false, children, state, icon } = node;
    const droppable = treeOptions.droppable;
    const { depth, open, path, total, selected = false, filtered } = state;
    const childrenLength = Object.keys(children).length;
    const more = node.hasChildren();

    if (filtered === false) {
        return '';
    }

    let togglerContent = '';
    if (!more && loadOnDemand) {
        togglerContent = '►';
    }
    if (more && open) {
        togglerContent = '▼';
    }
    if (more && !open) {
        togglerContent = '►';
    }
    const toggler = tag('a', {
        'style': 'min-width: 16px; display: inline-block',
        'class': (() => {
            if (!more && loadOnDemand) {
                return classNames(treeOptions.togglerClass, 'infinite-tree-closed');
            }
            if (more && open) {
                return classNames(treeOptions.togglerClass);
            }
            if (more && !open) {
                return classNames(treeOptions.togglerClass, 'infinite-tree-closed');
            }
        })()
    }, togglerContent);


    const iconTag = icon ? tag('img', {
        'src': icon,
        height: '16',
        style: 'margin-right: 0.5rem; max-width: 32px;'
    }) : '';


    const iconHolder = icon ? tag('span', {
        'style': 'width: 32px; display: inline-block;',
    }, iconTag) : '';

    const title = tag('span', {
        'class': classNames('infinite-tree-title')
    }, escapeHTML(name));
    const treeNode = tag('div', {
        'class': 'infinite-tree-node',
        'style': `margin-left: ${depth * 12}px`
    }, toggler + iconHolder + title);

    return tag('div', {
        'data-id': "" + id,
        'data-expanded': more && open,
        'data-depth': "" + depth,
        'data-path': path,
        'data-selected': selected,
        'data-children': childrenLength,
        'data-total': total,
        'class': classNames(
            'infinite-tree-item',
            { 'infinite-tree-selected': selected }
        ),
        'droppable': droppable
    }, treeNode);
};
