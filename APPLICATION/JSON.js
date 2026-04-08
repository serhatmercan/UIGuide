sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
], (BaseController, JSONModel) => {
    "use strict";

    const fnCreateData = () => ({
        Value: ""
    });

    return BaseController.extend("xxx.controller.JSON", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit() {
            const oViewModel = new JSONModel({
                Items: [],
            });
            this.setModel(oViewModel, "model");
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onAddData() {
            this.addModelCollectionItem("Items", fnCreateData());
        },

        onDeleteData(oEvent) {
            this.removeModelCollectionItem("Items", oEvent, "selectActionItemToDelete");
        }

        /* ================ */
        /* Internal Methods */
        /* ================ */

    });
});
