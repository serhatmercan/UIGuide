sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
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
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");

			this.getOwnerComponent().getModel().attachRequestCompleted(this.attachRequestCompleted, this);
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		onExit: function () {
			this.getModel().resetChanges();
			this.byId("SmartTable").rebindTable();
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACDialog: function () {
			const oModel = this.getModel();

			if (oModel.hasPendingChanges()) {
				oModel.resetChanges();
			}

			if (this.oDialog) {
				oModel.deleteCreatedEntry(this.oDialog.getBindingContext());

				this.oDialog.unbindElement();
				this.oDialog.close();
				this.oDialog.destroy();
				this.oDialog = null;
			}
		},

		onCheckBindingData: function () {
			const oModel = this.getModel();
			const oSmartForm = this.byId("SmartForm");

			if (oSmartForm.check().length) {
				return;
			}

			if (oModel.hasPendingChanges()) {

			}
		},

		onClearBindingData: function () {
			this.getView().bindElement(this.getModel().createEntry("/IDSet").getPath());
		},

		onClearBindingProperties: function () {
			const oModel = this.getModel();
			const aProperties = oModel.getMetaModel().getODataEntityType("ZXX_SRV.Material").property;

			aProperties.forEach((oProperty) => {
				let value;

				switch (oProperty.type) {
					case "Edm.Boolean":
						value = false;
						break;
					case "Edm.DateTime":
						value = null;
						break;
					case "Edm.String":
						value = "";
						break;
					case "Edm.Time":
						value = {
							ms: 0,
							__edmType: "Edm.Time"
						};
						break;
				}

				oModel.setProperty(this.getView().getBindingContext().getPath() + "/" + oProperty.name, value);
			});
		},

		onConfirmDialog: function () {
			const oSmartForm = sap.ui.core.Fragment.byId("Dialog", "SmartForm");
			const oData = oSmartForm.getBindingContext().getProperty();

			if (oSmartForm.check().length > 0) {
				return;
			}
		},

		onGetSetBindingData: function () {
			const oModel = this.getModel();
			const sBindingPath = this.getView().getBindingContext().getPath();
			const sID = oModel.getProperty(sBindingPath + "/ID");

			oModel.setProperty(sBindingPath + "/ID", "X");
		},

		onReadBindingData: function () {
			const sPath = this.getModel().createKey("/IDSet", {
				ID: "X"
			});

			this.getView().bindElement({
				path: sPath
			});
		},

		onRefreshRebindView: function () {
			const oView = this.getView();
			const sPath = this.getModel().createKey("/SFSet", {
				ID: "X"
			});

			oView.unbindElement();
			oView.bindElement({
				path: sPath
			});
		},

		onShowDialog: function () {
			const oModel = this.getModel();
			const sPath = oModel.createEntry("/DialogSet").getPath();

			this.oDialog = sap.ui.xmlfragment("Dialog", "com.serhatmercan.view.fragment.Dialog", this);

			this.getView().addDependent(this.oDialog);

			this.oDialog.bindElement(sPath);

			sap.ui.core.Fragment.byId("Dialog", "SmartForm").bindElement(sPath);

			oModel.setProperty(sPath + "/ID", "X");

			this.oDialog.open();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		attachRequestCompleted: function () {
			setTimeout(() => {
				this.byId("ComboBox").fireChange();
				this.byId("ComboBox").getInnerControls()[0].getBinding("items").filter([
					new Filter("ID", FilterOperator.EQ, this.getModel().getProperty(this.getView().getBindingContext().getPath() + "/ID"))
				]);
			}, 500);
		},

		change: function () {

		},

		clearView: function () {
			const oView = this.getView();
			const oBindingContext = oView.getBindingContext();
			const oModel = this.getModel();

			if (oBindingContext) {
				oView.unbindElement();
				oModel.deleteCreatedEntry(oBindingContext);
				oModel.resetChanges();
				oModel.refresh(true, true);
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		dataReceived: function () {
			const aData = this.getView().getElementBinding().getBoundContext().getObject().to_Header.__list;
		},

		getMyComponent: function () {
			const sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		},

		getData: function (oEvent) {
			const oData = this.getView().getBindingContext().getObject();
			const oDataID = this.getView().getBindingContext().getObject("ID");
			const oDataX = this.getModel().getProperty(this.getView().getBindingContext().getPath());
			const oDataXID = this.getModel().getProperty(this.getView().getBindingContext().getPath() + "/ID");
		},

		getPath: function () {
			// From Model
			let sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();

			// From Input Model
			let sValuePath = oEvent.getSource().getBindingInfo("value").binding.getPath();

			// From View I
			let oView = this.getView(),
				sBindingPath = oView.getBindingContext().getPath(),
				sData = oView.getModel().getProperty(sPath + "/Data");

			//  From View II
			let oObject = this.getView().getBindingContext().getObject();
		},

		patternMatched: function (oEvent) {
			const oView = this.getView();
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const oTable = this.byId("Table");
			const oExpand = {
				"$expand": "Header,Items"
			};

			this.clearView();

			this.oStartupParameters = this.getMyComponent().getComponentData().startupParameters;

			if (this.oStartupParameters.ID && this.oStartupParameters.ID !== "") { }

			this.getOwnerComponent().getModel().metadataLoaded().then(async () => {
				const oCreateEntry = this.getModel().createEntry("/IDSet");

				this.byId("SimpleForm").bindElement(oCreateEntry.getPath());

				oModel.setProperty(oCreateEntry.getPath() + "/ID", "X");
				oModel.setProperty(oCreateEntry.getPath() + "/Date", new Date());
				oModel.setProperty(oCreateEntry.getPath() + "/Time", {
					__edmType: "Edm.Time",
					ms: new Date().getTime()
				});
			});

			const sPath = oModel.createKey("/SFSet", {
				ID: "X"
			});

			oView.bindElement({
				path: sPath,
				parameters: {
					expand: oExpand
				},
				events: {
					change: (oEvent) => {
						const aItemPaths = oEvent.getSource().getBoundContext().getObject().to_Items.__list;
						const aItems = [];

						aItemPaths.forEach(oItemPath => {
							let oItem = oModel.getProperty("/" + oItemPath);
							delete oItem.__metadata;
							aItems.push(oItem);
						});
					},
					change: this.change.bind(this),
					dataReceived: this.dataReceived.bind(this),
					dataReceived: () => {
						sap.ui.core.BusyIndicator.hide();
					},
					dataRequested: this.dataRequested.bind(this),
					dataRequested: () => {
						sap.ui.core.BusyIndicator.show();
					}
				}
			});

			oTable.rebindTable();
		},

		viewBind: function () {
			const oModel = this.getModel();
			const oView = this.getView();
			const oBindingContext = oView.getBindingContext();
			const sPath = oModel.createKey("/...Set", {
				ID: "X"
			});

			if (oBindingContext) {
				oView.unbindElement();
				oModel.refresh(true, true);
			}

			oView.bindElement({
				path: sPath,
				events: {
					dataReceived: (oEvent) => {
						const oData = oEvent.getSource().getBoundContext().getObject();
					}
				}
			});
		}

	});

});