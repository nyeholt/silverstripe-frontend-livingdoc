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
    <div class="toolbar-items">
        <div class="livingdocs-page-options"></div>
        <div class="livingdocs-components">
            <div class="component-list"></div>
        </div>
    </div>
</div>

<div id="livingdocs-editor" data-config="$LivingDocsConfig.ATT"></div>
<% else %>
$Content
<% end_if %>
