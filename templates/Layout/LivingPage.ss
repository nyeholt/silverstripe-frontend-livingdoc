<% include SideBar %>
<div class="content-container unit size3of4 lastUnit">
    <article>
        <h1>$Title</h1>
        <div class="content">$Content</div>



        <div class="livingdocs-toolbar">
<!--            <iframe src="about:blank">

            </iframe>-->
            <div class="toolbar-items">

                <div class="livingdocs-actions">
                    $LivingForm
                </div>

                <div class="livingdocs-item-properties">

                </div>
                <div class="livingdocs-components"></div>
            </div>

        </div>

        <div class="livingdocs-editor"></div>


        <input type="hidden" data-structure="$PageStructure.ATT" id="page-structure" />

    </article>
    $Form
    $CommentsForm
</div>