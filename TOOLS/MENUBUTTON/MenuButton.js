sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oModel = new JSONModel({
				Busy: false,
				MenuStatu: false,
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onShowMI(sType, oEvent) { }

	});
});