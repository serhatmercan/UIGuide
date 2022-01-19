sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.controller.App", {

		onInit: function () {
			this.attachBusy();
		},

		attachBusy: function () {
			const oModel = this.getOwnerComponent().getModel();
			const fnRequestSent = function () {
				sap.ui.getCore().getMessageManager().removeAllMessages();
				sap.ui.core.BusyIndicator.show();
			};
			const fnRequestReceived = function () {
				sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(oMessage => oMessage.setPersistent(true));
				this._removeDuplicateMessages();
				sap.ui.core.BusyIndicator.hide();
			}.bind(this);

			oModel.attachMetadataFailed(fnRequestReceived);

			oModel.metadataLoaded().then(function () {
				oModel.attachRequestSent(fnRequestSent);
				oModel.attachRequestCompleted(fnRequestReceived);
				oModel.attachRequestFailed(fnRequestReceived);
				oModel.attachBatchRequestSent(fnRequestSent);
				oModel.attachBatchRequestCompleted(fnRequestReceived);
				oModel.attachBatchRequestFailed(fnRequestReceived);
			}.bind(this));
		},

		_removeDuplicateMessages: function () {
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
	});

});