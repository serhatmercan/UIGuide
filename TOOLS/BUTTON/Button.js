sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], (BaseController) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onPress(oEvent) {
			const oContext = oEvent.getSource().getBindingContext().getObject();
		},

		onSendParameter(sType, oEvent) { }

	});
});
