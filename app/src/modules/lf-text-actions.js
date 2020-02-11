import * as $ from 'jquery';
import LivingDocState from '../lib/LivingDocState';

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    // text formatting options
    // @TODO - provide more in-paragraph options
    //  - sup/sub
    //  - strike
    //  - text-alignment (an option maybe?) 
    livingdoc.interactiveView.page.editableController.selection.add(function (view, editableName, selection) {
        if (selection && selection.isSelection) {
            var rect = selection.getCoordinates();

            var barOptions = [
                {
                    label: '<strong>B</strong>',
                    title: 'Bold',
                    click: function () {
                        selection.toggleBold()
                        selection.triggerChange()
                    }
                },
                {
                    label: '<em>I</em>',
                    title: 'Italics',
                    click: function () {
                        selection.toggleEmphasis()
                        selection.triggerChange();
                    }
                },
                {
                    label: '<sub>s</sub>',
                    title: 'Subscript',
                    click: function () {
                        var s = selection.createElement('sub');
                        selection.toggle(s);
                        selection.triggerChange();
                    }
                },
                {
                    label: '<sup>s</sup>',
                    title: 'Superscript',
                    click: function () {
                        var s = selection.createElement('sup');
                        selection.toggle(s);
                        selection.triggerChange();
                    }
                },
                {
                    label: 'Clear',
                    click: function () {
                        selection.removeFormatting();
                    }
                }
            ];

            $(document).trigger('livingfrontend.updateContentButtonBar', [barOptions, selection]);
            LivingDocState.showButtonBar(barOptions, rect);
        }
    });
});