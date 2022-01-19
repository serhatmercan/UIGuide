sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onInitSFB: function (oEvent) {
			oEvent.getSource().getAllFilterItems().filter(oFilter => oFilter.getName() === "ID")[0].setVisible(false);
			this.byId("idSFB").getAllFilterItems().filter(oFilter => oFilter.getName() === "ID")[0].setVisible(false);
		}

	});

});