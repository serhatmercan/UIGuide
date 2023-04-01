sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			const oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onSearch: function () {
			const sValue = this.getModel("model").getProperty("/Value");
		}

	});

});