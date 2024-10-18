sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/message/Message",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageBox, MessageToast, Message, Filter, FilterOperator, FilterType, Sorter, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			// Clear Metadata
			jQuery.extend(true, {}, oData);
			jQuery.extend(true, [], aData);

			// Clear Metadata (ES6)
			JSON.parse(JSON.stringify(oData.Items));
		},

		onGetSetMessages() {
			const oViewModel = this.getModel("model");

			oViewModel.setProperty("/Messages", sap.ui.getCore().getMessageManager().getMessageModel().getData());

			oViewModel.getProperty("/Messages").forEach(({ message, type }) => {
				sap.ui.getCore().getMessageManager().addMessages(
					new Message({
						message,
						type,
						persistent: true
					})
				);
			});

			this.onFireToShowMessages();
			oViewModel.setProperty("/Messages", []);
		},

		async onAsyncFunction() {
			const oViewModel = this.getModel("model");
			const sMethod = "GET";
			const oURLParameters = {
				ID: "X"
			};

			try {
				const oData = await this.onCallFunction("/...Set", sMethod, this.getModel(), oURLParameters);
				const sID = oData.GetData.ID;
			} catch (oError) {
				// Handle Error
			}
			finally {
				this.onFireToShowMessages();
			}
		},

		async onCallFunction() {
			const oViewModel = this.getModel("model");
			const sMethod = "GET";
			const oURLParameters = {
				ID: "X"
			};

			try {
				const oData = await this.onCallFunction("/...", sMethod, this.getModel(), oURLParameters);
				const sID = oData.GetData.ID;
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		},

		async onCreate(oEvent) {
			const oMBAction = MessageBox.Action;
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const aData = oViewModel.getProperty("/Data");
			let oData = {
				ID: "X",
				Items: []
			};

			const aPaths = this.getView().getBindingContext().getProperty("Items");

			aData.forEach((Data) => {
				oData.Items.push(Data);
			});

			oData.Items = aPaths.map(sPath => oModel.getProperty("/" + sPath));

			// Match Binding Data
			oData = JSON.parse(JSON.stringify(aData.Items));

			// Clear Metadata
			delete oData.__metadata;

			// Clear Items Metadata
			oData.Items.forEach(oItem => {
				delete oItem.__metadata;
			});

			// Convert Integer Value to String
			Object.keys(oData).forEach(sFieldName => {
				if (typeof oData[sFieldName] === "number") {
					oData[sFieldName] = oData[sFieldName].toString();
				}
			});

			const onConfirm = async (sAction) => {
				if (sAction === oMBAction.OK) {
					try {
						const oResponse = await this.onCreate("/...Set", oData, this.getModel());
						const aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();

						aMessages.forEach(oMessage => oMessage.setPersistent(true));

						if (aMessages.some(oMessage => oMessage.type === "Error")) {
							MessageToast.show(this.getText("errorOccured"));
							return;
						}

						oResponse.results.forEach(oResult => {
							sap.ui.getCore().getMessageManager().addMessages(
								new Message({
									message: oResult.Message,
									type: oResult.Type,
									persistent: false
								})
							);
						});
					} catch (oError) {
						const sMessage = new DOMParser()?.parseFromString(oError.responseText, "text/xml")?.querySelector("message")?.textContent;
					} finally {
						this.onFireToShowMessages();
					}
				}
			};

			MessageBox.confirm(this.getText("Info"), {
				actions: [oMBAction.OK, oMBAction.CANCEL],
				emphasizedAction: oMBAction.OK,
				styleClass: this.getOwnerComponent().getContentDensityClass(),
				onClose: onConfirm
			});
		},

		async onDelete() {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			try {
				await this.onDelete(oKey, oModel);
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		},

		async onRead() {
			const oModel = this.getModel();
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			try {
				await this.onRead(oKey, oModel);
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		},

		async onReadAssociation() {
			const oModel = this.getModel();
			const sPath = oModel.createKey("/...Set", {
				ID: sID
			});
			const oExpand = {
				"$expand": "Items,Values"
			};

			try {
				const oData = await this.onReadAssociation(sPath, oExpand, oModel);
				const aItems = oData.Items.results;
				const aValues = oData.Values.results;
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		},

		async onReadExpanded() {
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const oExpand = {
				"$expand": "Items,Values"
			};

			try {
				await this.onReadExpanded("/...Set", aFilters, oExpand, this.getModel());
				// oData.results[0];
				// oData.results[0].Items.results
				// oData.results[0].Values.results,
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		},

		async onReadQuery() {
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const aXFilters = new Filter({
				filters: [
					new Filter("ID", FilterOperator.Contains, "X"),
					new Filter("Value", FilterOperator.Contains, "ABC")
				],
				and: false
			});

			try {
				const oData = await this.onReadQuery("/...Set", aFilters, this.getModel());
				// oData.results[0];
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}

			try {
				const oData = await this.onReadQuery("/...Set/$count", [], this.getModel());
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		},

		async onReadQueryAsyncSorters() {
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const aSorters = [
				new Sorter("Key", false)
			];
			const bAsync = true;

			try {
				const oData = await this.onReadQueryAsyncSorters("/...Set", aFilters, bAsync, aSorters, this.getModel())
				// oData.results[0];
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		},

		async onRunMultiPromise() {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];
			const oExpand = {
				"$expand": "Items,Values"
			};

			try {
				await Promise.all([
					this.onReadExpanded("/...Set", aFilters, oExpand, oModel),
					this.onReadQuery("/...Set", aFilters, oModel)
				]);
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}

			try {
				await this.onReadExpanded();
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		},

		async onSubmitChanges() {
			const oModel = this.getModel();
			const oMBAction = MessageBox.Action;

			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(this.getText("Info"), {
					actions: [oMBAction.OK, oMBAction.CANCEL],
					emphasizedAction: oMBAction.OK,
					styleClass: this.getOwnerComponent().getContentDensityClass(),
					onClose: async (sAction) => {
						if (sAction === oMBAction.OK) {
							try {
								await this.onSubmitChanges();
								oModel.resetChanges();
							} catch (oError) {
								// Handle Error
							} finally {
								this.onFireToShowMessages();
							}
						}
					}
				});
			}
		},

		async onUpdate() {
			const oData = {};
			const oModel = this.getModel();
			const oKey = oModel.createKey("/...Set", {
				ID: "X"
			});

			try {
				await this.onUpdate(oKey, oData, oModel);
			} catch (oError) {
				// Handle Error
			} finally {
				this.onFireToShowMessages();
			}
		}

	});

});
