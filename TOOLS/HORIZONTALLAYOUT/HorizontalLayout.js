sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oModel = new JSONModel({
				Busy: false,
				Items: [{
					Header: "XYZ",
					SubHeader: "Abc",
					Logo: "Logo.png",
					URL: "url.com"
				}],
				Value: ""
			});
			this.setModel(oModel, "model");
		},

		onPressGT(oEvent) {
			const oModel = this.getModel("model");
			const sPath = oModel.getProperty(`${oEvent.getSource().getBindingContext("model").getPath()}/URL`);

			if (sPath) {
				window.open(sPath, "_blank");
			}
		}

	});

});