sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");

			this.getRouter().getRoute("main").attachPatternMatched(this._onViewMatched, this);
		},

		onExit: function () {
			this.getModel().resetChanges();
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
			const oSmartForm = this.byId("idSmartForm");

			if (oSmartForm.check().length) {
				return;
			}

			if (oModel.hasPendingChanges()) {}
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
				this.getModel().refresh(true, true);
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		_onChange: function () {

		},

		_onDataReceived: function () {
			const aData = this.getView().getElementBinding().getBoundContext().getObject().to_Header.__list;
		}

	});

});