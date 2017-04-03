;(function ($) {
    var mediUrl = 'FrontendInsertDialog/MediaForm';
    
    
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
            alert("Replace with " + HTML)
        },
        repaint: function() {
            console.log("editorProxy.repaint");
        },
        insertContent: function(content) {
            alert("Insert " + content);
            console.log("editorProxy.insertContent");
        },
        addUndo: function() {
            console.log("editorProxy.addUndo");
        },
        insertLink: function(link) {
            alert("Insert link");
            console.log(link);
            console.log("editorProxy.insertLink");
        }
    }
    
    $.entwine("ss", function($) {

        $("form.htmleditorfield-form").entwine({
            close: function() {
                alert('close');
//                    this.getDialog().close();
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
                alert('removeLink');
                e.preventDefault();
                this.parents("form:first").removeLink();
            }
        });

        $(".htmleditorfield-dialog").entwine({
            onadd: function() {
                alert('dialog open');
                this.trigger("ssdialogopen");
                this.getForm().setElement(element);
                this._super();
            },
            getEditor: function() {
                alert('geteditor -editorfield-dialog');
                return editorProxy;
            },
            close: function() {
                alert('close -editorfield-dialog');
//                    this.getEditor().closeDialog();
            }
        });
    });

    
    
})(jQuery);