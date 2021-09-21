sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
], function (BaseController, JSONModel, Filter, FilterOperator, FilterType) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Data: [],
				Value: ""
			});

			this.setModel(oModel, "viewModel");

			// Clear Metadata
			jQuery.extend(true, {}, oData);
		},

		runMultiPromise: function () {
			const oViewModel = this.getModel("viewModel");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const oExpand = {
				"$expand": "to_main,to_list"
			};

			sap.ui.getCore().getMessageManager().removeAllMessages();

			Promise.all([
					this._readMultiTable("/...Set", aFilters, oExpand, this.getModel())
					.then((oData) => {
						// oData.results[0];
						// oData.results[0].to_main.results
						// oData.results[0].to_list.results,
					})
					.catch((err) => {})
					.finally(() => {
						oViewModel.setProperty("/Busy", false);
					}),
					this._readMultiData("/...Set", aFilters, this.getModel())
					.then((oData) => {
						// oData.results[0];
					})
					.catch((err) => {})
					.finally(() => {
						oViewModel.setProperty("/Busy", false);
					})
				])
				.catch(() => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		deleteSingleData: function () {
			const oViewModel = this.getModel("viewModel");
			const oKey = this.getModel().createKey("...Set", {
				ID: "X"
			});

			oViewModel.setProperty("/Busy", true);

			sap.ui.getCore().getMessageManager().removeAllMessages();

			this._deleteSingleData("/" + oKey, this.getModel())
				.then(() => {
					sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(oMessage => oMessage.setPersistent(true));
				})
				.catch((err) => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		getSingleData: function () {
			const oViewModel = this.getModel("viewModel");
			const oKey = this.getModel().createKey("...Set", {
				ID: "X"
			});

			sap.ui.getCore().getMessageManager().removeAllMessages();

			oViewModel.setProperty("/Busy", true);

			this._readSingleData("/" + oKey, this.getModel())
				.then((oData) => {})
				.catch((err) => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		getMultiData: function () {
			const oViewModel = this.getModel("viewModel");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X"),
			];
			const aXFilters = new Filter({
				filters: [
					new Filter("ID", FilterOperator.Contains, "X"),
					new Filter("Value", FilterOperator.Contains, "ABC")
				],
				and: false
			});

			sap.ui.getCore().getMessageManager().removeAllMessages();

			oViewModel.setProperty("/Busy", true);

			this._readMultiData("/...Set", aFilters, this.getModel())
				.then((oData) => {
					// oData.results[0];
				})
				.catch((err) => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		getMultiTable: function () {
			const oViewModel = this.getModel("viewModel");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const oExpand = {
				"$expand": "to_main,to_list"
			};

			sap.ui.getCore().getMessageManager().removeAllMessages();

			oViewModel.setProperty("/Busy", true);

			this._readMultiTable("/...Set", aFilters, oExpand, this.getModel())
				.then((oData) => {
					// oData.results[0];
					// oData.results[0].to_main.results
					// oData.results[0].to_list.results,
				})
				.catch((err) => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		sendMultiData: function (oEvent) {
			const oResourceBundle = this.getResourceBundle();
			const oViewModel = this.getModel("viewModel");
			const aData = oViewModel.getProperty("/Data");
			const oData = {
				ID: "X",
				to_Items: []
			};

			aData.forEach((Data) => {
				oData.to_Items.push(Data);
			});

			MessageBox.confirm(oResourceBundle.getText("Info"), {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				styleClass: this.getOwnerComponent().getContentDensityClass(),
				onClose: (sAction) => {
					if (sAction === MessageBox.Action.OK) {
						sap.ui.getCore().getMessageManager().removeAllMessages();
						oViewModel.setProperty("/Busy", true);

						this._sendCreateData("/...Set", oData, this.getModel())
							.then(() => {})
							.catch((err) => {})
							.finally(() => {
								oViewModel.setProperty("/Busy", false);
							});
					}
				}
			});
		},

		_deleteSingleData: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.remove(sSet, oParameters);
			});
		},

		_readMultiData: function (sSet, aFilters, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					filters: aFilters,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, oParameters);
			});
		},

		_readSingleData: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, oParameters);
			});
		},

		_readMultiTable: function (sSet, aFilters, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					filters: aFilters,
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, oParameters);
			});
		},

		_sendMultiData: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.create(sSet, oData, oParameters);
			});
		}

	});

});