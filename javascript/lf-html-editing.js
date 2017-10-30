;(function ($) {
    
    $(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
        // HTML directive handling
        livingdoc.interactiveView.page.htmlElementClick.add(function (component, directiveName, event) {

            var isEditing = component.$html.attr('data-is-editing');
            component.$html.addClass('js-editor-block');
            if (isEditing) {
                return;
            }

            component.$html.attr('data-is-editing', 1);

            var currentContent = component.model.getData(directiveName + '-raw');

            var $edBlock = $('<div>').css({
                'width': '100%',
                'position': 'absolute',
                'top': 0,
                'right': 0,
                'bottom': '20px',
                'left': 0,
            });
            var aceeditor = null;

            var $actions = $('<div>');
            var $save = $('<button>OK</button>');
            var $cancel = $('<button>Cancel</button>');
            $actions.css({position: 'absolute', 'bottom': 0}).append($save).append($cancel);

            $edBlock.text(currentContent);
            component.$html.html($edBlock);
            component.$html.append($actions);

            $edBlock.focus();

            var aceeditor = ace.edit($edBlock[0]);
            aceeditor.session.setMode('ace/mode/html');

            if (component.$html.hasClass('js-living-markdown')) {
                aceeditor.session.setMode('ace/mode/markdown');
            }

            var cleanUp = function () {
                if (aceeditor) {
                    aceeditor.destroy();
                }
                $edBlock.remove();
                component.$html.removeAttr('data-is-editing');
                component.$html.removeClass('js-editor-block');
            }

            $cancel.click(function () {
                component.$html.html(component.model.get(directiveName));
                cleanUp();
            });

            $save.click(function () {
                var newContent = $edBlock.html();
                if (aceeditor) {
                    newContent = aceeditor.getValue();
                }

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
                catcher.find('pre > code').each (function (i, block) {
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
            })
        });

    });
    
})(jQuery);
