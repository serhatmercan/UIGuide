sap.ui.define([
	"./BaseController",
	"sap/ui/core/BusyIndicator"
], (BaseController, BusyIndicator) => {
	"use strict";

	return BaseController.extend("xxx.controller.App", {

		async onInit() {
			const oComponent = this.getOwnerComponent();

			oComponent.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

			this.attachBusy();
			this.getView().addStyleClass(oComponent.getContentDensityClass());
		},

		attachBusy() {
			const oModel = this.getOwnerComponent().getModel();
			const fnRequestSent = () => {
				BusyIndicator.show();
				sap.ui.getCore().getMessageManager().removeAllMessages();
			};
			const fnRequestReceived = () => {
				const oMessageManager = sap.ui.getCore().getMessageManager();
				const oMessageModel = oMessageManager.getMessageModel();

				oMessageModel.getData().forEach(oMessage => oMessage.setPersistent(true));

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
			const oMessages = oMessageManager.getMessageModel().getData();
			const aUniqueMessages = [...new Set(oMessages.map(oItem => oItem.message))];
			const aMessages = aUniqueMessages.map(sMessage =>
				oMessages.find(oMessage => oMessage.message === sMessage)
			);

			oMessageManager.getMessageModel().setData(aMessages);
		}
	});
});