import LivingDocState from "../lib/LivingDocState";


var TABLE_ROW_COMPONENT = 'tablerow';
var TABLE_CELL_COMPONENT = 'tablecell';
var HEADER_CELL_COMPONENT = 'headercell';

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    livingdoc.interactiveView.page.focus.componentFocus.add(function (component) {
        if (component.model.componentName === 'table') {
            // add row and add column

            var tableNode = component.$html[0];
            if (tableNode) {
                LivingDocState.showButtonBar([
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
    });
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

            let contentType = cellType == HEADER_CELL_COMPONENT ? 'p' : 'wysiwyg';
            var newP = LivingDocState.livingdoc.componentTree.getComponent(contentType);
            newCell.append("cellitems", newP);
        }
    }
    return firstRow;
}