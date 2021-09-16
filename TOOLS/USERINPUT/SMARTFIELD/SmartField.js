sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");

			this.getRouter().getRoute("main").attachPatternMatched(this._onViewMatched, this);
		},

		onChangeID: function (oEvent) {
			const sID = oEvent.getParameter("value");
		},

		_setData: function () {
			this.getModel().setProperty(this.byId("idSimpleForm").getBindingContext().getPath() + "/ID", "XYZ");
		},

		_onViewMatched: function (oEvent) {
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				this.byId("idSimpleForm").bindElement(this.getModel().createEntry("/IDSet").getPath());
			}.bind(this));
		}

	});

});