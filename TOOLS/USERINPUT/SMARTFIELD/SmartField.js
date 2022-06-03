sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */
	
		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onChangeID: function (oEvent) {
			const sID = oEvent.getParameter("value");
			const sPath = this.getView().getBindingContext().getPath();
			const oModel = this.getModel();
			const sBindingValuePath = oEvent.getSource().getBinding("value").getPath(); // Value
			const sValue = oModel.getProperty("/...Set('" + sID + "')/Value"); // Get SH Data	

			oEvent.getSource().setValue(sID);
			oModel.setProperty(sPath + "/ID", oModel.getProperty("/VHSet('" + sID + "')" + "/Value"));
		},

		onFilterDDL: function () {
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];

			this.byId("ID").getInnerControls()[0].getBinding("items").filter(aFilters);
			this.byId("ID").getInnerControls()[0].getBinding("items").filter([
				new Filter("ID", FilterOperator.EQ, this.getModel().getProperty(this.getView().getBindingContext().getPath() + "/Value"))
			]);
		},

		onICC: function (oEvent) {
			this.setSmartFieldValueHelpOnly(oEvent.getParameters()[0]);
		},

		onVLC: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContext().getPath();
			const oData = this.getModel().getProperty(sPath);
		},		

		/* ================ */
		/* Internal Methods */
		/* ================ */

		controlExplanationValueState: function () {
			const oContainer = oEvent.getSource();
			const sExplanationID = oContainer.getId();
			const aSmartFields = [];
			let bCheckSmartForm = "";
			// const aSmartFields = this.byId("SFData").getSmartFields();
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
				if (xValue === "N" || xValue === "No" || xValue === "None" || xValue === "Y" || +xValue <= 0 ||
					oExplanationField.getValue() !== "") {
					oExplanationField.setValueState("None");
				} else {
					oExplanationField.setValueState("Error");
				}
			} else {
				oExplanationField.setValueState("None");
			}
		},

		controlKeyValueState: function () {
			let oContainer = oEvent.getSource();
			let sKeyID = oContainer.getId();
			let aSmartFields = [];
			let bCheckSmartForm = "";
			// const aSmartFields = this.byId("SFData").getSmartFields();
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
				if (xValue === "N" || xValue === "No" || xValue === "None" || xValue === "Y" || +xValue <= 0 ||
					oExplanationField.getValue() !== "") {
					oExplanationField.setValueState("None");
				} else {
					oExplanationField.setValueState("Error");
				}
			} else {
				oExplanationField.setValueState("None");
			}
		},

		patternMatched: function (oEvent) {
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				this.byId("SimpleForm").bindElement(this.getModel().createEntry("/...Set").getPath());
			}.bind(this));

			const sPath = this.getModel().createKey("/SFSet", {
				ID: "X"
			});

			this.getView().bindElement({
				path: sPath,
				parameters: {
					expand: "Header,Items"
				}
			});
		},

		setData: function () {
			this.getModel().setProperty(this.byId("SimpleForm").getBindingContext().getPath() + "/ID", "XYZ");
		},

		setSmartFieldValueHelpOnly: function (oItem) {
			if (oItem.getMetadata().getElementName() === "sap.m.Input") {
				oItem.setValueHelpOnly(true);
			}
		}

	});

});