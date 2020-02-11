import * as $ from 'jquery';
import 'jquery-form';

/**
 * Represents a SilverStripe based form as being
 * the provider of content. In future, this can be
 * an API instead...
 */
class FormContentSource {
    TOOLBAR_FORM = '#Form_LivingForm';
    PROPS_HOLDER = 'livingdocs_EditorField_Toolbar_options';
    DOC_HOLDER = '#livingdocs-editor';

    config = {};

    init() {
        let config = $(this.DOC_HOLDER).data('config');
        config.editorHost = this.DOC_HOLDER;

        if (config.pageStructure) {
            this.config = config;
        }

        $(document).on('submit', this.TOOLBAR_FORM, function () {
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

        $(document).on('mousedown', this.TOOLBAR_FORM + ' button.action', function (e) {
            // catuch the "live" click and redirect instead
            if ($(this).attr('name') == 'action_live') {
                e.preventDefault();
                location.href = location.href + '?edit=stop&stage=Live';
                return false;
            }

            if ($(this).hasClass('link-action')) {
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

        $(window).bind('beforeunload', function () {
            if ($(this.TOOLBAR_FORM).attr('data-changed')) {
                return "You may have unsaved changes, sure?";
            }
        });

        $(document).on('updateLivingdocsDesign', function (e, selectedDesign) {
            if (config.extraComponents) {
                for (let i in config.extraComponents) {
                    let newComponent = config.extraComponents[i];
                    let group = newComponent.group;
                    delete newComponent.group;
                    if (group && selectedDesign.groups) {
                        let existingIndex = selectedDesign.groups.findIndex(function (item) {
                            return item.label == group;
                        });
                        if (existingIndex >= 0) {
                            selectedDesign.groups[existingIndex].components.push(newComponent.name);
                        }
                    }
                    selectedDesign.components.push(newComponent);
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
        $(this.TOOLBAR_FORM).find('[name=PageStructure]').val(docStructure);
        $(this.TOOLBAR_FORM).find('[name=Content]').val(docHtml);

        if (realchange) {
            $(this.TOOLBAR_FORM).attr('data-changed', 1);
            $(this.TOOLBAR_FORM).find('[name=action_publish]').prop('disabled', true);
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
