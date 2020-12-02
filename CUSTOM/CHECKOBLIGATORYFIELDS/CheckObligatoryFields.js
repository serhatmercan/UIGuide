sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("serhatmercan.CheckObligatoryField", {
		onInit: function () {

			this.oView.setModel(new JSONModel({
				name: "",
				email: "",
				description: ""
			}));

		},

		onContinue: function (oEvent) {
			var that = this;
			var bValidationError = false;
			var aElements = this.getView().byId("page").findElements();

			var aInputs = aElements.filter(function (item) {
				return item.getMetadata().getName() === "sap.m.Input" ? true : false;
			});

			jQuery.each(aInputs, function (i, oInput) {
				bValidationError = that._validateInput(oInput) || bValidationError;
			});

			if (bValidationError) {
				MessageToast.show("Zorunlu Alanları Doldurun !");
				return;
			} else {
				MessageToast.show("Başarılı");
			}

		},

		_validateInput: function (oInput) {
			var sValueState = "None";
			var bValidationError = false;

			if (oInput.getVisible() && oInput.getRequired() && oInput.getValue().length === 0) {
				sValueState = "Error";
				bValidationError = true;
			}

			oInput.setValueState(sValueState);

			return bValidationError;
		},

		onChange: function (oEvent) {
			this._validateInput(oEvent.getSource());
		}

	});
});