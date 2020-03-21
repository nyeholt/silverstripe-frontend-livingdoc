;(function ($) {
    $(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
        var $pageOptions = $('#livingdocs-page-options');


        var $history = $('<div class="livingdocs-page-history">');

        var $toggle = $('<a href="#">History</a>');

        $history.append($toggle);

        var $historyList = $('<div class="livingdocs-history-list" style="display: none">');

        $history.append($historyList);

        $pageOptions.append($history);

        $history.click(function (e) {
            e.preventDefault();
            $historyList.toggle();
            return false;
        });

        var drawHistory = function () {
            $historyList.empty();
            for (var i = 0; i < LivingFrontendHelper.changeStack.length; i++) {
                var $entry = $('<div class="livingdocs-history-entry">');
                var str = LivingFrontendHelper.changeStack[i].time.toLocaleTimeString();
                $entry.append(str + " - ");
                var $restore = $('<a href="#" data-index="' + i +'">Restore</a>');

                $restore.click (function (e) {
                    e.preventDefault();
                    LivingFrontendHelper.loadState($(this).attr('data-index'));
                    return false;
                })
                $entry.append($restore);
                $historyList.prepend($entry);
            }
        };

        livingdoc.model.changed.add(function () {
            drawHistory();
        });
    });
})(jQuery);
