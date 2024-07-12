sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (BaseController, Item, JSONModel, Filter, FilterOperator) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: "",
				Values: []
			});

			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onBindMCB() {
			const oMCB = this.byId("MCB");
			const oItem = new Item({
				key: "{Key}",
				text: "{Value}"
			});
			const oFilter = new Filter("Werks", FilterOperator.EQ, "X");

			oMCB.unbindItems();
			oMCB.setEnabled(false);
			oMCB.bindItems({
				path: "/SHSet",
				template: oItem,
				filters: oFilter
			});
			oMCB.setEnabled(true);
		},

		onSFMultiCombobox() {
			const aValues = this.getModel("model").getProperty("/Values");
			const aFilters = aValues.map(sValue => new Filter("ID", FilterOperator.EQ, sValue));

			this.byId("MCB").getBinding("items").filter(aFilters);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		clearItems() {
			this.byId("MCB").setSelectedItems([]);
		},

		getSelectedItems() {
			return this.byId("MCB").getSelectedItems();
		}

	});

});