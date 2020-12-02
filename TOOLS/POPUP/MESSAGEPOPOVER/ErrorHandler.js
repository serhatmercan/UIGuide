sap.ui.define([
	"sap/ui/base/Object"
], function(UI5Object) {
	"use strict";
	return UI5Object.extend("com.serhatmercan.controller.ErrorHandler", {
		
		constructor: function(oComponent) {
			
			this._oModel.attachRequestFailed(function(oEvent) {
				
				var oParams = oEvent.getParameters();
				
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
						"Cannot POST") === 0)) {
					// this._showServiceError(oParams.response); // Remove -> Service Error Popup 
				}
				
			}, this);
			
		},
		
	});
});