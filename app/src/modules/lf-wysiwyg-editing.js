import * as $ from 'jquery';

import { setupEditor } from "../../../../../symbiote/silverstripe-prose-editor/editor/src/setup.js";
import ContentSource from '../lib/FormContentSource.js';
import { renderProseShortcode } from '../../../../../symbiote/silverstripe-prose-editor/editor/src/plugins/shortcodes.js';
import { Constants } from '../constants.js';

import "../../../../../symbiote/silverstripe-prose-editor/editor/style/index.scss";

import "./lf-wysiwyg-editing.scss";
import { trigger_on_click_outside } from '../lib/element-focus.js';


function replaceShortcodesIn(elem) {
    $(elem).find('.prose-shortcode').each(function () {
        let $shortcodeHolder = $(this);
        if ($shortcodeHolder.attr('data-rendered-shortcode')) {
            return;
        }
        $shortcodeHolder.attr('data-rendered-shortcode', 1);
        let rawShortcode = $shortcodeHolder.attr('data-shortcode');
        if (!rawShortcode) {
            return;
        }
        let shortcodeData = JSON.parse(rawShortcode);
        if (shortcodeData && shortcodeData.type) {
            let originalContent = $shortcodeHolder.html();
            $shortcodeHolder.html("Loading data...");
            renderProseShortcode(shortcodeData.type, shortcodeData.args).text(function (data) {
                $shortcodeHolder.html(data);
            }).catch(function (err) {
                $shortcodeHolder.html(originalContent);
            })
        }
    });
}

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    // initial render
    setTimeout(function () {
        // TODO
        replaceShortcodesIn($('#livingdocs-container'));
    }, 500);

    // subsequent content changes
    livingdoc.model.changed.add(function () {
        // TODO
        replaceShortcodesIn($('#livingdocs-container'));
    });

    livingdoc.interactiveView.page.componentWasDropped.add(function (component) {
        let componentView = livingdoc.componentTree.getMainComponentView(component.id);
        // clean up any things attached to the component
        if (componentView && componentView.$html) {
            componentView.$html.find('[data-is-editing]').removeAttr('data-is-editing');
        }
    });

    livingdoc.interactiveView.page.wysiwygClick.add(function (component, directiveName, event) {
        let $elem = component.directives.$getElem(directiveName);

        if (!$elem) {
            return;
        }

        var isEditing = $elem.attr('data-is-editing');
        $elem.addClass('js-wysiwyg-editor-block');
        if (isEditing) {
            return;
        }

        $elem.attr('data-is-editing', 1);

        var currentContent = component.model.get(directiveName);

        // var rawContent = component.model.getData(directiveName + '-raw');

        let config = ContentSource.getConfig();

        let proseNode = $('<div class="ProseWrapper">');
        proseNode.attr('data-prose-url', '__prose');
        proseNode.attr('data-context-id', config.pageId);
        proseNode.attr('data-upload-path', config.pageLink);
        proseNode.attr('data-prose-config', JSON.stringify({
            "floatingMenu": true,
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
        var $save = $('<button class="Button Button--Primary">OK</button>');
        var $cancel = $('<button class="Button">Cancel</button>');
        $save.css('display', 'inline'); $cancel.css('display', 'inline');
        $actions.append($save).append($cancel);

        $elem.empty();
        $elem.append(proseNode).append($actions);

        const thisEditor = setupEditor(editorNode[0], valueNode[0], storageNode[0]);

        setTimeout(function () {
            if ($(Constants.EDITOR_FRAME).contents().find('#ProseMirror-icon-collection').length == 0) {
                $(Constants.EDITOR_FRAME).contents().find('body').prepend($('#ProseMirror-icon-collection'));
            }

            let icons = $(Constants.EDITOR_FRAME).contents().find('div.ProseMirror-icon svg use').each(function () {
                let href = $(this).attr('href');
                href = href.replace(location.href, '');
                $(this).attr('href', href);
            });
        }, 100);


        var cleanUp = function () {
            thisEditor.destroy();
            $elem.removeAttr('data-is-editing');
            $elem.removeClass('js-wysiwyg-editor-block');
        }

        $cancel.click(function () {
            cleanUp();
            $elem.empty();
            proseNode.remove();
            $elem.html(component.model.get(directiveName));
            replaceShortcodesIn($elem);
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

            if (!component.model.setContent(directiveName, rawContent)) {
                // we need to force this as the content set by rawContent may not
                // be different and trigger the HTML update
                if (component.model.componentTree) {
                    component.model.componentTree.contentChanging(component.model, directiveName);
                }

                replaceShortcodesIn($elem);
            }
        }

        $save.click(function () {
            saveEditorBlock();
            cleanUp();
        });

        trigger_on_click_outside($elem[0], function (element, target) {
            console.log(target);
            saveEditorBlock();
            cleanUp();
        })
    });
});
