sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Value: ""
			});

			this.setModel(oModel, "model");

		},

		getData: function () {
			var oData = this.getSelectedRow();
			if (!oData) {}
		},

		getSelectedRow: function () {
			var oTable = this.byId("idTable"),
				aIndex = oTable.getSelectedIndices();

			if (aIndex.length !== 1) {
				return undefined;
			} else {
				return oTable.getContextByIndex(aIndex[0]).getObject();
			}
		},

		onSearch: function () {

			var oModel = this.getModel("model"),
				oTable = this.byId("idTable"),
				aFilters = [];

			if (oModel.getProperty("/Value")) {
				aFilters.push(new Filter("Value", FilterOperator.EQ, oModel.getProperty("/Value")));
			}

			oTable.getBinding("rows").filter(aFilters);

		}

	});

});