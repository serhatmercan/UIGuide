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
			const sPath = this.getView().getBindingContext().getPath();
			const oModel = this.getModel();
			const sBindingValuePath = oEvent.getSource().getBinding("value").getPath(); // Value

			oEvent.getSource().setValue(sID);
			oModel.setProperty(sPath + "/ID", oModel.getProperty("/VHSet('" + sID + "')" + "/Value"));
		},

		onFilterDDL: function () {
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];

			this.byId("idID").getInnerControls()[0].getBinding("items").filter(aFilters);
		},

		onVLC: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContext().getPath();
			const oData = this.getModel().getProperty(sPath);
		},

		onICC: function (oEvent) {
			this._setSmartFieldValueHelpOnly(oEvent);
		},

		_setData: function () {
			this.getModel().setProperty(this.byId("idSimpleForm").getBindingContext().getPath() + "/ID", "XYZ");
		},

		_setSmartFieldValueHelpOnly: function (oEvent) {
			if (oEvent.getParameters()[0].getMetadata().getElementName() === "sap.m.Input") {
				oEvent.getParameters()[0].setValueHelpOnly(true);
			}
		},

		_onViewMatched: function (oEvent) {
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				this.byId("idSimpleForm").bindElement(this.getModel().createEntry("/IDSet").getPath());
			}.bind(this));

			const sPath = this.getModel().createKey("/SFSet", {
				ID: "X"
			});

			this.getView().bindElement({
				path: sPath,
				parameters: {
					expand: "to_Header,to_Items"
				}
			});
		}

	});

});