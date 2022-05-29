sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			// Change Cell Style
            this.byId("Table").getTable().getSelectedItem().getCells()[0].$().addClass("cell_color_green");

            // Change Selected Row Style
            this.byId("Table").getTable().getSelectedItems()[0].addStyleClass("row_color_red");

            // Change Selected Rows Style
            this.byId("Table").getTable().getSelectedItems().forEach(oItem => {
                oItem.addStyleClass("row_color_red");   
            });

            // Change All Rows Style
            this.byId("Table").getTable().getRows().forEach(oItem => {
                oItem.addStyleClass("row_color_red");   
            });
		}

	});

});