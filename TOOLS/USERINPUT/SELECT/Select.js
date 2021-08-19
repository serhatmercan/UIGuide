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
			const sKey = oEvent.getParameter("selectedItem").getBindingContext().getProperty("Key");
			let sType;

			switch (oEvent.getSource().getSelectedItem().getKey()) {
			case "idSIKey":
				sType = "1H";
				break;
			default:
				break;
			}
		}

	});

});