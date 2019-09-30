
import * as $ from 'jquery';

$(document).on('livingfrontend.updateContentButtonBar', function (e, bar, selection, ContentBridge) {

    var selectLink = function (callback) {
        ContentBridge.setCallback(callback);
        ContentBridge.showDialog('link');
    };

    var addLink = {
        label: 'Link',
        click: function () {
            selection.save();
            // prevents range saving from being cleared on focus lost. @see editable.js pastingAttribute
            selection.host.setAttribute('data-editable-is-pasting', true);
            selectLink(function (linkObj) {
                selection.restore();
                selection.setVisibleSelection();
                selection.link(linkObj.href, { target: linkObj.target, title: linkObj.title })
                selection.host.setAttribute('data-editable-is-pasting', false);
                selection.triggerChange();
            });
        }
    };

    var addAnchor = {
        label: 'Anchor',
        title: 'Insert Named Anchor',
        click: function () {
            var anchorName = prompt("Anchor name");
            var s = selection.createElement('a');
            $(s).attr('name', anchorName);
            selection.toggle(s);
            selection.triggerChange();
        }
    };

    bar.unshift(addAnchor);
    bar.unshift(addLink);

});
