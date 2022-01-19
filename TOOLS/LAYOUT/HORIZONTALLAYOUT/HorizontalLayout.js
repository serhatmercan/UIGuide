sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.setModel(
				new JSONModel({
					Busy: false,
					Items: [{
						Header: "XYZ",
						SubHeader: "Abc",
						Logo: "Logo.png",
						URL: "url.com"
					}],
					Value: ""
				}), "model"
			);
		},

		onPressGT: function (oEvent) {
			const sPath = this.getView().getModel("model").getProperty(oEvent.getSource().getBindingContext("model").getPath() + "/URL");

			if (sPath) {
				window.open(sPath, "_blank");
			}
		}

	});

});