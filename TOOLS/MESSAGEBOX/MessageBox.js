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
			const oMBIcon = MessageBox.Icon;
			const oMBIconQuestion = oMBIcon.QUESTION;

			MessageBox.confirm(this.getText("Confirm"), {
				onClose: (sAction) => {
					if (sAction === oMBAction.OK) { }
				}
			});

			MessageBox.show("", {
				actions: [oMBAction.CLOSE],
				icon: oMBIcon.ERROR,
				styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
				title: "Message"
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