sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"com/serhatmercan/model/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		formatter: formatter,

		onInit: function() {
			
			var oModel = new JSONModel({
				Values: ""	
			});
			
			this.setModel(oModel, "model");
			
		}

	});

});