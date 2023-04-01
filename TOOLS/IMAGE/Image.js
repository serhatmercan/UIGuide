sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		formatter: formatter,

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		}

	});

});