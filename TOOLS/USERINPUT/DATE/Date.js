sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Date: new Date(),
				Date1: null,
				Date2: null,
				DateFormatted: new Date(new Date() - new Date(50 * 24 * 60 * 60 * 1000)) // Day * Hour * Minute * Second * MiliSecond
			});

			this.setModel(oModel, "model");
		},

		onChangeDTI: function (oEvent) {
			const dDate = oEvent.getParameter("dateValue");
			const iYear = dDate.getFullYear();
		}

	});

});