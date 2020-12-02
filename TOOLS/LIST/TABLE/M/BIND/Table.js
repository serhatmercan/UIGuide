sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		getTableData: function() {
			
			var aContext = this.getView().byId("idTable").getSelectedContexts();
			
		}

	});

});