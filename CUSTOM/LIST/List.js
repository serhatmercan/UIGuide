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
			
			this.setModel(oModel, "viewModel");
			
		},
		
		onPressButtonAddResult: function(oEvent) {
			var sPath = oEvent.getSource().getParent().getBindingContext("viewModel").getPath(),
				oViewModel = this.getModel("viewModel"),
				aResults = oViewModel.getProperty(sPath + "/Results");

			aResults.push({
				Result: ""
			});

			oViewModel.setProperty(sPath + "/Results", aResults);
		},
		
		onDeleteResult: function(oEvent) {
			var sPath = oEvent.getParameter("listItem").getBindingContextPath(),
				aIndex = sPath.split("/"),
				sIndex = aIndex[aIndex.length - 1],
				oViewModel = this.getModel("viewModel"),
				sModelPath,
				aResults;

			aIndex.pop();
			sModelPath = aIndex.join("/");
			aResults = oViewModel.getProperty(sModelPath);
			aResults.splice(parseInt(sIndex), 1);
			oViewModel.setProperty(sModelPath, aResults);
		}

	});

});