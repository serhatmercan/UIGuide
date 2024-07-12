/*global location */
sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/ui/core/message/Message",
	"sap/ui/core/message/MessageType"
], (BaseController, MessageToast, Message, MessagePopoverItem, MessageType, MessagePopover) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oMessageManager = sap.ui.getCore().getMessageManager();
			const oMessageModel = oMessageManager.getMessageModel();
			const oMessagePO = this.byId("MessagePO");

			oMessageManager.removeAllMessages();

			oMessageModel.bindList("/", undefined, []).attachChange(() => {
				if (oMessageModel.getData().length) {
					oMessagePO.firePress();
				}
			});

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onCheckMessages() {
			const aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

			aMessages.forEach(oMessage => oMessage.setPersistent(true));

			if (aMessages.some(oMessage => oMessage.type === MessageType.Error)) {
				MessageToast.show(this.getText("errorOccurred"));
			}
		},

		onShowMessages(oEvent) {
			const oMessagesButton = oEvent.getSource();

			if (!this.oMessagePopover) {
				this.oMessagePopover = new MessagePopover({
					items: {
						path: "message>/",
						template: new MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});

				oMessagesButton.addDependent(this.oMessagePopover);
			}

			this.oMessagePopover.toggle(oMessagesButton);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addDialog() {
			this.oDialog.setModel(this.getModel("message"), "message");
		},

		addMessages() {
			const oModel = this.getModel();
			const sMessage = this.getText("sMessage");
			const oNewMessage = new Message({
				message: sMessage,
				processor: oModel,
				technical: true,
				type: MessageType.Error
			});

			sap.ui.getCore().getMessageManager().addMessages(oNewMessage);
			MessageToast.show(this.getText("errorOccurred"));
		},

		addRequestMessages(oError) {
			const aErrorMessages = JSON.parse(oError.responseText)?.error?.innererror?.errordetails;
			const oModel = this.getModel();

			sap.ui.getCore().getMessageManager().removeAllMessages();

			const aMessages = aErrorMessages.map(oErrorMessage =>
				new Message({
					code: oErrorMessage.code,
					message: oErrorMessage.message,
					processor: oModel,
					technical: true,
					type: MessageType.Error
				})
			);

			sap.ui.getCore().getMessageManager().addMessages(aMessages);
			MessageToast.show(this.getResourceBundle().getText("errorOccurred"));
		},

		autoShowMessages() {
			if (this.getOwnerComponent().getModel("message").getData().length) {
				setTimeout(() => {
					this.byId("MessagePO").firePress();
				}, 100);
			}
		}

	});

});