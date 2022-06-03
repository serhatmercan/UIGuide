sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */
	
		onInit: function () {
			this.setModel(new JSONModel({
				Key: "",
				Items: [{
					Key: "1",
					Text: "One"
				}, {
					Key: "2",
					Text: "Two"
				}, {
					Key: "3",
					Text: "Three"
				}]
			}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onChangeSelect: function (oEvent) {
			const oData = oEvent.getParameter("selectedItem").getBindingContext().getObject();
			const sKey = oEvent.getParameter("selectedItem").getBindingContext().getProperty("Key");
			let sType;

			switch (oEvent.getSource().getSelectedItem().getKey()) {
			case "idSIKey":
				sType = "1H";
				break;
			default:
				break;
			}

			// Get Smart Table Binding Value
			const sValue = oEvent.getParameter("selectedItem").getKey();
			const sRowPath = oEvent.getSource().getBindingContext().getPath();
			const oModel = this.getModel();
			const oRowData = oModel.getProperty(sRowPath);
			const aData = this.getView().getBindingContext().getProperty("Items").map(sPath => oModel.getProperty("/" + sPath));
		}

	});

});