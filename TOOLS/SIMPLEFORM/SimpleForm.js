sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageToast, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Value: ""
			});
			const oValidationModel = new JSONModel({
				Value: true
			});

			this.setModel(oViewModel, "model");
			this.setModel(oValidationModel, "validation");

			this.getRequiredElements();

			if (this.checkFields()) {
				MessageToast.show(this.getText("infoObligatoryFields"));
				return;
			}

			if (!this.validate()) return;
		},

		/* ============== */
		/* Internal Methods */
		/* ============== */

		checkFields() {
			return this.aRequiredElements.some(oRequiredElement => !this.validateElement(oRequiredElement));
		},

		getRequiredElements() {
			const aClasses = [
				"sap.m.ComboBox",
				"sap.m.DatePicker",
				"sap.m.Input",
				"sap.m.MultiComboBox",
				"sap.m.MultiInput",
				"sap.m.TextArea",
				"sap.m.TimePicker"
			];
			const aContents = this.byId("SimpleForm").getContent();

			this.aRequiredElements = aContents.filter(oContext => aClasses.includes(oContext.getMetadata()?.getName()) && oContext.getRequired());
		},

		getElementValue(oElement, sElementName) {
			switch (sElementName) {
				case "sap.m.ComboBox":
				case "sap.m.Select":
					return oElement.getSelectedKey();
				case "sap.m.DatePicker":
					return oElement.getDateValue();
				case "sap.m.MultiComboBox":
					return oElement.getSelectedKeys().length;
				case "sap.m.MultiInput":
					return oElement.getTokens().length;
				default:
					return oElement.getValue();
			}
		},

		validate() {
			const oData = this.getModel("model").getData();
			const oValidationModel = this.getModel("validation");

			oValidationModel.setProperty("/Value", !!oData.Value);

			return !Object.values(oValidationModel.getData()).includes(false);
		},

		validateElement(oElement) {
			const sElementName = oElement.getMetadata()?.getName();
			const sValue = this.getElementValue(oElement, sElementName);

			oElement.setValueState(sValue ? "None" : "Error");

			return !!sValue;
		}

	});
});