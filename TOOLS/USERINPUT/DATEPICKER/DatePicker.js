sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function() {			
			const oModel = new JSONModel({
				MaxDate: new Date(),
				MinDate: new Date(),
				Value: new Date()	
			});
			
			this.setModel(oModel, "model");			
		}

	});

});