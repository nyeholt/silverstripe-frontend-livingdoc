        <% if canEdit && $EditMode %>
            <div class="livingdocs-toolbar">
    <!--            <iframe src="about:blank">

                </iframe>-->
                <div class="toolbar-items">

                    <div class="livingdocs-actions">
                        $LivingForm
                    </div>
                    
                    <div class="livingdocs-page-options"></div>

                    <div class="livingdocs-item-properties">

                    </div>
                    <div class="livingdocs-components"><ul></ul></div>
                </div>
            </div>

            <div class="livingdocs-editor"></div>
            <input type="hidden" data-structure="$PageStructure.ATT" id="page-structure" />
        <% else %>
            $Content
        <% end_if %>