sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			sap.ui.core.BusyIndicator.show();
			sap.ui.core.BusyIndicator.hide();
		}

	});

});