<!DOCTYPE html>
<html lang="$ContentLocale">

<head>
    <% base_tag %>
    <title>
        Page Editor
    </title>
    <meta charset="utf-8">
    <%-- Dont use initial-scale=1.0, maximum-scale=1.0, user-scalable=0 as thats not accessible --%>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--[if lt IE 9]>
        <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
        <![endif]-->
</head>

<body>
    <div id="livingdocs-editor-holder container-fluid">
        <div class="livingdocs-bottom-bar">
            <div class="livingdocs-actions">
                $LivingForm
            </div>
            <div id="livingdocs-toolbar-controls">
            </div>

            <div class="livingdocs-toolbar-messages">
            </div>
        </div>
        <div class="row m-0">
            <div id="ld-toolbar-holder" class="col p-0 mr-0">
                <div class="livingdocs-toolbar">
                    <div class="toolbar-tabs">
                        <div class="ld-tab" href="#livingdocs-components">Components</div>
                        <div class="ld-tab" href="#livingdocs-property-tab">Properties</div>
                        <div class="ld-tab" href="#livingdocs-page-options" id="ld-options-tab">Options</div>
                    </div>
                    <div class="toolbar-items">
                        <div id="livingdocs-components" class="ld-tab-panel ld-tab-default">
                            <div class="component-list"></div>
                        </div>

                        <div id="livingdocs-property-tab" class="ld-tab-panel">
                            <div class="livingdocs-item-properties"></div>
                        </div>

                        <div id="livingdocs-page-options" class="ld-tab-panel"></div>

                    </div>
                </div>
            </div>
            <div class="ld-editor-frame col p-0 m-0">
                <iframe src="about:blank" data-pagelink="$PageLink.ATT" id="livingdocs-frame"></iframe>
            </div>
        </div>
    </div>



    <div id="livingdocs-editor" data-config="$LivingDocsConfig.ATT"></div>
</body>

</html>
