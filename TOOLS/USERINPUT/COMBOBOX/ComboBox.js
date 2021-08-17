sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");

		},

		onChangeCB: function (oEvent) {
			let oItem = oEvent.getSource().getSelectedItem(),
				oObject = oItem.getBindingContext().getObject(),
				sText = oItem.getProperty("text"),
				sAdditionalText = oItem.getProperty("additionalText"),
				sPath = oEvent.getSource().getParent().getBindingContext("model").getPath(),
				oModel = this.getView().getModel("model");

			oModel.setProperty(sPath + "/Value", sText);

			var oComboBox = this.byId("idComboBox"),
				sValue = this.getModel("model").getProperty("/Value"),
				aFilters = [];

			if (sValue) {
				aFilters.push(new Filter("Value", FilterOperator.EQ, sValue));
			}

			oComboBox.getBinding("items").filter(aFilters);
		},

		onCheckValue: function (oEvent) {
			let oComboBox = oEvent.getSource(),
				oItem = oEvent.getSource().getSelectedItem();

			if (!oItem) {
				let oModel = this.getModel("model");
				oColorCodeModel.setProperty("/Value", "");
				oColorCodeModel.refresh(true);
				oComboBox.setValueState("Error");
			} else {
				oComboBox.setValueState("None");
			}
		},

		onLoadItemsCB: function () {
			const aFilters = [
				new Filter("Value", FilterOperator.EQ, "X")
			];

			oEvent.getSource().getBinding("items").filter(aFilters);
		},

		// Trigger to ComboBox
		this.byId("idComboBox").fireSelectionChange({
			selectedItem: sID
		});

	});

});