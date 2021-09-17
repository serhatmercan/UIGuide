sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onShowMB: function () {
			const oResourceBundle = this.getResourceBundle();

			// Confirm
			MessageBox.confirm(this.getResourceBundle().getText("Confirm"), {
				onClose: (sAction) => {
					if (sAction === MessageBox.Action.OK) {}
				}
			});

			// Warning
			MessageBox.warning(this.getResourceBundle().getText("Warning"), {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction !== "OK") {} else {}
				}
			});
		}

	});

});