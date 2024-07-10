sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/BusyIndicator"
], (BaseController, BusyIndicator) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			BusyIndicator.show();
			BusyIndicator.hide();
		}

	});
});
