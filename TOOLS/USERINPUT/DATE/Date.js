sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Date: new Date(),
				Date1: null,
				Date2: null,
				DateFormatted: new Date(new Date() - new Date(50 * 24 * 60 * 60 * 1000)) // Day * Hour * Minute * Second * MiliSecond
			});

			this.setModel(oModel, "model");
		},

		onChangeDTI: function (oEvent) {
			var sDate = oEvent.getParameters().dateValue, // Input Value
				sYear = sDate.getFullYear(); // Input Value's Year
		}

	});

});