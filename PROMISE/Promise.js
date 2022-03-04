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

		asyncFunction: async function () {
			const oViewModel = this.getModel("viewModel");
			const sMethod = "GET";
			const oURLParameters = {
				ID: "X"
			};

			await this._callFunction("/...Set", sMethod, this.getModel(), oURLParameters)
				.then((oData) => {
					const sID = oData.GetData.ID;
				})
				.catch(() => {})
				.finally(() => {});
		},

		callFunction: function () {
			const oViewModel = this.getModel("viewModel");
			const sMethod = "GET";
			const oURLParameters = {
				ID: "X"
			};

			this._callFunction("/...Set", sMethod, this.getModel(), oURLParameters)
				.then((oData) => {
					const sID = oData.GetData.ID;
				})
				.catch(() => {})
				.finally(() => {});
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
			const oKey = this.getModel().createKey("/...Set", {
				ID: "X"
			});

			oViewModel.setProperty("/Busy", true);

			sap.ui.getCore().getMessageManager().removeAllMessages();

			this._deleteSingleData(oKey, this.getModel())
				.then(() => {
					sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(oMessage => oMessage.setPersistent(true));
				})
				.catch((err) => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		getAssociationData: function () {
			const oModel = this.getModel();
			const sPath = oModel.createKey("/...Set", {
				ID: sID
			});
			const oExpand = {
				"$expand": "Items,Values"
			};

			this._getAssociationData(sPath, oExpand, oModel)
				.then((oData) => {
					const aItems = oData.Items.results;
					const aValues = oData.Values.results;
				})
				.catch(() => {})
				.finally(() => {});
		},

		getSingleData: function () {
			const oModel = this.getModel();
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			this._readSingleData(oKey, oModel)
				.then((oData) => {})
				.catch(() => {})
				.finally(() => {});
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
				.catch(() => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		updateData: function () {
			const oData = {};
			const oModel = this.getModel();
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			this._updateData(oKey, oData, oModel)
				.then((oData) => {})
				.catch(() => {})
				.finally(() => {});
		},

		sendMultiData: function (oEvent) {
			const oResourceBundle = this.getResourceBundle();
			const oModel = this.getModel();
			const oViewModel = this.getModel("viewModel");
			const aData = oViewModel.getProperty("/Data");
			const oData = {
				ID: "X",
				to_Items: []
			};
			const aPaths = this.getView().getBindingContext().getProperty("to_Items");

			aData.forEach((Data) => {
				oData.to_Items.push(Data);
			});

			oData.to_Items = aPaths.map(sPath => oModel.getProperty("/" + sPath));

			// Match Binding Data
			oData = jQuery.extend(true, {}, aData.to_Items);

			// Clear Metadata
			delete oData.__metadata;

			// Clear Items Metadata
			oData.to_Items.forEach(oItem => {
				delete oItem.__metadata;
			});

			// Convert Integer Value to String
			Object.keys(oData).map(function (sFieldName) {
				if ((typeof oData[sFieldName]) === "number") {
					oData[sFieldName] = oData[sFieldName].toString();
				}
			});

			MessageBox.confirm(oResourceBundle.getText("Info"), {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				styleClass: this.getOwnerComponent().getContentDensityClass(),
				onClose: (sAction) => {
					if (sAction === MessageBox.Action.OK) {
						sap.ui.getCore().getMessageManager().removeAllMessages();
						oViewModel.setProperty("/Busy", true);

						this._sendMultiData("/...Set", oData, this.getModel())
							.then((oResponse) => {
								const aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

								aMessages.forEach(oMessage => oMessage.setPersistent(true));

								if (aMessages.some(oMessage => oMessage.type === "Error")) {
									MessageToast.show(this.getResourceBundle().getText("errorOccured"));
									return;
								} else {}

								oResponse.results.forEach(oResult => {
									sap.ui.getCore().getMessageManager().addMessages(
										new sap.ui.core.message.Message({
											message: oResult.Message,
											type: oResult.Type,
											persistent: false
										})
									);
								});
							})
							.catch(() => {})
							.finally(() => {
								oViewModel.setProperty("/Busy", false);
							});
					}
				}
			});
		},

		onSubmitChange: function () {
			const oResourceBundle = this.getResourceBundle();
			const oViewModel = this.getModel("viewModel");
			const oModel = this.getModel();

			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(oResourceBundle.getText("Info"), {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					styleClass: this.getOwnerComponent().getContentDensityClass(),
					onClose: (sAction) => {
						if (sAction === MessageBox.Action.OK) {
							sap.ui.getCore().getMessageManager().removeAllMessages();
							oViewModel.setProperty("/Busy", true);

							this._submitChange()
								.then(() => {
									oModel.resetChanges();
								})
								.catch((err) => {})
								.finally(() => {
									oViewModel.setProperty("/Busy", false);
								});
						}
					}
				});
			}
		},

		_callFunction: function (sEntity, sMethod, oModel, oURLParameters) {
			return new Promise((fnResolve, fnReject) => {
				const mParameters = {
					method: sMethod,
					urlParameters: oURLParameters,
					success: fnResolve,
					error: fnReject
				};

				oModel.callFunction(sEntity, mParameters);
			});
		},

		_deleteSingleData: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.remove(sSet, mParameters);
			});
		},

		_getAssociationData: function (sSet, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, oParameters);
			});
		},

		_updateData: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.update(sSet, oData, mParameters);
			});
		},

		_readMultiData: function (sSet, aFilters, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					filters: aFilters,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		_readSingleData: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		_readMultiTable: function (sSet, aFilters, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					filters: aFilters,
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		_sendMultiData: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.create(sSet, oData, mParameters);
			});
		},

		_submitChange: function (oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.submitChanges(mParameters);
			});
		},

	});

});