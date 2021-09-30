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
					dataReceived: this._onDataReceived.bind(this)
				}
			});

			oTable.rebindTable();
		},

		_clearView: function () {
			const oBindingContext = this.getView().getBindingContext();

			if (oBindingContext) {
				this.getModel().deleteCreatedEntry(oBindingContext);
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		_onDataReceived: function () {
			const aData = this.getView().getElementBinding().getBoundContext().getObject().to_Header.__list;
		}

	});

});