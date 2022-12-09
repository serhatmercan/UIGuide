sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Filter, FilterOperator, FilterType, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			jQuery.extend(true, {}, oData);
		},

		onAsyncFunction: async function () {
			const oViewModel = this.getModel("model");
			const sMethod = "GET";
			const oURLParameters = {
				ID: "X"
			};

			await this.onCallFunction("/...Set", sMethod, this.getModel(), oURLParameters)
				.then((oData) => {
					const sID = oData.GetData.ID;
				})
				.catch(() => { })
				.finally(() => {
					this.onFireToShowMessages();
				});
		},

		onCallFunction: function () {
			const oViewModel = this.getModel("model");
			const sMethod = "GET";
			const oURLParameters = {
				ID: "X"
			};

			this.onCallFunction("/...", sMethod, this.getModel(), oURLParameters)
				.then((oData) => {
					const sID = oData.GetData.ID;
				})
				.catch(() => { })
				.finally(() => {
					this.onFireToShowMessages();
				});
		},

		onCreate: function (oEvent) {
			const oResourceBundle = this.getResourceBundle();
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const aData = oViewModel.getProperty("/Data");
			const oData = {
				ID: "X",
				Items: []
			};
			const aPaths = this.getView().getBindingContext().getProperty("Items");

			aData.forEach((Data) => {
				oData.Items.push(Data);
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
						this.onCreate("/...Set", oData, this.getModel())
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
							.finally(() => {
								this.onFireToShowMessages();
							});
					}
				}
			});
		},

		onDelete: function () {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			this.onDelete(oKey, oModel)
				.then(() => { })
				.catch(() => { })
				.finally(() => { });
		},

		onRead: function () {
			const oModel = this.getModel();
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			this.onRead(oKey, oModel)
				.then((oData) => { })
				.catch(() => { })
				.finally(() => {
					this.onFireToShowMessages();
				});
		},

		onReadAssociation: function () {
			const oModel = this.getModel();
			const sPath = oModel.createKey("/...Set", {
				ID: sID
			});
			const oExpand = {
				"$expand": "Items,Values"
			};

			this.onReadAssociation(sPath, oExpand, oModel)
				.then((oData) => {
					const aItems = oData.Items.results;
					const aValues = oData.Values.results;
				})
				.catch(() => { })
				.finally(() => {
					this.onFireToShowMessages();
				});
		},

		onReadExpanded: function () {
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const oExpand = {
				"$expand": "Items,Values"
			};

			this.onReadExpanded("/...Set", aFilters, oExpand, this.getModel())
				.then((oData) => {
					// oData.results[0];
					// oData.results[0].Items.results
					// oData.results[0].Values.results,
				})
				.catch(() => { })
				.finally(() => {
					this.onFireToShowMessages();
				});
		},

		onReadQuery: function () {
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

			this.onReadQuery("/...Set", aFilters, this.getModel())
				.then((oData) => {
					// oData.results[0];
				})
				.catch(() => { })
				.finally(() => {
					this.onFireToShowMessages();
				});
		},

		onRunMultiPromise: function () {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const oExpand = {
				"$expand": "Items,Values"
			};

			Promise.all([
				this.onReadExpanded("/...Set", aFilters, oExpand, oModel)
					.then((oData) => {
						// oData.results[0];
						// oData.results[0].Items.results
						// oData.results[0].Values.results,
					})
					.catch(() => { })
					.finally(() => { }),
				this.onReadQuery("/...Set", aFilters, oModel)
					.then((oData) => {
						// oData.results[0];
					})
					.catch(() => { })
					.finally(() => { })
			]).catch(() => { }).finally(() => {
				this.onFireToShowMessages();
			});

			this.onReadExpanded()
				.then(() => { })
				.then(() => { })
				.catch(() => { })
				.then(() => {
					this.onFireToShowMessages();
				});
		},

		onSubmitChanges: function () {
			const oResourceBundle = this.getResourceBundle();
			const oModel = this.getModel();

			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(oResourceBundle.getText("Info"), {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.OK,
					styleClass: this.getOwnerComponent().getContentDensityClass(),
					onClose: (sAction) => {
						if (sAction === MessageBox.Action.OK) {
							this.onSubmitChanges()
								.then(() => {
									oModel.resetChanges();
								})
								.catch(() => { })
								.finally(() => {
									this.onFireToShowMessages();
								});
						}
					}
				});
			}
		},

		onUpdate: function () {
			const oData = {};
			const oModel = this.getModel();
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			this.onUpdate(oKey, oData, oModel)
				.then((oData) => { })
				.catch(() => { })
				.finally(() => {
					this.onFireToShowMessages();
				});
		}

	});

});