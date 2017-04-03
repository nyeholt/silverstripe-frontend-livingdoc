;(function ($) {
    var mediaUrl = 'FrontendInsertDialog/MediaForm';
    
    var windowPrefs = "height=600,width=750,menubar=no,location=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no";
    
    window.EditSink = {
        currentTarget: '',
        currentLink: '',
        setLinkObject: function (obj) {
            alert("Setting");
            console.log(obj);
            this.currentLink = obj;
        },
        setContent: function (content) {
            alert("Set content to " + content);
        }
    };
    
    $(document).on('click', '.media-insert', function (e) {
        var mediaDialog = window.open(mediaUrl, "frontend-dialog", windowPrefs);
        EditSink.currentTarget = $(this);
        EditSink.setLinkObject(null);
    });
})(jQuery);