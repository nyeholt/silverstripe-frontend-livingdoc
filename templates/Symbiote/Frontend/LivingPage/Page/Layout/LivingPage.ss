<div class="content-container unit size3of4 lastUnit">
    <article>
        <% if $EditMode %>
            <div class="livingdocs-bottom-bar">
                <div class="livingdocs-toolbar-controls">
                </div>
                <div class="livingdocs-actions">
                    $LivingForm
                </div>
            </div>

            <div class="livingdocs-item-properties"></div>

            <div class="livingdocs-toolbar">
    <!--            <iframe src="about:blank">

                </iframe>-->
                <div class="toolbar-items">

                    <div class="livingdocs-page-options"></div>
                    <div class="livingdocs-components"><div class="component-list"></div></div>
                </div>
            </div>

            <div id="livingdocs-editor" data-config="$LivingDocsConfig.JSON.ATT"></div>
        <% else %>
            $Content
        <% end_if %>
    </article>
    $Form
    $CommentsForm
</div>
