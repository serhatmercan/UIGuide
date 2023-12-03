sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onPress: function (oEvent) {
			const oContext = oEvent.getSource().getBindingContext().getObject();
		},

		onSendParameter: function(sType, oEvent){

		}

	});

});