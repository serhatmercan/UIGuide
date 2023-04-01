sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
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

		onSFMultiCombobox: function(){
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

		clearItems: function(){
			this.byId("MCB").setSelectedItems([]);
		},

		getSelectedItems: function(){
			return this.byId("idMCB").getSelectedItems();
		}

	});

});