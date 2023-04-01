/*global location */
sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast"
], function (BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
			const oMessagePO = this.byId("MessagePO");

			sap.ui.getCore().getMessageManager().removeAllMessages();

			oMessageModel.bindList("/", undefined, []).attachChange((oEvent) => {
				if (oMessageModel.getData().length) {
					oMessagePO.firePress();
				}
			}, this);

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		addDialog: function () {
			this.oDialog.setModel(this.getModel("message"), "message");
		},

		addMessages: function () {
			const oModel = this.getModel();
			const sMessage = this.getResourceBundle().getText("sMessage");
			const aMessages = [];

			aMessages.push(
				new sap.ui.core.message.Message({
					message: sMessage,
					processor: oModel,
					technical: true,
					type: sap.ui.core.MessageType.Error
				})
			);

			sap.ui.getCore().getMessageManager().addMessages(aMessages);
			MessageToast.show(that.getResourceBundle().getText("errorOccurred"));
		},

		addRequestMessages: function (oError) {
			const aErrorMessages = JSON.parse(oError.responseText).error.innererror.errordetails;
			const oModel = this.getModel();
			let aMessages = [];

			sap.ui.getCore().getMessageManager().removeAllMessages();

			aErrorMessages.forEach(oErrorMessage => {
				aMessages.push(
					new sap.ui.core.message.Message({
						code: oErrorMessage.code,
						message: oErrorMessage.message,
						processor: oModel,
						technical: true,
						type: sap.ui.core.MessageType.Error
					})
				);
			});

			sap.ui.getCore().getMessageManager().addMessages(aMessages);
			MessageToast.show(that.getResourceBundle().getText("errorOccurred"));
		},

		autoShowMessages: function () {
			if (this.getOwnerComponent().getModel("message").getData().length) {
				setTimeout(() => {
					this.byId("MessagePO").firePress();
				}, 100);
			}
		},

		onCheckMessages: function () {
			const aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

			aMessages.forEach(oMessage => oMessage.setPersistent(true));

			if (aMessages.some(oMessage => oMessage.type === "Error")) {
				MessageToast.show(this.getResourceBundle().getText("errorOccured"));
			} else { }
		},

		onShowMessages: function (oEvent) {
			const oMessagesButton = oEvent.getSource();

			if (!this.oMessagePopover) {
				this.oMessagePopover = new sap.m.MessagePopover({
					items: {
						path: "message>/",
						template: new sap.m.MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});

				oMessagesButton.addDependent(this.oMessagePopover);
			}

			this.oMessagePopover.toggle(oMessagesButton);
		}

	});

});