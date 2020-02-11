
const LivingDocState = {
    livingdoc: null,
    changeStack: [],
    activeComponent: null,
    trackChanges: true,
    historyLength: 20,
    formIdentifier: null,
    selectedDesign: null,
    activeDesign: null,

    // 
    contentSource: null,

    // references the global 'doc' object that livingdocs exposes
    docApi: null,

    loadLivingdoc: function (docApi, selectedDesign, structure, contentSource) {
        this.docApi = docApi;
        this.contentSource = contentSource;
        this.selectedDesign = selectedDesign;

        this.docApi.design.load(this.selectedDesign);

        // this is the active instance of the design being used. 
        this.activeDesign = this.docApi.design.designs[this.selectedDesign.name];

        this.docApi.config({
            livingdocsCssFile: false,
            editable: {
                browserSpellcheck: true,
                changeDelay: 50
            }
        });

        this.livingdoc = this.docApi.new(structure);

        this.initialiseState();
    },

    initialiseState: function () {
        this.activeComponent = null;
        this.changeStack = [];

        this.notifyDocUpdate();
    },

    focusOn: function (component) {
        this.activeComponent = component;
    },
    blur: function () {
        // not a true blur, we don't trigger on all blur occasions otherwise we lose context
        this.activeComponent = null;
    },

    saveState: function (currentState) {
        if (this.trackChanges) {
            var actionId = this.activeComponent ? this.activeComponent.model.id : null;

            // if the action happened to the currently active component, we remove any previous 
            // actions to the same one
            if (this.changeStack.length > 0 &&
                actionId &&
                this.changeStack[this.changeStack.length - 1].cid === actionId) {
                this.changeStack.pop();
            }

            this.changeStack.push({
                time: new Date(),
                cid: actionId,
                state: currentState
            });

            if (this.changeStack.length > this.historyLength) {
                this.changeStack.shift();
            }
        }
    },

    loadState: function (stateIndex) {
        if (this.changeStack[stateIndex]) {
            var dataSet = JSON.parse(this.changeStack[stateIndex].state);

            this.trackChanges = false;
            while (this.livingdoc.componentTree.root.first) {
                this.livingdoc.componentTree.root.first.remove();
            }
            this.trackChanges = true;
            this.livingdoc.componentTree.addDataWithAnimation(dataSet);
        }
    },

    notifyDocUpdate: function (realchange) {
        var docStructure = this.livingdoc.toJson();
        this.contentSource.updatePageContent(docStructure, this.livingdoc.toHtml(), realchange);
        this.saveState(docStructure);
    }
};

export default LivingDocState;
