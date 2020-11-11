
export const Constants = {
    EDITOR_FRAME: '#livingdocs-frame',
    SIZE_CONTROLS: '#livingdocs-toolbar-controls',
    BUTTON_BAR: '.livingdocs_EditorField_Toolbar_textopts',
    BUTTON_BAR_CLS: 'livingdocs_EditorField_Toolbar_textopts',
    TOOLBAR_FORM: '#Form_LivingForm',

    btnCls: (extra) => {
        return "btn btn-sm " + (extra ? extra : 'btn-secondary')
    }
};