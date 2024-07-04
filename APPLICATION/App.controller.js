sap.ui.define([
	"./BaseController",
	"sap/ui/core/BusyIndicator"
<<<<<<< HEAD
], (BaseController, BusyIndicator) => {
=======
], function (BaseController, BusyIndicator) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
	"use strict";

	return BaseController.extend("xxx.controller.App", {

<<<<<<< HEAD
		async onInit() {
			const oComponent = this.getOwnerComponent();

			oComponent.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

			this.attachBusy();
			this.getView().addStyleClass(oComponent.getContentDensityClass());
		},

		attachBusy() {
=======
		onInit: function () {
			this.getOwnerComponent().setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
			this.attachBusy();
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		attachBusy: function () {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			const oModel = this.getOwnerComponent().getModel();
			const fnRequestSent = () => {
				BusyIndicator.show();
				sap.ui.getCore().getMessageManager().removeAllMessages();
			};
			const fnRequestReceived = () => {
<<<<<<< HEAD
				const oMessageManager = sap.ui.getCore().getMessageManager();
				const oMessageModel = oMessageManager.getMessageModel();

				oMessageModel.getData().forEach(oMessage => oMessage.setPersistent(true));

				this.removeDuplicateMessages();

=======
				sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(oMessage => oMessage.setPersistent(true));
				this.removeDuplicateMessages();
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				BusyIndicator.hide();
			};

			oModel.attachMetadataFailed(fnRequestReceived);
<<<<<<< HEAD
			oModel.metadataLoaded().then(() => {
=======

			oModel.metadataLoaded().then(function () {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
				oModel.attachRequestSent(fnRequestSent);
				oModel.attachRequestCompleted(fnRequestReceived);
				oModel.attachRequestFailed(fnRequestReceived);
				oModel.attachBatchRequestSent(fnRequestSent);
				oModel.attachBatchRequestCompleted(fnRequestReceived);
				oModel.attachBatchRequestFailed(fnRequestReceived);
			});
		},

<<<<<<< HEAD
		removeDuplicateMessages() {
			const oMessageManager = sap.ui.getCore().getMessageManager();
			const oMessages = oMessageManager.getMessageModel().getData();
			const aUniqueMessages = [...new Set(oMessages.map(oItem => oItem.message))];
			const aMessages = aUniqueMessages.map(sMessage =>
				oMessages.find(oMessage => oMessage.message === sMessage)
			);

			oMessageManager.getMessageModel().setData(aMessages);
		}
=======
		removeDuplicateMessages: function () {
			let oMessageManager = sap.ui.getCore().getMessageManager(),
				oMessages = oMessageManager.getMessageModel().getData(),
				aMessageTexts = oMessages.map(oItem => oItem.message),
				aMessages = [];

			aMessageTexts = [...new Set(aMessageTexts)];

			let fnFilterDuplicates = (oMessage) => {
				if (aMessageTexts.includes(oMessage.message)) {
					aMessageTexts.splice(aMessageTexts.indexOf(oMessage.message), 1);
					return oMessage;
				} else {
					return false;
				}	
			};

			aMessages = oMessages.filter(fnFilterDuplicates);
			oMessageManager.getMessageModel().setData(aMessages);
		}

>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
	});
});