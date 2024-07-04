sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.sm.application.controller.DetailX", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit: function () {
            this.getRouter().getRoute("DetailX").attachPatternMatched(this.patternMatched, this);
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onCloseDetailXPage: function () {
            const oModel = this.getModel("model");

            oModel.setProperty("/ActionButtonsInfo/EndColumn/FullScreen", false);

            this.getRouter().navTo("Detail", {
                ID: oModel.getProperty("/ID")
            });
        },

        onExitFullScreenDetailXPage: function () {
            const oModel = this.getModel("model");

            oModel.setProperty("/ActionButtonsInfo/EndColumn/FullScreen", false);
            oModel.setProperty("/Layout", "ThreeColumnsMidExpanded");
        },

        onShowFullScreenDetailXPage: function () {
            const oModel = this.getModel("model");

            oModel.setProperty("/ActionButtonsInfo/EndColumn/FullScreen", true);
            oModel.setProperty("/Layout", "EndColumnFullScreen");
        },

        /* ================ */
        /* Internal Methods */
        /* ================ */

        patternMatched: async function (oEvent) {
            const oArgument = oEvent.getParameter("arguments");
            const sID = oArgument.ID;
            const sKey = oArgument.Key;
            const oViewModel = this.getModel("model");
            const aDetailXFilters = [
                new Filter("ID", FilterOperator.EQ, sID),
                new Filter("Key", FilterOperator.EQ, sKey)
            ];
            const aDetailFilters = [
                new Filter("ID", FilterOperator.EQ, sID)
            ];

            await this.onReadQuery("/...Set", aDetailFilters, this.getModel())
                .then((oData) => {
                    oViewModel.setProperty("/Details", oData.results);
                })
                .catch(() => { })
                .finally(() => { });

            await this.onReadQuery("/DetailXSet", aDetailXFilters, this.getModel())
                .then((oData) => {
                    oViewModel.setProperty("/DetailXs", oData.results);
                })
                .catch(() => { })
                .finally(() => { });

            oViewModel.setProperty("/ActionButtonsInfo/MidColumn/Toolbar", false);
            oViewModel.setProperty("/ID", sID);
            oViewModel.setProperty("/Key", sKey);
            oViewModel.setProperty("/Layout", "ThreeColumnsMidExpanded");
        }

    });
});