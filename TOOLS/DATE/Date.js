sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oModel = new JSONModel({
				Date: new Date(),
				Date1: null,
				Date2: null,
				DateFormatted: new Date(Date.now() - (50 * 24 * 60 * 60 * 1000))
			});

			this.setModel(oModel, "model");
		},

		onChangeDTI(oEvent) {
			const dDate = oEvent.getParameter("dateValue");
			const iYear = dDate.getFullYear();
		}

	});

});