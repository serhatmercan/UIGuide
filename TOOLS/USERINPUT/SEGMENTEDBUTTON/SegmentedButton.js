sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: "SBIA"
			});

			this.setModel(oModel, "model");
		},

		onSelectionChange: function (oEvent) {
			const sKey = oEvent.getParameter("item").getKey();
		}

	});

});