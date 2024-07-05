sap.ui.define([
    "com/serhatmercan/controller/BaseController",
], (BaseController) => {
    "use strict";

    return BaseController.extend("com.serhatmercan.Controller", {

        onInit() {
            const oTable = this.byId("Table").getTable();

            // Change Cell Style
            const oSelectedItem = oTable.getSelectedItem();
            if (oSelectedItem) {
                oSelectedItem.getCells()[0].$().addClass("cell_color_green");
            }

            // Change Selected Row Style
            const aSelectedItems = oTable.getSelectedItems();
            if (aSelectedItems.length > 0) {
                aSelectedItems.forEach(oItem => oItem.addStyleClass("row_color_red"));
            }

            // Change All Rows Style
            oTable.getRows().forEach(oItem => oItem.addStyleClass("row_color_red"));
        },

        removeStyle(oEvent) {
            oEvent.getSource().removeStyleClass("row_color_red");
        }

    });
});
