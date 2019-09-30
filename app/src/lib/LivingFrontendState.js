
const LivingFrontendState = {
    currentDoc: null,
    changeStack: [],
    activeComponent: null,
    trackChanges: true,
    historyLength: 20,
    formIdentifier: null,

    setCurrentDoc: function (livingdoc, identifer) {
        this.currentDoc = livingdoc;
        this.activeComponent = null;
        this.changeStack = [];

        this.formIdentifier = identifer;
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
            while (this.currentDoc.componentTree.root.first) {
                this.currentDoc.componentTree.root.first.remove();
            }
            this.trackChanges = true;
            this.currentDoc.componentTree.addDataWithAnimation(dataSet);
        }
    },

    notifyDocUpdate: function (realchange) {
        var docStructure = this.currentDoc.toJson();
        $(this.formIdentifier).find('[name=PageStructure]').val(docStructure);
        $(this.formIdentifier).find('[name=Content]').val(this.currentDoc.toHtml());

        this.saveState(docStructure);

        if (realchange) {
            $(this.formIdentifier).attr('data-changed', 1);
            $(this.formIdentifier).find('[name=action_publish]').prop('disabled', true);
        }
    }
};

export default LivingFrontendState;