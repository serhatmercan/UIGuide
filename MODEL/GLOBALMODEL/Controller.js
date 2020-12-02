/*global location */
sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		setGlobalModelData: function () {
			var oGlobalModel = this.getModel("globalModel");
			
			oGlobalModel.setProperty("/GlobalData", "Serhat");
		},

		getGlobalModelData: function () {
			var oGlobalModel = this.getModel("globalModel"),
				sGlobalData = oGlobalModel.getProperty("/GlobalData");
		},

	});

});