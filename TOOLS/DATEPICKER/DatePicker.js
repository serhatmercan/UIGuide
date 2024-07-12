sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oViewModel = new JSONModel({
				MaxDate: new Date(),
				MinDate: new Date(),
				Value: new Date()
			});

			this.setModel(oViewModel, "model");
		},

		checkIsValidDate() {
			return this.byId("DatePicker").isValidValue(); // => True / False
		}

	});

});