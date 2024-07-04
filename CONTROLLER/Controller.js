sap.ui.define([
    "./BaseController",
], function (BaseController) {
    "use strict";

    return BaseController.extend("xxx.controller.Controller", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit: function () {
            this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
            this.getOwnerComponent().getModel().attachRequestCompleted(this.attachRequestCompleted, this);

            this.getView().addEventDelegate({
                onAfterHide: (oEvent) => {

                },
                onAfterRendering: (oEvent) => {

                },
                onAfterShow: (oEvent) => {

                },
                onBeforeHide: (oEvent) => {

                },
                onBeforeShow: (oEvent) => {

                }
            }, this)
        },

        onAfterRendering: function () {
            this.byId("List").getBinding("items").attachDataRequested((oEvent) => {

            });
            this.byId("List").getBinding("items").attachDataReceived((oEvent) => {

            });
        },

        onBeforeRendering: function () {
            const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd"
            });
            const oToday = new Date();
            const oFormattedToday = oDateFormat.format(oToday);
            const oFormattedTwoWeeksAgo = oDateFormat.format(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 14));
            const oDefaultFilter = {
                Erdat: {
                    low: oFormattedTwoWeeksAgo,
                    high: oFormattedToday
                }
            };
            const sAppIdentifier = "com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport";
            const oSmartFilter = this.byId(sAppIdentifier + "::MainSet--listReportFilter");

            oSmartFilter.attachInitialise(() => {
                oSmartFilter.setFilterData(oDefaultFilter);
            });
        },

        onExit: function () {
            if (this.oDocument) {
                this.oDocument.destroy();
                this.oDocument = null;
            }
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        /* ================ */
        /* Internal Methods */
        /* ================ */

        attachRequestCompleted: function () {
            setTimeout(() => {
                this.byId("ComboBox").fireChange();
                this.byId("ComboBox").getInnerControls()[0].getBinding("items").filter([
                    new Filter("ID", FilterOperator.EQ, this.getModel().getProperty(this.getView().getBindingContext().getPath() + "/ID"))
                ]);
            }, 500);
        },

        patternMatched: function (oEvent) {
            this.onClearModel();

            this.getView().rerender();

            this.getOwnerComponent().getModel().metadataLoaded().then(async () => { });
        }

    });
});