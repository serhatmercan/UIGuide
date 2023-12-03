sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/item",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Item, Filter, FilterOperator, JSONModel) {
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

		onBindItems: function () {
			const oSelect = this.byId("Select");
			const oFilter = new Filter("Key", FilterOperator.EQ, "X");
			const oTemplate = new Item({
				key: {
					parts: [{
						path: "ID"
					}, {
						path: "Key"
					}],
					formatter: this.formatter.createKey
				},
				text: "{Text}"
			});

			oSelect.unbindItems();
			oSelect.setEnabled(false);

			oSelect.bindItems({
				path: "/SHSet",
				filters: oFilter,
				template: oTemplate
			});
		},

		onChangeSelect: function (oEvent) {
			const oData = oEvent.getParameter("selectedItem").getBindingContext().getObject();
			const sKey = oEvent.getParameter("selectedItem").getBindingContext().getProperty("Key");
			const sSelectedKey = oEvent.getSource().getSelectedKey();
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