sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("com.sm.application.controller.DetailX", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit() {
            this.getRouter().getRoute("DetailX").attachPatternMatched(this.patternMatched, this);
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onCloseDetailXPage() {
            const oModel = this.getModel("model");

            oModel.setProperty("/ActionButtonsInfo/EndColumn/FullScreen", false);

            this.getRouter().navTo("Detail", {
                ID: oModel.getProperty("/ID")
            });
        },

        onExitFullScreenDetailXPage() {
            const oModel = this.getModel("model");

            oModel.setProperty("/ActionButtonsInfo/EndColumn/FullScreen", false);
            oModel.setProperty("/Layout", "ThreeColumnsMidExpanded");
        },

        onShowFullScreenDetailXPage() {
            const oModel = this.getModel("model");

            oModel.setProperty("/ActionButtonsInfo/EndColumn/FullScreen", true);
            oModel.setProperty("/Layout", "EndColumnFullScreen");
        },

        /* ================ */
        /* Internal Methods */
        /* ================ */

        async patternMatched(oEvent) {
            const { ID: sID, Key: sKey } = oEvent.getParameter("arguments");
            const oViewModel = this.getModel("model");
            const aDetailXFilters = [
                new Filter("ID", FilterOperator.EQ, sID),
                new Filter("Key", FilterOperator.EQ, sKey)
            ];
            const aDetailFilters = [
                new Filter("ID", FilterOperator.EQ, sID)
            ];

            try {
                const [oDetailsData, oDetailXsData] =
                    await Promise.all([
                        this.onReadQuery("/...Set", aDetailFilters, this.getModel()),
                        this.onReadQuery("/DetailXSet", aDetailXFilters, this.getModel())
                    ]);

                oViewModel.setProperty("/Details", oDetailsData.results);
                oViewModel.setProperty("/DetailXs", oDetailXsData.results);
            }
            catch (oError) { }
            finally {
                oViewModel.setProperty("/ActionButtonsInfo/MidColumn/Toolbar", false);
                oViewModel.setProperty("/ID", sID);
                oViewModel.setProperty("/Key", sKey);
                oViewModel.setProperty("/Layout", "ThreeColumnsMidExpanded");
            }
        }

    });
});