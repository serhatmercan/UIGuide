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

		_onViewMatched: function (oEvent) {
			const oView = this.getView();
			const oViewModel = this.getModel("viewModel");
			const oTable = this.byId("idTable");
			const oExpand = {
				"$expand": "to_Header,to_Items"
			};

			this._clearView();

			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				this.byId("idSimpleForm").bindElement(this.getModel().createEntry("/IDSet").getPath());
			}.bind(this));

			const sPath = this.getModel().createKey("/SFSet", {
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