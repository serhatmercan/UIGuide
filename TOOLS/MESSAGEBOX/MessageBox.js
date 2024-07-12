sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageBox, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onShowMB() {
			const oMBAction = MessageBox.Action;

			MessageBox.confirm(this.getText("Confirm"), {
				onClose: (sAction) => {
					if (sAction === oMBAction.OK) { }
				}
			});

			MessageBox.warning(this.getText("Warning"), {
				actions: [oMBAction.OK, oMBAction.CANCEL],
				emphasizedAction: oMBAction.OK,
				onClose: (sAction) => {
					if (sAction === oMBAction.OK) { }
					else { }
				}
			});
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});
});