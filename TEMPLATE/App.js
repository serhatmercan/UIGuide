sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.App", {

		onInit: function () {
			const oModel = this.getOwnerComponent().getModel();
			const oViewModel = this.getOwnerComponent().getModel("viewModel");
			const fnSetAppNotBusy = () => {
				oViewModel.setProperty("/Busy", false);
			};

			this.getOwnerComponent().setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

			oModel.metadataLoaded().then(fnSetAppNotBusy);
			oModel.attachMetadataFailed(fnSetAppNotBusy);
			oModel.attachRequestFailed(this._removeDuplicateMessages);

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		_removeDuplicateMessages: function () {
			const oMessageManager = sap.ui.getCore().getMessageManager();
			const oMessages = oMessageManager.getMessageModel().getData();
			const aMessageTexts = oMessages.map(oItem => oItem.message);
			let aMessages = [];

			aMessageTexts = [...new Set(aMessageTexts)];

			const fnFilterDuplicates = (oMessage) => {
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