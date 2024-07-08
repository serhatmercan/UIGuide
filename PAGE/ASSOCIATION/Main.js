sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], (BaseController) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.controller.Main", {

		onGoToObject(oEvent) {
			const ID = oEvent.getSource().getBindingContext().getProperty("ID");
			this.getRouter().navTo("Object", { ID });
		}

	});
});