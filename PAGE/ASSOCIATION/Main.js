sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/sm/kk/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.controller.Main", {

		onPress: function (oEvent) {
			this.getRouter().navTo("object", {
				objectId: oEvent.getSource().getBindingContext().getProperty("Id")
			});
		},

	});
});