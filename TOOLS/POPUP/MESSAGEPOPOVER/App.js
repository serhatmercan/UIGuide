sap.ui.define([], function () {
	"use strict";

	return BaseController.extend("serhatmercan.App", {

		onInit: function () {
			const oComponent = this.getOwnerComponent();
			const oModel = oComponent.getModel();
			const oViewModel = oComponent.getModel("viewModel");
			const oMessageManager = sap.ui.getCore().getMessageManager();

			this.getOwnerComponent().setModel(oMessageManager.getMessageModel(), "message");

			const fnSetAppNotBusy = () => {
				oViewModel.setProperty("/Busy", false);
			};

			oModel.metadataLoaded().then(fnSetAppNotBusy);
			oModel.attachMetadataFailed(fnSetAppNotBusy);
			oModel.attachRequestFailed(this._removeDuplicateMessages);
		},

		_removeDuplicateMessages: function () {
			const oMessageManager = sap.ui.getCore().getMessageManager();
			const oMessages = oMessageManager.getMessageModel().getData();
			let aMessageTexts = oMessages.map(oItem => oItem.message),
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