
import * as jQuery from 'jquery';

import './livingdocs/editable';
import './livingdocs/livingdocs-engine';

import LivingDocState from './lib/LivingDocState';
import ContentSource from './lib/FormContentSource';
import { initialise_property_editor } from './lib/ld-property-editor';
import { initialise_keyboard } from './modules/lf-keyboard-handler';
import { initialise_messages } from './modules/lf-messages';
import { init_interface } from './editor-interface';
import { Constants } from './constants';

(function ($) {

    if (!window.$) {
        window.$ = $;
    }

    var PING_TIME = 300;
    var MAX_TIME = 86400;

    var pingErrors = 0;

    var editingTime = 0;

    var pingterval = setInterval(function () {

        if (editingTime > MAX_TIME) {
            clearInterval(pingterval);
            return;
        }

        $.get('Security/ping').then(function () {
            pingErrors = 0;
        }).catch(function () {
            pingErrors++;
            if (pingErrors > 5) {
                alert("Your session may have expired, please try logging in again in a separate tab");
                clearInterval(pingterval);
            }
        });

        editingTime += PING_TIME;
    }, PING_TIME * 1000);


    $(document).on('mousedown', '#clicker', function (e) {
        e.preventDefault();
    })

    $(document).on('click', '#clicker', function () {
        // ContentBridge.setLinkObject({
        //     href: 'link/href', target: '', title: 'linktitle'
        // });
    });

    $(function () {
        $(Constants.EDITOR_FRAME).on('load', function () {
            initialise_editor($(this));
        });

        // fixes issue with frame and JS being out of sync
        let pageLink = $(Constants.EDITOR_FRAME).attr('data-pagelink');
        $(Constants.EDITOR_FRAME).attr('src', pageLink);
    });

    function initialise_editor(holderFrame) {

        initialise_messages();

        var structure = ContentSource.getPageStructure();

        // relies on a design file having been loaded earlier
        // TODO - abstract this in _some_ manner. TBA
        if (!window.design) {
            alert("No design loaded");
            return;
        }

        var selectedDesignName = structure.data.design.name;
        var selectedDesign = design[selectedDesignName];

        if (!selectedDesign) {
            alert("Selected design " + selectedDesignName + " couldn't be found");
            return;
        }

        // provides 3rd party hooks
        $(document).trigger('updateLivingdocsDesign', selectedDesign);

        // hard coded against the design for now??
        // selectedDesign.assets.basePath = "frontend-livingdoc/javascript/livingdocs/";

        // doc.design.load(selectedDesign);

        // doc.config({
        //     livingdocsCssFile: "frontend-livingdoc/javascript/livingdocs/css/livingdocs.css",
        //     editable: {
        //         browserSpellcheck: true,
        //         changeDelay: 50
        //     }
        //     // ,
        //     // // really not sure if this matters here, but we'll run with it for now.
        //     // directives: {
        //     //     dataobject: {
        //     //         attr: 'doc-dataobject',
        //     //         renderedAttr: 'calculated in augment_config',
        //     //         overwritesContent: true
        //     //     }
        //     // }
        // });

        // livingdoc = doc.new(structure);

        LivingDocState.loadLivingdoc(doc, selectedDesign, structure, ContentSource);

        // bind it into the bridge
        // ContentBridge.setLivingDoc(livingdoc);

        LivingDocState.notifyDocUpdate();

        var ready = LivingDocState.livingdoc.createView({
            interactive: true,
            iframe: false,
            host: holderFrame.contents().find(ContentSource.getConfig().editorHost),
            wrapper: LivingDocState.activeDesign.wrapper
        });

        ready.then(function () {
            // captures model changes that need updating
            LivingDocState.livingdoc.model.changed.add(function () {
                LivingDocState.notifyDocUpdate(true);
            });

            /** doc is declared in the global namespace */
            init_interface(doc, selectedDesign);

            // todo(Marcus)
            // figure out how to allow selection of 'background' components
            // let lastClickedComponent = "", lastClickedCount = 0;

            // LivingDocState.livingdoc.interactiveView.page.componentClick.add(function (componentView, page, directives, event) {
            //     if (componentView.model.hasContainers()) {
            //         if (lastClickedComponent === componentView.model.id) {
            //             lastClickedCount++;
            //             if (lastClickedCount == 2) {
            //                 // get the parent and select it
            //                 let parent = componentView.parent();
            //                 page.handleClickedComponent(event, parent);
            //                 page.startDrag({
            //                     componentView: parent,
            //                     event: event
            //                 });
            //                 lastClickedCount = 0;
            //             }
            //         } else {
            //             lastClickedCount = 0;
            //         }
            //         lastClickedComponent = componentView.model.id;
            //     }
            // });

            initialise_property_editor();
            initialise_keyboard(LivingDocState, holderFrame.contents()[0]);

            $(document).trigger('livingfrontend.updateLivingDoc', [LivingDocState.livingdoc]);
        });

        /**
         * Show a list of buttons in a toolbar. The button list should be
         * [
         *     { label: 'Label', title: 'tooltop', click: function () {} }
         * ]
         *
         * @param an array of button objects
         * @param an object with a .left and .top  property that defines where to show the bar
         * @returns void
         */
        LivingDocState.showButtonBar = function (buttons, loc) {
            $(Constants.EDITOR_FRAME).contents().find(Constants.BUTTON_BAR).remove()
            $(Constants.BUTTON_BAR).remove();
            var outer_el = $("<div>").addClass(Constants.BUTTON_BAR_CLS);

            for (var i = 0; i < buttons.length; i++) {
                var b = buttons[i];
                var buttonEl = $('<button>').html(b.label);
                if (b.title) {
                    buttonEl.attr('title', b.title);
                }
                buttonEl.on('mousedown', function (theButton) {
                    return function (e) {
                        e.preventDefault(); theButton.click();
                    }
                }(b));

                outer_el.append(buttonEl);
            }

            var appendTo = $('body');
            if (!loc.left) {
                // we have a node instead
                appendTo = $(loc).parent();

                var newloc = {
                    top: loc.offsetTop + 20,
                    left: loc.offsetLeft + 20
                };
                loc = newloc;
            }

            outer_el.css({ position: "absolute", left: loc.left, top: loc.top - 40, background: "transparent", "z-index": 4000 });
            appendTo.append(outer_el);
        };

        LivingDocState.showDialog = function () {
            var popup;
            var dialog = $('#lf-dialog');
            if (!dialog.length) {
                dialog = $('<div class="lf-overlay" id="lf-dialog">');
                popup = $('<div class="lf-popup">').appendTo(dialog);
                popup.append('<a class="lf-dialog-close" href="#">&times;</a>');
                popup.append('<div class="lf-dialog-content">');
                $('body').append(dialog);
            }

            popup = dialog.find('.lf-popup');
            popup.empty();
            $(dialog).addClass('active-dialog');
            return popup;
        }

        LivingDocState.closeDialog = function () {
            var dialog = $('#lf-dialog');
            if (dialog.length) {
                dialog.removeClass('active-dialog');
                dialog.find('lf-dialog-content').html('');
            }
        }

        $(document).on('click', 'a.lf-dialog-close', function (e) {
            LivingDocState.closeDialog();
            return false;
        });


    };

})(jQuery);
