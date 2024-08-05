sap.ui.define([
	"./BaseController",
	"sap/ui/core/BusyIndicator"
], (BaseController, BusyIndicator) => {
	"use strict";

	return BaseController.extend("xxx.controller.App", {

		onInit() {
			const oComponent = this.getOwnerComponent();
			const oMessageModel = sap.ui.getCore().getMessageManager()?.getMessageModel();

			oComponent.setModel(oMessageModel, "message");

			this.attachBusy();

			this.getView().addStyleClass(oComponent.getContentDensityClass());
		},

		attachBusy() {
			const oModel = this.getOwnerComponent().getModel();
			const fnRequestSent = () => {
				BusyIndicator.show();
				sap.ui.getCore().getMessageManager()?.removeAllMessages();
			};
			const fnRequestReceived = () => {
				const oMessageManager = sap.ui.getCore().getMessageManager();
				const oMessageModel = oMessageManager?.getMessageModel();
				const aMessages = oMessageModel?.getData();

				aMessages.forEach(oMessage => oMessage.setPersistent(true));

				this.removeDuplicateMessages();

				BusyIndicator.hide();
			};

			oModel.attachMetadataFailed(fnRequestReceived);
			oModel.metadataLoaded().then(() => {
				oModel.attachRequestSent(fnRequestSent);
				oModel.attachRequestCompleted(fnRequestReceived);
				oModel.attachRequestFailed(fnRequestReceived);
				oModel.attachBatchRequestSent(fnRequestSent);
				oModel.attachBatchRequestCompleted(fnRequestReceived);
				oModel.attachBatchRequestFailed(fnRequestReceived);
			});
		},

		removeDuplicateMessages() {
			const oMessageManager = sap.ui.getCore().getMessageManager();
			const oMessageModel = oMessageManager?.getMessageModel();
			const aModelMessages = oMessageModel?.getData();

			if (!aModelMessages) return;

			const aUniqueMessages =
				Array.from(new Set(aModelMessages.map(oItem => oItem.message))).map(sMessage => aModelMessages.find(oMessage => oMessage.message === sMessage));

			oMessageModel.setData(aUniqueMessages);
		}

	});

});