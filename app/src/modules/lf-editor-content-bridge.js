import * as $ from 'jquery';

    var MEDIA_URL = 'FrontendInsertDialog/MediaForm';
    var IMAGE_URL = 'FrontendInsertDialog/ImageForm';
    var LINK_URL  = 'FrontendInsertDialog/LinkForm';

const ContentBridge = {
    callback: null,
    focusedComponent: null,
    currentLink: '',
    currentContent: '',
    dialogFrame: null,
    closer: null,
    linkDialogFrame: null,
    mediaDialogFrame: null,

    dialogDiv: null,
    
    livingdoc: null,
    
    setLivingDoc: function (doc) {
        this.livingdoc = doc;
    },
    
    getLivingDoc: function () {
        return this.livingdoc;
    },

    setCallback: function (callback) {
        this.callback = callback;
        this.currentLink = null;
        this.currentContent = '';
    },

    setLinkObject: function (obj) {
        this.currentLink = obj;
        this.callback.call(this, obj);
    },
    setContent: function (content) {
        this.callback(content);
    },
    init: function () {
        this.linkDialogFrame = this.createFrame();
        this.mediaDialogFrame = this.createFrame();

        this.closer = $('<a href="#" class="dialog-close">X</a>');
        this.closer.click(function (e) {
            e.preventDefault();
            ContentBridge.closeDialog();
            return false;
        });

        $('body').append(this.closer);

        this.linkDialogFrame.attr({'src': LINK_URL});
        this.mediaDialogFrame.attr({'src': MEDIA_URL});
    },
    createFrame: function () {
        var frame = $('<iframe src="about:">');
        frame.attr({
            'class': "living-dialog"
        });

        $('body').append(frame);
        return frame;
    },
    showDialog: function (type) {
        // we may show a different dialog for images in future
        switch (type) {
            case 'media': {
                this.mediaDialogFrame.show();
                break;
            }
            case 'image': {
                this.mediaDialogFrame.show();
                break;
            }
            case 'link': {
                this.linkDialogFrame.show();
                break;
            }
        }
        if (type == 'media') {

        } else {

        }
        this.closer.show();
    },
    showTestDialog: function (link) {
        var _this = this;
        _this.dialogDiv.html('<input type="button" value="clickit" id="clicker" />');
        _this.dialogDiv.show();
        return;
        $.get(link).done(function (html) {
            _this.dialogDiv.html(html);
            _this.dialogDiv.show();
        });
    },
    closeDialog: function () {
        this.mediaDialogFrame.hide();
        this.linkDialogFrame.hide();
        this.closer.hide();

        this.linkDialogFrame.attr({'src': 'about:'});
        this.mediaDialogFrame.attr({'src': 'about:'});

        this.linkDialogFrame.attr({'src': LINK_URL});
        this.mediaDialogFrame.attr({'src': MEDIA_URL});
    }
};

export default ContentBridge;