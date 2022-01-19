sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, Filter, FilterOperator) {
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

		onControlExplanationValueState: function () {
			let oContainer = oEvent.getSource();
			let sExplanationID = oContainer.getId();
			let aSmartFields = [];
			let bCheckSmartForm = "";
			// const aSmartFields = this.byId("idSFData").getSmartFields();
			// const aSmartFields = oContainer.getParent().getParent().getParent().getParent().getSmartFields();

			do {
				bCheckSmartForm = oContainer.getId().split("--")[oContainer.getId().split("--").length - 1].startsWith("idSF");

				if (bCheckSmartForm) {
					aSmartFields = oContainer.getSmartFields();
				} else {
					oContainer = oContainer.getParent();
				}
			}
			while (aSmartFields.length === 0);

			const iIndex = aSmartFields.findIndex(oSF => oSF.getId() === sExplanationID);
			const oKeyField = aSmartFields[iIndex - 1];
			const oExplanationField = oEvent.getSource();
			const xValue = oKeyField.getValue();

			if (xValue) {
				if (xValue === "H" || xValue === "Hayır" || xValue === "Yok" || xValue === "Y" || +xValue <= 0 ||
					oExplanationField.getValue() !== "") {
					oExplanationField.setValueState("None");
				} else {
					oExplanationField.setValueState("Error");
				}
			} else {
				oExplanationField.setValueState("None");
			}
		},

		onControlKeyValueState: function () {
			let oContainer = oEvent.getSource();
			let sKeyID = oContainer.getId();
			let aSmartFields = [];
			let bCheckSmartForm = "";
			// const aSmartFields = this.byId("idSFData").getSmartFields();
			// const aSmartFields = oContainer.getParent().getParent().getParent().getParent().getSmartFields();

			do {
				bCheckSmartForm = oContainer.getId().split("--")[oContainer.getId().split("--").length - 1].startsWith("idSF");

				if (bCheckSmartForm) {
					aSmartFields = oContainer.getSmartFields();
				} else {
					oContainer = oContainer.getParent();
				}
			}
			while (aSmartFields.length === 0);

			const iIndex = aSmartFields.findIndex(oSF => oSF.getId() === sKeyID);
			const oExplanationField = aSmartFields[iIndex + 1];
			const xValue = oEvent.getSource().getValue();

			if (xValue) {
				if (xValue === "H" || xValue === "Hayır" || xValue === "Yok" || xValue === "Y" || +xValue <= 0 ||
					oExplanationField.getValue() !== "") {
					oExplanationField.setValueState("None");
				} else {
					oExplanationField.setValueState("Error");
				}
			} else {
				oExplanationField.setValueState("None");
			}
		},

		onFilterDDL: function () {
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];

			this.byId("idID").getInnerControls()[0].getBinding("items").filter(aFilters);
			this.byId("idID").getInnerControls()[0].getBinding("items")
				.filter(
					[new Filter("ID", FilterOperator.EQ, this.getModel().getProperty(this.getView().getBindingContext().getPath() + "/Value"))]);
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