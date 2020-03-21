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

<div class="livingdocs-item-properties"></div>

<div class="livingdocs-toolbar">
    <div class="toolbar-tabs">
        <a class="ld-tab" href="#livingdocs-components">Components</a>
        <a class="ld-tab" href="#livingdocs-page-options">Page Options</a>
    </div>
    <div class="toolbar-items">
        <div id="livingdocs-page-options" class="ld-tab-panel"></div>
        <div id="livingdocs-components" class="ld-tab-panel ld-tab-default">
            <div class="component-list"></div>
        </div>
        <div id="livingdocs-property-tab" class="ld-tab-panel"></div>
    </div>
</div>

<div id="livingdocs-editor" data-config="$LivingDocsConfig.ATT"></div>
<% else %>
$Content
<% end_if %>
