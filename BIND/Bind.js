sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");

			this.getRouter().getRoute("main").attachPatternMatched(this._onViewMatched, this);
		},

		onACDialog: function () {
			const oModel = this.getModel();

			if (oModel.hasPendingChanges()) {
				oModel.resetChanges();
			}

			if (this._oDialog) {
				oModel.deleteCreatedEntry(this._oDialog.getBindingContext());

				this._oDialog.unbindElement();
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = null;
			}
		},

		onConfirmDialog: function () {
			const oSmartForm = sap.ui.core.Fragment.byId("idDialog", "SmartForm");
			const oData = oSmartForm.getBindingContext().getProperty();

			if (oSmartForm.check().length > 0) {
				return;
			}
		},

		onShowDialog: function () {
			const sPath = this.getView().getModel().createEntry("/DialogSet").getPath();

			this._oDialog = sap.ui.xmlfragment("idDialog", "com.serhatmercan.view.fragment.Dialog", this);

			this.getView().addDependent(this._oDialog);

			this._oDialog.bindElement(sPath);
			sap.ui.core.Fragment.byId("idDialog", "SmartForm").bindElement(sPath);

			this.getModel().setProperty(sPath + "/ID", "X");

			this._oDialog.open();
		},

		onExit: function () {
			this.getModel().resetChanges();
			this.byId("idSmartTable").rebindTable();
		},

		onReadBindingData: function () {
			const sPath = this.getModel().createKey("/IDSet", {
				ID: "X"
			});

			this.getView().bindElement({
				path: sPath
			});
		},

		onGetSetBindingData: function () {
			const oModel = this.getModel();
			const sBindingPath = this.getView().getBindingContext().getPath();
			const sID = oModel.getProperty(sBindingPath + "/ID");

			oModel.setProperty(sBindingPath + "/ID", "X");
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

		onCheckBindingData: function () {
			const oModel = this.getModel();
			const oSmartForm = this.byId("SmartForm");

			if (oSmartForm.check().length) {
				return;
			}

			if (oModel.hasPendingChanges()) {}
		},

		onRefreshView: function () {
			this.getView().unbindElement();
		},

		_onViewMatched: function (oEvent) {
			const oView = this.getView();
			const oModel = this.getModel();
			const oViewModel = this.getModel("viewModel");
			const oTable = this.byId("idTable");
			const oExpand = {
				"$expand": "to_Header,to_Items"
			};

			this._clearView();

			this.oStartupParameters = this._getMyComponent().getComponentData().startupParameters;

			if (this.oStartupParameters.ID && this.oStartupParameters.ID !== "") {}

			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				const oCreateEntry = this.getModel().createEntry("/IDSet");

				this.byId("idSimpleForm").bindElement(oCreateEntry.getPath());

				oModel.setProperty(oCreateEntry.getPath() + "/ID", "X");
				oModel.setProperty(oCreateEntry.getPath() + "/Date", new Date());
				oModel.setProperty(oCreateEntry.getPath() + "/Time", {
					__edmType: "Edm.Time",
					ms: new Date().getTime()
				});
			}.bind(this));

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
					change: this._onChange.bind(this),
					dataReceived: this._onDataReceived.bind(this)
				}
			});

			oTable.rebindTable();
		},

		_clearView: function () {
			const oBindingContext = this.getView().getBindingContext();

			if (oBindingContext) {
				this.getModel().deleteCreatedEntry(oBindingContext);
				this.getView().unbindElement();
				this.getModel().resetChanges();
				this.getModel().refresh(true, true);
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		_getMyComponent: function () {
			const sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		},

		_onChange: function () {

		},

		_onDataReceived: function () {
			const aData = this.getView().getElementBinding().getBoundContext().getObject().to_Header.__list;
		}

	});

});