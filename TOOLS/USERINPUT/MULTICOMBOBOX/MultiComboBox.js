sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: "",
				Values: []
			});

			this.setModel(oModel, "model");
		},

		onSelectionFinishMCB: function () {
			const aValues = this.getModel("model").getProperty("/Values");
			let aFilters = [];

			aValues.forEach((Value) => {
				aFilters.push(new Filter("ID", FilterOperator.EQ, Value));
			});

			this.byId("idCB").getBinding("items").filter(aFilters);
		}

	});

});