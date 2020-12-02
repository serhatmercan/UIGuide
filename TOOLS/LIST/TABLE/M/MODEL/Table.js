sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oTableModel = new JSONModel({
				Value1: "",
				Value2: ""
			});

			this.setModel(oTableModel, "tableModel");

		},

		getDataValue: function () {

			var oTable = this.getView().byId("idTable"),
				oModel = oTable.getModel("tableModel"),
				aData = oModel.getData();

		},

		getSelectedPath: function () {

			var oTable = this.getView().byId("idTable"),
				aPaths = oTable.getSelectedContextPaths(),
				oContext;

			for (var i = 0; i < aPaths.length; i++) {
				oContext = this.getModel("tableModel").getProperty(aPaths[i]);
			}

		},

		getColumnData: function () {

			var aItems = this.getView().byId("idTable").getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getCells()[1].getTitle() === "X") {
					aItems[i].setSelected(true);
				}
			}

		},

		onPress: function (oEvent) {
			this.getRouter().navTo("viewName", {
				value: oEvent.getSource().getBindingContext("tableModel").getProperty("Value1")
			});
		},

		removeSelectedRow: function () {
			this.byId("idTable").clearSelection();
			this.byId("idTable").removeSelections();
		}

	});

});