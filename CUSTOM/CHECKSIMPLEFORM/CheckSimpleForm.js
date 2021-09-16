sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this._getRequiredElements();

			if (this._checkFields()) {
				MessageToast.show(this.getResourceBundle().getText("infoObligatoryFields"));
				return;
			}
		},

		_getRequiredElements: function () {
			const aClasses = ["sap.m.ComboBox", "sap.m.MultiInput", "sap.m.Input", "sap.m.DatePicker",
				"sap.m.TimePicker", "sap.m.MultiComboBox", "sap.m.TextArea"
			];
			const aContents = sap.ui.getCore().byId("idSimpleForm").getContent();

			this._aRequiredElements = aContents.filter(function (item) {
				const sName = item.getMetadata().getName();
				if (aClasses.findIndex(x => x === sName) !== -1 && item.getRequired()) {
					return true;
				} else {
					return false;
				}
			});
		},

		_checkFields: function (sID) {
			const that = this;
			let bValidationError = false;

			jQuery.each(this._aRequiredElements, function (i, oElement) {
				bValidationError = that._validateElement(oElement) || bValidationError;
			});

			return bValidationError;
		},

		_validateElement: function (oElement) {
			const sName = oElement.getMetadata().getName();
			let sValue,
				sValueState = "None",
				bValidationError = false;

			switch (sName) {
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

			if (!sValue) {
				sValueState = "Error";
				bValidationError = true;
			}

			oElement.setValueState(sValueState);

			return bValidationError;
		}

	});

});