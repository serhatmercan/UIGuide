sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");

			this.getRouter().getRoute("main").attachPatternMatched(this._onViewMatched, this);
		},

		_onViewMatched: function (oEvent) {
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				const sPath = this.getModel().createEntry("/ValueSet").getPath();

				this.byId("idSmartForm").bindElement(sPath);
				this.getModel().setProperty(sPath + "/Value", "X");
			}.bind(this));
		},

		_getData: function () {
			const oSFData = this.byId("idSmartForm").getBindingContext().getProperty();
		},

		_setData: function () {

		},

	});

});