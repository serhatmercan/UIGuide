sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Values: []
			});

			this.setModel(oModel, "model");

		},

		onDeleteList: function (oEvent) {
			var sPath = oEvent.getParameter("listItem").getBindingContextPath(),
				aIndex = sPath.split("/"),
				sIndex = aIndex[aIndex.length - 1],
				oModel = this.getModel("model"),
				sModelPath,
				aResults;

			aIndex.pop();
			sModelPath = aIndex.join("/");
			aResults = oModel.getProperty(sModelPath);
			aResults.splice(parseInt(sIndex), 1);
			oModel.setProperty(sModelPath, aResults);
		},

		onItemPress: function (oEvent) {
			
		},

		removeSelection: function () {
			this.byId("idList").removeSelections();
		}

	});

});