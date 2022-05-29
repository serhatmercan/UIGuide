sap.ui.define([
	"com/serhatmercan/controller/BaseController"	
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.controller.Main", {

		onGoToObject: function (oEvent) {
			this.getRouter().navTo("Object", {
				ID: oEvent.getSource().getBindingContext().getProperty("ID")
			});
		}

	});
});