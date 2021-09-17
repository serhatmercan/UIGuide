sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "viewModel");
		},

		deleteSingleData: function () {
			const oViewModel = this.getModel("viewModel");
			const oKey = this.getModel().createKey("...Set", {
				ID: "X"
			});

			oViewModel.setProperty("/Busy", true);

			this._deleteSingleData("/" + oKey, this.getModel())
				.then(() => {})
				.catch((err) => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		getMultiData: function () {
			const oViewModel = this.getModel("viewModel");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];

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

			MessageBox.confirm(oResourceBundle.getText("Info"), {
				onClose: (sAction) => {
					if (sAction === MessageBox.Action.OK) {
						oViewModel.setProperty("/Busy", true);

						this._sendCreateData("/...Set", oMaterial, this.getModel())
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