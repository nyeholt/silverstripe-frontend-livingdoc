import * as $ from 'jquery';
import 'jquery-form';
import { Constants } from '../constants';

/**
 * Represents a SilverStripe based form as being
 * the provider of content. In future, this can be
 * an API instead...
 */
class FormContentSource {
    CONFIG_HOLDER = '#livingdocs-editor';
    DOC_HOLDER = '#livingdocs-container';

    config = {};

    init() {
        let config = $(this.CONFIG_HOLDER).data('config');
        config.editorHost = this.DOC_HOLDER;

        if (config.pageStructure) {
            this.config = config;
        }

        this.config.contextId = $(Constants.TOOLBAR_FORM).find('input[name="ID"]').val();

        $(document).on('submit', Constants.TOOLBAR_FORM, function () {
            var _this = $(this);

            _this.removeAttr('data-changed');

            $(this).ajaxSubmit({
                error: function () {
                    alert("An error was encountered");
                    console.log(arguments);
                },
                complete: function (response) {
                    _this.find('button.action').each(function () {
                        $(this).prop('disabled', false);
                        $(this).attr("data-clicked", "0");
                    });
                }
            });

            _this.find('button.action').each(function () {
                $(this).prop('disabled', true);
            });

            return false;
        });

        $(document).on('mousedown', Constants.TOOLBAR_FORM + ' button.action', function (e) {
            if ($(this).hasClass('link-action')  && e.which == 1) {
                e.preventDefault();
                location.href = $(this).attr('data-link');
                return false;
            }

            var parentForm = $(this).parents('form');
            parentForm.find('input.hidden-action').remove();
            $('<input class="hidden-action">').attr({
                'type': 'hidden',
                'name': $(this).attr('name'),
                'value': '1'
            }).appendTo(parentForm);
        })

        $(window).bind('beforeunload', () => {
            if ($(Constants.TOOLBAR_FORM).attr('data-changed')) {
                return "You may have unsaved changes, sure?";
            }
        });

        $(document).on('updateLivingdocsDesign', function (e, selectedDesign) {
            if (config.extraComponents) {
                for (let i in config.extraComponents) {
                    let newComponent = config.extraComponents[i];
                    let group = newComponent.group;
                    delete newComponent.group; // livingdocs-engine fails otherwise
                    if (group && selectedDesign.groups) {
                        let existingIndex = selectedDesign.groups.findIndex(function (item) {
                            return item.label == group;
                        });
                        if (existingIndex >= 0) {
                            selectedDesign.groups[existingIndex].components.push(newComponent.name);
                        } else {
                            selectedDesign.groups.push({
                                label: group,
                                components: [newComponent.name]
                            });
                        }
                    }
                    selectedDesign.components.push(newComponent);
                }
            }

            if (config.extraProperties) {
                for (let i in config.extraProperties) {
                    for (let propname in config.extraProperties[i]) {
                        selectedDesign.componentProperties[propname] = config.extraProperties[i][propname];
                    }
                }
            }

            if (config.compounds) {
                for (let i in config.compounds) {
                    let newComponent = config.compounds[i];
                    let group = newComponent.group;
                    delete newComponent.group;
                    if (group && selectedDesign.groups) {
                        let existingIndex = selectedDesign.groups.findIndex(function (item) {
                            return item.label == group;
                        });
                        if (existingIndex >= 0) {
                            selectedDesign.groups[existingIndex].components.push(newComponent.name);
                        } else {
                            selectedDesign.groups.push({
                                label: group,
                                components: [newComponent.name]
                            });
                        }
                    }

                    selectedDesign.compounds[newComponent.name] = newComponent;
                }
            } else {
                selectedDesign.compounds = {};
            }
        })
    }

    getConfig() {
        return this.config;
    }

    getPageStructure() {
        if (!this.config.pageStructure) {
            throw "Page hasn't been properly initialised in the CMS";
            this.config.pageStructure = dummyStructure;
        }

        return this.config.pageStructure;
    }

    updatePageContent(docStructure, docHtml, realchange) {
        $(Constants.TOOLBAR_FORM).find('[name=PageStructure]').val(docStructure);
        $(Constants.TOOLBAR_FORM).find('[name=Content]').val(docHtml);

        if (realchange) {
            $(Constants.TOOLBAR_FORM).attr('data-changed', 1);
            $(Constants.TOOLBAR_FORM).find('[name=action_publish]').prop('disabled', true);
        }
    }
}


const ContentSource = new FormContentSource;
ContentSource.init();

export default ContentSource;


const dummyStructure = {
    "data": {
        "content": [

        ],
        "design": {
            "name": "bootstrap3",
            "version": "0.0.1"
        }
    }
};
