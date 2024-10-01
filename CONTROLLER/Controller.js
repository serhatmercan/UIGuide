sap.ui.define([
    "./BaseController",
], (BaseController) => {
    "use strict";

    return BaseController.extend("xxx.controller.Controller", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit() {
            this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
            this.getOwnerComponent().getModel().attachRequestCompleted(this.attachRequestCompleted, this);
            this.getView().addEventDelegate({
                onAfterHide: (oEvent) => { },
                onAfterRendering: (oEvent) => { },
                onAfterShow: (oEvent) => { },
                onBeforeHide: (oEvent) => { },
                onBeforeShow: (oEvent) => { },
            }, this);

            const oDetailView = sap.ui.xmlview({
                viewName: "xxx.view.Detail",
                type: sap.ui.core.mvc.ViewType.XML // Optional
            });
            const oDetailController = oDetailView.getController();

            oDetailController.init(this);
            this.oButtonConfiguration = oDetailController;
        },

        onAfterRendering() {
            const oListBinding = this.byId("List").getBinding("items");

            oListBinding.attachDataRequested((oEvent) => { });
            oListBinding.attachDataReceived((oEvent) => { });
        },

        onBeforeRendering() {
            const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
            const oToday = new Date();
            const oFormattedToday = oDateFormat.format(oToday);
            const oFormattedTwoWeeksAgo = oDateFormat.format(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 14));
            const oDefaultFilter = { Erdat: { low: oFormattedTwoWeeksAgo, high: oFormattedToday } };
            const sAppIdentifier = "com.serhatmercan.listreport::sap.suite.ui.generic.template.ListReport.view.ListReport";
            const oSmartFilter = this.byId(`${sAppIdentifier}::MainSet--listReportFilter`);

            oSmartFilter.attachInitialise(() => {
                oSmartFilter.setFilterData(oDefaultFilter);
            });
        },

        onExit() {
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

        attachRequestCompleted() {
            setTimeout(() => {
                const oComboBox = this.byId("ComboBox");

                oComboBox.fireChange();
                oComboBox.getInnerControls()[0].getBinding("items").filter([
                    new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, this.getModel().getProperty(`${this.getView().getBindingContext().getPath()}/ID`))
                ]);
            }, 500);
        },

        async patternMatched(oEvent) {
            this.onClearModel();
            this.getView().rerender();

            await this.getOwnerComponent().getModel().metadataLoaded();
        }

    });
});
