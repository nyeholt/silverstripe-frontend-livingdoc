import * as $ from 'jquery';
import LivingDocState from '../lib/LivingDocState';

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    var $pageOptions = $('#livingdocs-page-options');

    var $history = $('<div class="livingdocs-page-history">');

    var $toggle = $('<h3>History</h3>');

    $history.append($toggle);

    var $historyList = $('<div class="livingdocs-history-list" >');

    $history.append($historyList);

    $pageOptions.append($history);

    // $history.click(function (e) {
    //     e.preventDefault();
    //     $historyList.toggle();
    //     return false;
    // });

    var drawHistory = function () {
        $historyList.empty();
        for (var i = 0; i < LivingDocState.changeStack.length; i++) {
            var $entry = $('<div class="livingdocs-history-entry">');
            var str = LivingDocState.changeStack[i].time.toLocaleTimeString();
            $entry.append(str + " - ");
            var $restore = $('<a href="#" data-index="' + i + '">Restore</a>');

            $restore.click(function (e) {
                e.preventDefault();
                LivingDocState.loadState($(this).attr('data-index'));
                return false;
            })
            $entry.append($restore);
            $historyList.prepend($entry);
        }
    };

    LivingDocState.livingdoc.model.changed.add(function () {
        drawHistory();
    });
});
