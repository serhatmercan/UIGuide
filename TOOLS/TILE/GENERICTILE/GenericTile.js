sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"serhatmercan/Util"
], function (BaseController, JSONModel, Util) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onGoToObject: function (oEvent) {
			const sID = oEvent.getSource().getId();
			const oRouter = this.getRouter();

			if (sID.includes("idGT1")) {
				oRouter.navTo("object", {
					Mode: "Obj"
				});
			}
		}

	});

});