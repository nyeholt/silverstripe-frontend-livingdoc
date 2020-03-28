
import * as $ from 'jquery';
import { linkSelectorDialog } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/plugins/ss-link-selector';

export function selectLink(selection, callback) {
    const linkAttrs = {
        href: '',
        title: '',
        target: '',
        text: 'text',
    };

    if (selection.range && selection.range.startContainer) {
        var $sc = $(selection.range.startContainer);
        linkAttrs.href = $sc.attr('href');
        linkAttrs.title = $sc.attr('title');
        linkAttrs.target = $sc.attr('target');
        linkAttrs.text = $sc.text();
    }

    linkSelectorDialog(linkAttrs, {internal: true}, function (attrs) {
        callback(attrs);
    })

}

$(document).on('livingfrontend.updateContentButtonBar', function (e, bar, selection) {

    var addLink = {
        label: 'Link',
        click: function () {
            selection.save();
            // prevents range saving from being cleared on focus lost. @see editable.js pastingAttribute
            selection.host.setAttribute('data-editable-is-pasting', true);
            selectLink(selection, function (linkObj) {
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
