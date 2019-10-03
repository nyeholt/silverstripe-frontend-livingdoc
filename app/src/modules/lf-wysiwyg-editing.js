import * as $ from 'jquery';

import { setupEditor } from "../../../../vendor/symbiote/silverstripe-prose-editor/editor/src/setup.js";
import "../../../../vendor/symbiote/silverstripe-prose-editor/editor/dist/main.css" ;
import ContentSource from '../lib/FormContentSource.js';

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {

    livingdoc.interactiveView.page.wysiwygClick.add(function (component, directiveName, event) {

        var isEditing = component.$html.attr('data-is-editing');
        component.$html.addClass('js-wysiwyg-editor-block');
        if (isEditing) {
            return;
        }

        component.$html.attr('data-is-editing', 1);

        var currentContent = component.model.get(directiveName);

        // var rawContent = component.model.getData(directiveName + '-raw');

        let config = ContentSource.getConfig();

        let proseNode = $('<div class="ProseWrapper">');
        proseNode.attr('data-prose-url', '__prose');
        proseNode.attr('data-context-id', config.pageId);
        proseNode.attr('data-upload-path', config.pageLink);
        proseNode.attr('data-prose-config', JSON.stringify({
            "menu": {
              "insertlink": true,
              "insertimage": true,
              "bulletlist": true,
              "orderedlist": true,
              "quote": true,
              "paragraph": true,
              "pre": true,
              "hr": true,
              "table": true,
              "shortcode": true,
              "viewsource": true
            },
            "linkSelector": {
              "internal": true
            }
          }));

        var editorNode = $('<div class="ProseEditorFieldEditor" data-prose-config="">');
        var valueNode = $('<div class="ProseEditorFieldValue" style="display: none">');
        var storageNode = $('<input type="hidden" name="ThisProseEditor" class="ProseEditorFieldStorage" value="" />');

        proseNode.append(editorNode).append(valueNode).append(storageNode);
        
        storageNode.val(currentContent);
        valueNode.html(currentContent);

        var $actions = $('<div>');
        var $save = $('<button>OK</button>');
        var $cancel = $('<button>Cancel</button>');
        $save.css('display', 'inline'); $cancel.css('display', 'inline');
        $actions.append($save).append($cancel);

        component.$html.empty();
        component.$html.append(proseNode).append($actions);

        const thisEditor = setupEditor(editorNode[0], valueNode[0], storageNode[0]);

        // $edBlock.focus();

        var cleanUp = function () {
            thisEditor.destroy();
            component.$html.removeAttr('data-is-editing');
            component.$html.removeClass('js-wysiwyg-editor-block');
        }

        $cancel.click(function () {
            component.$html.html(component.model.get(directiveName));
            cleanUp();
        });

        var saveEditorBlock = function () {
            var newContent = storageNode.val();

            // insert some markers for real &gt; and &lt;
            newContent = newContent.replace(/&gt;/g, '__RAW_GT_TAG').replace(/&lt;/g, '__RAW_LT_TAG');

            var catcher = $('<div>');
            catcher.append(newContent);
            catcher.find('script').remove().find('textarea').remove();

            var rawContent = catcher.html();
            rawContent = rawContent.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/__RAW_GT_TAG/g, '&gt;').replace(/__RAW_LT_TAG/g, '&lt;');

            // highlight code blocks
            catcher.html(rawContent);
            catcher.find('pre > code').each(function (i, block) {
                hljs.highlightBlock(block);
            });

            rawContent = catcher.html();

            // component.model.setData(directiveName + '-raw', rawContent);

            // let displayDom = editorNode.find('div.ProseMirror').first();
            // displayDom.find('svg').remove
            

            if (!component.model.setContent(directiveName, rawContent)) {
                // we need to force this as the content set by rawContent may not
                // be different and trigger the HTML update
                if (component.model.componentTree) {
                    component.model.componentTree.contentChanging(component.model, directiveName);
                }
            }
        }

        $save.click(function () {
            saveEditorBlock();
            cleanUp();
        });
    });

});
