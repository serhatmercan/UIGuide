sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.sm.application.controller.Detail", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit: function () {
            this.getRouter().getRoute("Detail").attachPatternMatched(this.patternMatched, this);
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onCloseDetailPage: function () {
            this.getModel("model").setProperty("/ActionButtonsInfo/MidColumn/FullScreen", false);
            this.getRouter().navTo("Main");
        },

        onExitFullScreenDetailPage: function () {
            const oModel = this.getModel("model");

            oModel.setProperty("/ActionButtonsInfo/MidColumn/FullScreen", false);
            oModel.setProperty("/Layout", "TwoColumnsMidExpanded");
        },

        onShowDetailX: function (oEvent) {
            const sPath = oEvent.getSource().getBindingContextPath();
            const oModel = this.getModel("model");

            oModel.setProperty("/Layout", "ThreeColumnsMidExpanded");

            this.getRouter().navTo("DetailX", {
                ID: oModel.getProperty(sPath + "/ID"),
                Key: oModel.getProperty(sPath + "/Key")
            });
        },

        onShowFullScreenDetailPage: function () {
            const oModel = this.getModel("model");

            oModel.setProperty("/ActionButtonsInfo/MidColumn/FullScreen", true);
            oModel.setProperty("/Layout", "MidColumnFullScreen");
        },

        /* ================ */
        /* Internal Methods */
        /* ================ */

        patternMatched: async function (oEvent) {
            const sID = oEvent.getParameter("arguments").ID;
            const oViewModel = this.getModel("model");
            const aFilters = [
                new Filter("ID", FilterOperator.EQ, sID)
            ];

            await this.onReadQuery("/...Set", aFilters, this.getModel())
                .then((oData) => {
                    oViewModel.setProperty("/Details", oData.results.map(oDetail => ({
                        ...oDetail,
                        Statu: true
                    })));
                })
                .catch(() => { })
                .finally(() => { });

            oViewModel.setProperty("/ActionButtonsInfo/MidColumn/Toolbar", true);
            oViewModel.setProperty("/ID", sID);
            oViewModel.setProperty("/Layout", "TwoColumnsMidExpanded");
        }

    });
});