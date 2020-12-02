sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function() {
			
			var oModel = new JSONModel({
				Value: ""	
			});
			
			this.setModel(oModel, "model");
			
		},
		
		onScanSuccess: function(oEvent) {
			if (!oEvent.getParameter("cancelled")) {
				var sValue = oEvent.getParameter("text");
			}
		}

	});

});