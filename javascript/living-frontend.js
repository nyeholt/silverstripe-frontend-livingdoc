;
(function ($) {

    var DOC_HOLDER = '.livingdocs-editor';

    var mediaUrl = 'FrontendInsertDialog/MediaForm';

    var windowPrefs = "height=600,width=750,menubar=no,location=no,resizable=no,scrollbars=yes,status=no,titlebar=no,toolbar=no";

    window.EditSink = {
        currentTarget: '',
        currentLink: '',
        setLinkObject: function (obj) {
            alert("Setting");
            console.log(obj);
            this.currentLink = obj;
        },
        setContent: function (content) {
            alert("Set content to " + content);
        }
    };

    $(document).on('click', '.media-insert', function (e) {
        var mediaDialog = window.open(mediaUrl, "frontend-dialog", windowPrefs);
        EditSink.currentTarget = $(this);
        EditSink.setLinkObject(null);
    });
    
    $(document).on('click', '#Form_LivingForm_action_save', function (e) {
        
    })

    $(function () {
        var structure = $('#page-structure').length > 0 ? $('#page-structure').data('structure') : null;
        if (structure) {
        } else {
            alert("No struct");
        }

        if (!window.design) {
            alert("No design loaded");
            return;
        }

        var selectedDesignName = structure.data.design.name;
        var selectedDesign = design[selectedDesignName];

        selectedDesign.assets.basePath = "frontend-livingdoc/javascript/livingdocs/";

        doc.design.load(selectedDesign);

        doc.config({livingdocsCssFile: "frontend-livingdoc/javascript/livingdocs/css/livingdocs.css"});

        var livingdoc = doc.new(structure);

        var activeDesign = doc.design.designs[selectedDesignName];

        var ready = livingdoc.createView({
            interactive: true,
            iframe: false,
            host: DOC_HOLDER,
            wrapper: activeDesign.wrapper
        });

        ready.then(function () {
            var $host = $(DOC_HOLDER)

            var $components = $('.livingdocs-components');

            for (var i = 0; i < activeDesign.components.length; i++) {
                var template = activeDesign.components[i];
                var $entry = $('<div class="toolbar-entry">');
                $entry.html(template.label);
                $components.append($entry);

                draggableComponent(doc, template.name, $entry);
            }
            
            livingdoc.model.changed.add(function() {
                updateDataFields();
            });
        });


        function updateDataFields() {
            $('#Form_LivingForm').find('[name=PageStructure]').val(livingdoc.toJson());
            $('#Form_LivingForm').find('[name=Content]').val(livingdoc.toHtml());
        }

        function draggableComponent(doc, name, $elem) {
            $elem.on('mousedown', function (event) {
                var newComponent = livingdoc.createComponent(name);
                doc.startDrag({
                    componentModel: newComponent,
                    event: event,
                    config: {
                        preventDefault: true,
                        direct: true
                    }
                });
            });
        }
    })

})(jQuery);