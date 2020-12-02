sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");

		},

		onSearch: function () {

			var oModel = this.getModel("model"),
				sValue = oModel.getProperty("/Value");

		}

	});

});