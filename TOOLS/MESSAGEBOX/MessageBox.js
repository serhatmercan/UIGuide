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
			const oMBAction = MessageBox.Action;

			// Confirm
			MessageBox.confirm(this.getText("Confirm"), {
				onClose: (sAction) => {
					if (sAction === oMBAction.OK) { }
				}
			});

			// Warning
			MessageBox.warning(this.getText("Warning"), {
				actions: [oMBAction.OK, oMBAction.CANCEL],
				emphasizedAction: oMBAction.OK,
				onClose: function (sAction) {
					if (sAction !== "OK") { } else { }
				}
			});
		}

	});

});