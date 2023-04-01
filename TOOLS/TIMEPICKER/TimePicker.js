sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Value: new Date()
			});

			this.setModel(oModel, "model");

			oModel.setProperty(sPath + "/Value", {
				__edmType: "Edm.Time",
				ms: new Date().getTime()
			});
		}

	});

});