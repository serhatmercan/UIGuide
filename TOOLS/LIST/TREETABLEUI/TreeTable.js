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

			this.byId("TreeTable").collapseAll();
			this.byId("TreeTable").expandToLevel(1);
		},

		onAddDataToTreeTable: function () {
			const oTreeTable = this.byId("TreeTable");
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
			const iSelectedRowCount = this.getModel("model").getProperty(oEvent.getParameter("rowContext").getPath() + "/Items").length;

			oEvent.getParameter("expanded") ?
				oTreeTable.setVisibleRowCount(iRowCount + iSelectedRowCount) :
				oTreeTable.setVisibleRowCount(iRowCount - iSelectedRowCount);
		}

	});

});