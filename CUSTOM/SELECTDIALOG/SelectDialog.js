sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function() {
			
			var oModel = new JSONModel({
				Value: ""	
			});
			
			this.setModel(oModel, "model");
			
		}

	});

});