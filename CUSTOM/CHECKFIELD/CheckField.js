sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Requirement: {}
			});

			this.setModel(oModel, "model");

			this.checkField();

		},

		checkField: function () {
			var sId = "";
			this.getRequiredField(this, "model", "/Requirement", sId, "RQ");
		},

		getRequiredField: function (that, sModel, sProperty, sId, sType) {

			var oModel = that.getModel(sModel),
				oParams = {},
				sKey;

			oModel.setProperty(sProperty, {});

			that.getModel().metadataLoaded().then(function () {

				oParams.success = function (oSuccess) {
					oModel.setProperty(sProperty, oSuccess);
				};

				sKey = that.getModel().createKey("CheckFieldsSet", {
					Id: sId,
					Type: sType
				});

				that.getModel().read("/" + sKey, oParams);

			});

		}

	});

});