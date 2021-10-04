sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var aList = [{
				Key: "1",
				Text: "One"
			}, {
				Key: "2",
				Text: "Two"
			}, {
				Key: "3",
				Text: "Three"
			}];

			oListModel = new JSONModel(aList);
			this.setModel(oListModel, "listModel");

		},

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
			const aData = this.getView().getBindingContext().getProperty("to_Item").map(sPath => oModel.getProperty("/" + sPath));
		}

	});

});