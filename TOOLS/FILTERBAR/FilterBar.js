sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onSearch() {
			const sValue = this.getModel("model").getProperty("/Value");
		}

	});

});