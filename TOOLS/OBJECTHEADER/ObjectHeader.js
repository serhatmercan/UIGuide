sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			const oModel = new JSONModel({
				Title: "",
				Number: "",
				NumberUnit: "",
				Value: ""
			});

			this.setModel(oModel, "model");

		}

	});

});