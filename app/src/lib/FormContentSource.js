import * as $ from 'jquery';

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

            $(this).ajaxSubmit(function (response) {
                _this.find('button.action').each(function () {
                    $(this).prop('disabled', false);
                });
            });

            _this.find('button.action').each(function () {
                $(this).prop('disabled', true);
            });

            return false;
        });

        $(window).bind('beforeunload', function () {
            if ($(this.TOOLBAR_FORM).attr('data-changed')) {
                return "You may have unsaved changes, sure?";
            }
        });


    }

    getConfig() {
        return this.config;
    }

    getPageStructure() {
        if (!this.config.pageStructure) {
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
            {
                "id": "doc-1c8e6umt10",
                "identifier": "bootstrap3.section",
                "styles": {
                    "section-class": "first container"
                },
                "containers": {
                    "section": [
                        {
                            "id": "doc-1c8e6umt11",
                            "identifier": "bootstrap3.row",
                            "styles": {
                                "text-styles": "text-center"
                            },
                            "containers": {
                                "row": [
                                    {
                                        "id": "doc-1c8e6umt12",
                                        "identifier": "bootstrap3.column",
                                        "containers": {
                                            "column": [
                                                {
                                                    "id": "doc-1c8e6umt30",
                                                    "identifier": "bootstrap3.h1",
                                                    "content": {
                                                        "title": "[livingpage_show_field field=Title]"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "id": "doc-1c8e6umt31",
                "identifier": "bootstrap3.section",
                "styles": {
                    "section-class": "container"
                },
                "containers": {
                    "section": [
                        {
                            "id": "doc-1c8e6umt32",
                            "identifier": "bootstrap3.row",
                            "styles": {
                                "text-styles": ""
                            },
                            "containers": {
                                "row": [
                                    {
                                        "id": "doc-1c8e6umt33",
                                        "identifier": "bootstrap3.column",
                                        "containers": {
                                            "column": [
                                                {
                                                    "id": "doc-1c8e6umt34",
                                                    "identifier": "bootstrap3.p",
                                                    "content": {
                                                        "text": "<a href=\"[file_link,id=124]\" title=\"Strategy Update August 2018\">Current version (to December 2018) is available via PDF</a>.&nbsp;"
                                                    }
                                                },
                                                {
                                                    "id": "doc-1c8e7eaol0",
                                                    "identifier": "bootstrap3.p",
                                                    "content": {
                                                        "text": "Previous versions will appear below.&nbsp;"
                                                    }
                                                },
                                                {
                                                    "id": "doc-1ckc2s4t40",
                                                    "identifier": "bootstrap3.p",
                                                    "content": {
                                                        "text": "<a href=\"[file_link,id=90]\" title=\"Strategy Update March 2018\">Strategy Update&nbsp; - March 2018</a>"
                                                    }
                                                },
                                                {
                                                    "id": "doc-1c8e7ea123",
                                                    "identifier": "bootstrap3.wysiwyg",
                                                    "content": {
                                                        "content": "Wysiwyg content here nbsp;"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ],
        "design": {
            "name": "bootstrap3",
            "version": "0.0.1"
        }
    }
};