;(function ($) {
    
    var windowParent = window.parent;
//    var windowParent = window;

    // prevent deselection of the source page's highlight
    $(document).on('mousedown', function (e) {
//        e.preventDefault();
    })
    
    var element = {
        getEditor: function() {
            return editorProxy;
        }
    }
    
    /**
     * Represents a fake tinymce editor. 
     */
    var editorProxy = {
        onopen: function() {
            console.log("editorProxy.onopen");
        },
        getContent: function () {
            console.log('editorProxy.getContent');
            return '';
        },
        getSelectedNode: function() {
            console.log("editorProxy.getselectednode");
            return "<div>";
        },
        getSelection: function() {
            console.log("editorProxy.getSelection");
            return $("<div>");
        },
        createBookmark: function() {
            console.log("editorProxy.createBookmark");
            return null;
        },
        blur: function() {
            console.log("editorProxy.blur");
        },
        onclose: function() {
            console.log("editorProxy.onclose");
        },
        moveToBookmark: function() {
            console.log("editorProxy.moveToBookmark");
        },
        replaceContent: function(HTML) {
            console.log("editorProxy.replaceContent");
            if (windowParent && windowParent.ContentBridge) {
                windowParent.ContentBridge.setContent(HTML);
            }
            return false;
        },
        repaint: function() {
            console.log("editorProxy.repaint");
        },
        insertContent: function(content) {
            if (windowParent && windowParent.ContentBridge) {
                windowParent.ContentBridge.setContent(content);
            }
            return false;
        },
        addUndo: function() {
            console.log("editorProxy.addUndo");
        },
        insertLink: function(link) {
            if (windowParent && windowParent.ContentBridge) {
                windowParent.ContentBridge.setLinkObject(link);
            }
        }
    }
    
    $.entwine("ss", function($) {

        $("form.htmleditorfield-form").entwine({
            close: function() {
                windowParent.ContentBridge.closeDialog();
            },
            getEditor: function() {
                console.log('form.htmleditorfield-form getEditor');
                return editorProxy;
            }
        });
        $("form.htmleditorfield-form button").entwine({
            onadd: function() {
                this.button().addClass("ss-ui-button");
            }
        });
        $("form.htmleditorfield-linkform button[name=action_remove]").entwine({
            onclick: function(e) {
                e.preventDefault();
                this.parents("form:first").removeLink();
            }
        });

        $(".htmleditorfield-dialog").entwine({
            onadd: function() {
                this.getForm().setElement(element);
                this.trigger("ssdialogopen");
                this._super();
            },
            getEditor: function() {
                return editorProxy;
            },
            close: function() {
                windowParent.ContentBridge.closeDialog();
            }
        });
    });
    
})(jQuery);