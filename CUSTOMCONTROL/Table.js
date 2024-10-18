sap.ui.define([
    "../model/formatter",
    "sap/m/Table",
    "sap/m/TableRenderer"
], (formatter, Table, TableRenderer) => {

    return Table.extend("com.sm.utils.Table", {

        formatter: formatter,

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

        onAfterRendering() {
            Table.prototype.onAfterRendering.apply(this, arguments);

            this.attachBrowserEvent("paste", (oEvent) => {
                oEvent.preventDefault();
                const sText = (oEvent.originalEvent || oEvent).clipboardData.getData("text/plain");
                this.insertRows(sText, this);
            });

            this.getAggregation("items").forEach((oRow) => {
                oRow.getCells().forEach((oCell) => {
                    oCell.attachBrowserEvent("paste", (oEvent) => {
                        oEvent.stopPropagation();
                        oEvent.preventDefault();

                        const sText = (oEvent.originalEvent || oEvent).clipboardData.getData("text/plain");
                        const oDOMCell = jQuery.sap.domById(oEvent.currentTarget?.id);
                        const oInsertCell = jQuery("#" + oDOMCell.id).control()[0];
                        const sItemPath = that.getBindingPath("items");

                        if (!oInsertCell.getBindingContext()) {
                            oInsertCell.setValue(sText);
                        } else {
                            const sPathRow = oInsertCell.getBindingContext().getPath();
                            const iStartRowIndex = sPathRow.split(sItemPath + "/")[1];
                            const sStartProperty = oInsertCell.getBindingPath('value');

                            this.insertRows(sText, this, iStartRowIndex, sStartProperty);
                        }
                    });
                });
            });
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

        insertRows(sText, oTable, iStartRowIndex = 0, sStartProperty) {
            const aRows = sText.split(/\n/).filter(Boolean);
            const aCells = oTable.getBindingInfo("items").template.getCells();
            const sItemsPath = oTable.getBindingPath("items");
            const aItemsArray = oTable.getModel("model").getProperty(sItemsPath);
            const oViewModel = this.getModel("model");
            let iStartPropertyIndex = 0;

            const aTemplateItems = aCells.map((oCell, iIndex) => {
                const sElementName = oCell.getMetadata().getElementName();
                let sPath = "";

                switch (sElementName) {
                    case "sap.m.ComboBox":
                        sPath = oCell.getBindingPath("selectedKey");
                        break;
                    case "sap.m.DatePicker":
                    case "sap.m.Input":
                        sPath = oCell.getBindingPath("value");
                        break;
                    case "sap.m.HBox":
                        sPath = oCell.getAggregation("items")[0].getBindingPath("selectedKey");
                        break;
                }

                if (sPath === sStartProperty) {
                    iStartPropertyIndex = iIndex;
                }

                return sPath;
            });

            aRows.forEach((oRowElement) => {
                const aCells = oRowElement.split(/\t/);
                let oOriginalObject = oViewModel.getProperty(`${sItemsPath}/${iStartRowIndex++}`) || {};

                if (!aItemsArray[iStartRowIndex - 1]) {
                    aTemplateItems.forEach(sPath => oOriginalObject[sPath] = undefined);
                    aItemsArray.push(oOriginalObject);
                }

                aTemplateItems.slice(iStartPropertyIndex).forEach((sName, iIndex) => {
                    const sValue = aCells[iIndex] || "";

                    if (!oOriginalObject[sName]) {
                        oOriginalObject[sName] = (sName === "Begda" || sName === "Endda")
                            ? sValue
                            : sValue.replace(/[^A-Za-z0-9+şŞıIüÜçÇöÖiİ ]+/gi, "");
                    }
                });
            });

            oViewModel.refresh();
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