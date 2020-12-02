/*global location */
sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		getGlobalModelData: function () {
			var oGlobalModel = this.getModel("globalModel"),
				oGlobalData = oGlobalModel.getProperty("/GlobalObject");
		},

	});

});