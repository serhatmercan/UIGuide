sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/FormattedText",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], (BaseController, FormattedText, MessageBox, JSONModel) => {
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
			const sInfoMessage = this.getText("infoMessage"); // infoMessage(i18n): First Line.<br>Second Line Begin <strong>Stop</strong> Second Line End.<br>Third Line.
			const oInfoMessageFT = new FormattedText("InfoMsgFT", {
				htmlText: sInfoMessage
			});

			// Confirmation
			MessageBox.confirm(this.getText("Confirm"), {
				onClose: (sAction) => {
					if (sAction === oMBAction.OK) { }
				}
			});

			// Default
			MessageBox.show("", {
				actions: [oMBAction.CLOSE],
				icon: oMBIcon.ERROR,
				styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
				title: "Message"
			});

			// Information w/ Formatted
			MessageBox.show(oInfoMessageFT, {
				actions: [oMBAction.OK],
				defaultAction: oMBAction.OK,
				icon: oMBIcon.INFORMATION,
				title: "Information"
			});

			// Warning
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