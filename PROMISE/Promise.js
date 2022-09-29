sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Data: [],
				Value: ""
			});

			this.setModel(oModel, "model");

			// Clear Metadata
			jQuery.extend(true, {}, oData);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAsyncFunction: async function () {
			const sMethod = "GET";
			const oURLParameters = {
				ID: "X"
			};

			await this.callFunction("/...Set", sMethod, this.getModel(), oURLParameters)
				.then((oData) => {
					const sID = oData.GetData.ID;
				})
				.catch(() => { })
				.finally(() => { });
		},

		onCallFunction: function () {
			const sMethod = "GET";
			const oURLParameters = {
				ID: "X"
			};

			this.callFunction("/...Set", sMethod, this.getModel(), oURLParameters)
				.then((oData) => {
					const sID = oData.GetData.ID;
				})
				.catch(() => { })
				.finally(() => { });
		},

		onRunMultiPromise: function () {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const oExpand = {
				"$expand": "Main,List"
			};

			Promise.all([
				this.readMultiTable("/...Set", aFilters, oExpand, oModel)
					.then((oData) => {
						// oData.results[0];
						// oData.results[0].Main.results
						// oData.results[0].List.results,
					})
					.catch(() => { })
					.finally(() => { }),
				this.readMultiData("/...Set", aFilters, oModel)
					.then((oData) => {
						// oData.results[0];
					})
					.catch(() => { })
					.finally(() => { })
			])
				.catch(() => { })
				.finally(() => {
				});
		},

		onDeleteSingleData: function () {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			this.deleteSingleData(oKey, oModel)
				.then(() => {
					sap.ui.getCore().getMessageManager().getMessageModel().getData().forEach(oMessage => oMessage.setPersistent(true));
				})
				.catch(() => { })
				.finally(() => { });
		},

		onGetAssociationData: function () {
			const oModel = this.getModel();
			const sPath = oModel.createKey("/...Set", {
				ID: sID
			});
			const oExpand = {
				"$expand": "Items,Values"
			};

			this.getAssociationData(sPath, oExpand, oModel)
				.then((oData) => {
					const aItems = oData.Items.results;
					const aValues = oData.Values.results;
				})
				.catch(() => { })
				.finally(() => { });
		},

		onGetSingleData: function () {
			const oModel = this.getModel();
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			this.readSingleData(oKey, oModel)
				.then((oData) => { })
				.catch(() => { })
				.finally(() => { });
		},

		onGetMultiData: function () {
			const oViewModel = this.getModel("model");
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

			this.readMultiData("/...Set", aFilters, this.getModel())
				.then((oData) => {
					// oData.results[0];
				})
				.catch(() => { })
				.finally(() => { });
		},

		onGetMultiTable: function () {
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const oExpand = {
				"$expand": "Main,List"
			};

			this.readMultiTable("/...Set", aFilters, oExpand, this.getModel())
				.then((oData) => {
					// oData.results[0];
					// oData.results[0].Main.results
					// oData.results[0].List.results,
				})
				.catch(() => { })
				.finally(() => { });
		},

		onUpdateData: function () {
			const oData = {};
			const oModel = this.getModel();
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			this.updateData(oKey, oData, oModel)
				.then((oData) => { })
				.catch(() => { })
				.finally(() => { });
		},

		onSendMultiData: function (oEvent) {
			const oResourceBundle = this.getResourceBundle();
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const aData = oViewModel.getProperty("/Data");
			const oData = {
				ID: "X",
				Items: []
			};
			const aPaths = this.getView().getBindingContext().getProperty("Items");

			aData.forEach((xData) => {
				oData.Items.push(xData);
			});

			oData.Items = aPaths.map(sPath => oModel.getProperty("/" + sPath));

			// Match Binding Data
			oData = jQuery.extend(true, {}, aData.Items);

			// Clear Metadata
			delete oData.__metadata;

			// Clear Items Metadata
			oData.Items.forEach(oItem => {
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
						this.sendMultiData("/...Set", oData, this.getModel())
							.then((oResponse) => {
								const aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

								aMessages.forEach(oMessage => oMessage.setPersistent(true));

								if (aMessages.some(oMessage => oMessage.type === "Error")) {
									MessageToast.show(this.getResourceBundle().getText("errorOccured"));
									return;
								} else { }

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
							.catch(() => { })
							.finally(() => { });
					}
				}
			});
		},

		onSubmitChange: function () {
			const oResourceBundle = this.getResourceBundle();
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");

			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(oResourceBundle.getText("Info"), {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					styleClass: this.getOwnerComponent().getContentDensityClass(),
					onClose: (sAction) => {
						if (sAction === MessageBox.Action.OK) {
							this.submitChange()
								.then(() => {
									oModel.resetChanges();
								})
								.catch(() => { })
								.finally(() => { });
						}
					}
				});
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		callFunction: function (sEntity, sMethod, oModel, oURLParameters) {
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

		deleteSingleData: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.remove(sSet, mParameters);
			});
		},

		getAssociationData: function (sSet, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		updateData: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.update(sSet, oData, mParameters);
			});
		},

		readMultiData: function (sSet, aFilters, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					filters: aFilters,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		readSingleData: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, mParameters);
			});
		},

		readMultiTable: function (sSet, aFilters, oExpand, oModel) {
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

		sendMultiData: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.create(sSet, oData, mParameters);
			});
		},

		submitChange: function (oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const mParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.submitChanges(mParameters);
			});
		}

	});

});