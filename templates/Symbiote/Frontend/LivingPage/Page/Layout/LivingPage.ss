<% if $EditMode %>
<div class="livingdocs-bottom-bar">
    <div class="livingdocs-toolbar-controls">
    </div>
    <div class="livingdocs-actions">
        $LivingForm
    </div>
    <div class="livingdocs-toolbar-messages">
    </div>
</div>

<div class="livingdocs-toolbar">
    <div class="toolbar-tabs">
        <div class="ld-tab" href="#livingdocs-components">Components</div>
        <div class="ld-tab" href="#livingdocs-property-tab">Properties</div>
        <div class="ld-tab" href="#livingdocs-page-options">Options</div>
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

<div id="livingdocs-editor" data-config="$LivingDocsConfig.ATT"></div>
<% else %>
$Content
<% end_if %>
