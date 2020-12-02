sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.serhatmercan.controller.ClearModel", {

		onInit: function () {
			var oViewModel = new JSONModel({
				Data: {
					DataObject: {},
					DataStatu: false
				},
				Object: {},
			});
			this.setModel(oViewModel, "viewModel");
		},

		clearModel: function () {
			var oViewModel = this.getModel("viewModel"),
				oModel = {
					Data: {
						DataObject: {},
						DataStatu: false
					},
					Object: {}
				};
			oViewModel.setProperty("/", oModel);
		},

		clearDataModel: function () {
			var oViewModel = this.getModel("viewModel"),
				oData = {
					DataObject: {},
					DataStatu: false
				};
			oViewModel.setProperty("/Data", oData);
		}

	});
});