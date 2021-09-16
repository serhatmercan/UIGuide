sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		_readMultiData: function (sSet, aFilters, oExpand, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					filters: aFilters,
					urlParameters: oExpand,
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, oParameters);
			});
		},

		_sendMultiData: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.create(sSet, oData, oParameters);
			});
		}

	});

});