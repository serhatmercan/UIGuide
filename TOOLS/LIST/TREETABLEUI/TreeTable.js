sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onAddDataToTreeTable: function () {
			const oTreeTable = this.byId("idTreeTable");
			const aRows = oTreeTable.getBinding("rows");
			const aSelectedIndices = aRows.getSelectedIndices();

			aRows.getSelectedIndices().forEach(index => {
				let oNode = aRows.getNodeByIndex(index);
			});

			oTreeTable.collapseAll();
			oTreeTable.removeSelectionInterval(0, aRows.getRootContexts().length);
		},

		onTOS: function (oEvent) {
			const oTreeTable = oEvent.getSource();
			const iRowCount = oTreeTable.getVisibleRowCount();
			const iSelectedRowCount = this.getView().getModel("model").getProperty(oEvent.getParameter("rowContext").getPath() + "/results").length;

			oEvent.getParameter("expanded") ?
				oTreeTable.setVisibleRowCount(iRowCount + iSelectedRowCount) :
				oTreeTable.setVisibleRowCount(iRowCount - iSelectedRowCount);
		}

	});

});