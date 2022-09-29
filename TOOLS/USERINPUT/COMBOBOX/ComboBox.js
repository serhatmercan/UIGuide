sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Items,
					Value: ""
				}), "model");

			this.byId("ComboBox").fireSelectionChange({
				selectedItem: sID
			});

			this.getOwnerComponent().getModel().attachRequestCompleted(this.attachRequestCompleted, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onChangeCB: function (oEvent) {
			const oComboBox = oEvent.getSource();
			const oItem = oEvent.getSource().getSelectedItem();
			const oViewModel = this.getModel("model");
			const oObject = oItem.getBindingContext().getObject();
			const sAdditionalText = oItem.getProperty("additionalText");
			const sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();
			const sValue = this.getModel("model").getProperty("/Value");
			const sText = oItem.getProperty("text");
			let aFilters = [];

			oViewModel.setProperty(sPath + "/Value", sText);

			aFilters = [
				new Filter("Value", FilterOperator.EQ, sValue)
			];

			oComboBox.getBinding("items").filter(aFilters);

			oItem ? oComboBox.setValueState("None") : oComboBox.setValueState("Error");
		},

		onCheckValue: function (oEvent) {
			const oComboBox = oEvent.getSource();

			oComboBox.setValueState(oComboBox.getSelectedItem() ? "None" : "Error");
		},

		onFilterTableRow: function (oEvent) {
			const aRows = this.byId("Table").getItems();
			const oSource = oEvent.getSource();
			const oItem = oSource.getSelectedItem();
			const iIndex = oSource.getParent().getBindingContext("model").getPath().slice(-1);
			let aFilters = [];

			if (oSource) {
				aFilters = [
					new Filter("ID", FilterOperator.EQ, oSource.getAdditionalText())
				];

				aRows.forEach((oRow) => {
					oRow.getCells()[3].getBinding("items").filter(aFilters);
				});
			}
		},

		onLoadItemsCB: function () {
			const aFilters = [
				new Filter("Value", FilterOperator.EQ, "X")
			];

			oEvent.getSource().getBinding("items").filter(aFilters);
		},

		onSelectionChangeCB: function (oEvent) {
			const oSelectedItem = oEvent.getParameter("selectedItem");
			const oItem = oEvent.getSource();
			const sKey = oItem.getKey();
			const sValue = oItem.getValue();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		attachRequestCompleted: function () {
			setTimeout(() => {
				this.byId("ComboBox").fireChange();
				this.byId("ComboBox").getInnerControls()[0].getBinding("items").filter([
					new Filter("ID", FilterOperator.EQ, this.getModel().getProperty(this.getView().getBindingContext().getPath() + "/ID"))
				]);
			}, 500);
		}

	});

});