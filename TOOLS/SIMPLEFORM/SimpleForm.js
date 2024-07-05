sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Value: ""
				}), "model"
			);

			this.getRequiredElements();

			if (this.checkFields()) {
				MessageToast.show(this.getText("infoObligatoryFields"));
				return;
			}
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		checkFields: function () {
			return this.RequiredElements.some(oRequiredElement => !this.validateElement(oRequiredElement));
		},

		getRequiredElements: function () {
			const aClasses = ["sap.m.ComboBox", "sap.m.DatePicker", "sap.m.Input", "sap.m.MultiComboBox", "sap.m.MultiInput", "sap.m.TextArea", "sap.m.TimePicker"];
			const aContents = this.byId("SimpleForm").getContent();

			this.RequiredElements = aContents.filter(oContext => {
				return aClasses.findIndex(oClass => oClass === oContext.getMetadata().getName()) !== -1 && oContext.getRequired();
			});
		},

		validateElement: function (oElement) {
			let sValue;

			switch (oElement.getMetadata().getName()) {
				case "sap.m.DatePicker":
					sValue = oElement.getDateValue();
					break;
				case "sap.m.ComboBox":
					sValue = oElement.getSelectedKey();
					break;
				case "sap.m.MultiComboBox":
					sValue = oElement.getSelectedKeys().length;
					break;
				case "sap.m.Select":
					sValue = oElement.getSelectedKey();
					break;
				case "sap.m.MultiInput":
					sValue = oElement.getTokens().length;
					break;
				default:
					sValue = oElement.getValue();
			}

			oElement.setValueState(sValue ? "None" : "Error");

			return !sValue;
		}

	});

});