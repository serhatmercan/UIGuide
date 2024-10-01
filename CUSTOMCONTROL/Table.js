sap.ui.define([
    "sap/m/Table",
    "sap/m/TableRenderer"
], (Table, TableRenderer) => {

    return Table.extend("com.sm.utils.Table", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        init() {
            Table.prototype.init.apply(this, arguments);

            this.addEventDelegate({
                onAfterRendering() {
                    this.sCurrentFocussedID = undefined;
                    this.attachFocusIn();
                    this.attachKeyDown();
                    this.handleFocusFirstCell();
                }
            }, this);
        },

        renderer(oRenderManager, oControl) {
            TableRenderer.render(oRenderManager, oControl);
        },

        /* ================ */
        /* Internal Methods */
        /* ================ */

        attachFocusIn() {
            this.$().focusin(() => {
                setTimeout(() => {
                    const oField = this.$().find('.sapMInputFocused')[0];
                    this.sCurrentFocussedID = oField?.id ?? "";
                }, 100);
            });
        },

        attachKeyDown() {
            this.$().on("keydown", (oEvent) => {
                if (oEvent.which === jQuery.sap.KeyCodes.TAB) {
                    const bHandled = this.tab(oEvent.shiftKey);
                    if (bHandled) {
                        oEvent.preventDefault();
                        oEvent.stopPropagation();
                    }
                }
            });
        },

        focusFirstCell() {
            this.bFocusFirstCell = true;
        },

        handleFocusFirstCell() {
            if (this.bFocusFirstCell) {
                setTimeout(() => {
                    const aInputs = this.getItems()[0]?.getCells().filter(oItem => oItem._$input && oItem.getEditable()) ?? [];

                    if (aInputs.length === 0) return;

                    const [oFirstInput] = aInputs;

                    oFirstInput.focus();
                    oFirstInput.selectText(0, oFirstInput.getValue().length);

                    this.bFocusFirstCell = false;
                }, 500);
            }
        },

        tabBack() {
            this.tab(true);
        },

        tabForward() {
            this.tab(false);
        },

        tab(bBack) {
            if (!this.sCurrentFocussedID) return;

            const oCurrentFocussed = sap.ui.getCore().byId(this.sCurrentFocussedID);
            const oCurrentRow = oCurrentFocussed?.getParent();
            const iIndexOfCurrentRow = this.indexOfItem(oCurrentRow);
            const iIndexOfCurrentFocussed = oCurrentRow?.indexOfCell(oCurrentFocussed);
            const bIsLastRow = iIndexOfCurrentRow >= this.getItems().length - 1;
            const bIsFirstRow = this.indexOfItem(oCurrentRow) <= 0;
            const aIndicesOfFocussable = oCurrentRow.getCells()?.reduce((oAcc, oCell, iIndex) => {
                if (oCell._$input && oCell.getEditable()) {
                    oAcc.push(iIndex);
                }
                return oAcc;
            }, []);
            const iIndexOfFirstFocussable = aIndicesOfFocussable[0];
            const iIndexOfLastFocussable = aIndicesOfFocussable[aIndicesOfFocussable.length - 1];
            let oTargetCell;

            if (bBack) {
                if (iIndexOfCurrentFocussed === iIndexOfFirstFocussable) {
                    if (!bIsFirstRow) {
                        oTargetCell = this.getItems()[iIndexOfCurrentRow - 1]?.getCells()[iIndexOfLastFocussable];
                    }
                } else {
                    const iTargetIndex = aIndicesOfFocussable.reduce((iPrevIndex, iIndex) => (iIndex < iIndexOfCurrentFocussed ? iIndex : iPrevIndex), undefined);
                    oTargetCell = this.getItems()[iIndexOfCurrentRow]?.getCells()[iTargetIndex];
                }
            } else {
                if (iIndexOfCurrentFocussed === iIndexOfLastFocussable) {
                    if (!bIsLastRow) {
                        oTargetCell = this.getItems()[iIndexOfCurrentRow + 1]?.getCells()[iIndexOfFirstFocussable];
                    }
                } else {
                    const iTargetIndex = aIndicesOfFocussable.find(iIndex => iIndex > iIndexOfCurrentFocussed);
                    oTargetCell = this.getItems()[iIndexOfCurrentRow]?.getCells()[iTargetIndex];
                }
            }

            if (oTargetCell) {
                oTargetCell.focus();
                oTargetCell.selectText(0, oTargetCell.getValue().length);
                return true;
            }
        }

    });
});