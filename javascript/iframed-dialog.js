;(function ($) {
    
    var windowParent = window.parent;
    
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
        },
        repaint: function() {
            console.log("editorProxy.repaint");
        },
        insertContent: function(content) {
            if (windowParent && windowParent.ContentWrapper) {
                windowParent.ContentWrapper.setContent(content);
            }
            return false;
        },
        addUndo: function() {
            console.log("editorProxy.addUndo");
        },
        insertLink: function(link) {
            if (windowParent && windowParent.ContentWrapper) {
                windowParent.ContentWrapper.setLinkObject(link);
            }
        }
    }
    
    $.entwine("ss", function($) {

        $("form.htmleditorfield-form").entwine({
            close: function() {
                windowParent.ContentWrapper.closeDialog();
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
                this.trigger("ssdialogopen");
                this.getForm().setElement(element);
                this._super();
            },
            getEditor: function() {
                return editorProxy;
            },
            close: function() {
                windowParent.ContentWrapper.closeDialog();
            }
        });
    });

    
    
})(jQuery);