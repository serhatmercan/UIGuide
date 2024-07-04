sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/item",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, Item, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: "",
				Values: []
			});

			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onBindMCB: function () {
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

		onSFMultiCombobox: function () {
			const aValues = this.getModel("model").getProperty("/Values");
			let aFilters = [];

			aValues.forEach((sValue) => {
				aFilters.push(new Filter("ID", FilterOperator.EQ, sValue));
			});

			this.byId("MCB").getBinding("items").filter(aFilters);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		clearItems: function () {
			this.byId("MCB").setSelectedItems([]);
		},

		getSelectedItems: function () {
			return this.byId("idMCB").getSelectedItems();
		}

	});

});