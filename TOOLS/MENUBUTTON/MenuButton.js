sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				MenuStatu: false,
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");
		},

		onShowMI(sType, oEvent) { }

	});
});