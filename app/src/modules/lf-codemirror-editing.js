import * as $ from 'jquery';

import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/markdown/markdown';

import * as showdown from 'showdown';
import hljs from 'highlight.js';

import 'highlight.js/styles/github.css';


$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    // HTML directive handling
    livingdoc.interactiveView.page.htmlElementClick.add(function (component, directiveName, event) {
        
        var isEditing = component.$html.find('.cm-editor').length > 0;
        component.$html.addClass('js-editor-block');
        if (isEditing) {
            return;
        }

        var currentContent = component.model.getData(directiveName + '-raw');

        var $edBlock = $('<textarea class="cm-editor">').css({
            'width': '100%',
            'position': 'absolute',
            'top': 0,
            'right': 0,
            'bottom': '20px',
            'left': 0,
        });

        var $actions = $('<div>');
        var $save = $('<button>OK</button>');
        $actions.css({ position: 'absolute', 'bottom': 0 }).append($save);

        $edBlock.val(currentContent);
        const initialContent = component.$html.html();

        component.$html.html($edBlock);
        component.$html.append($actions);

        $edBlock.focus();

        const cm = CodeMirror.fromTextArea($edBlock[0], {
            lineNumbers: true,
            mode: "htmlmixed"
        });

        var cleanUp = function () {
            cm.toTextArea();
            $edBlock.remove();
            $actions.remove();
            component.$html.removeClass('js-editor-block');
        }

        var saveEditorBlock = function () {
            cm.toTextArea();
            var newContent = $edBlock.val();
            // if (aceeditor) {
            //     newContent = aceeditor.getValue();
            // }

            // insert some markers for real &gt; and &lt;
            newContent = newContent.replace(/&gt;/g, '__RAW_GT_TAG').replace(/&lt;/g, '__RAW_LT_TAG');

            var catcher = $('<div>');
            catcher.append(newContent);
            catcher.find('script').remove().find('textarea').remove();

            var rawContent = catcher.html();
            rawContent = rawContent.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/__RAW_GT_TAG/g, '&gt;').replace(/__RAW_LT_TAG/g, '&lt;');

            component.model.setData(directiveName + '-raw', rawContent);

            if (component.$html.hasClass('js-living-markdown')) {
                // parse it first
                var converter = new showdown.Converter();
                rawContent = converter.makeHtml(rawContent);
            }

            // highlight code blocks
            catcher.html(rawContent);
            catcher.find('pre > code').each(function (i, block) {
                hljs.highlightBlock(block);
            })

            rawContent = catcher.html();

            if (!component.model.setContent(directiveName, rawContent)) {
                // we need to force this as the content set by rawContent may not
                // be different and trigger the HTML update
                if (component.model.componentTree) {
                    component.model.componentTree.contentChanging(component.model, directiveName);
                }
            }

            cleanUp();
        }

        cm.on('blur', saveEditorBlock);
        $save.click(saveEditorBlock)
    });

});
