sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");

			const oTreeTable = this.byId("TreeTable");

			oTreeTable.collapseAll();
			oTreeTable.expandToLevel(1);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAddDataToTreeTable() {
			const oTreeTable = this.byId("TreeTable");
			const oBinding = oTreeTable?.getBinding("rows");
			const aIndices = oTreeTable?.getSelectedIndices();

			aIndices?.forEach(iIndex => {
				const oNode = oBinding?.getNodeByIndex(iIndex);
			});

			oTreeTable?.collapseAll();
			oTreeTable?.clearSelection();
		},

		onRSC(oEvent) {
			const sPath = oEvent.getParameter("rowContext").getPath();
		},

		onTOS(oEvent) {
			const oTreeTable = oEvent.getSource();
			const iRowCount = oTreeTable?.getVisibleRowCount();
			const oModel = this.getModel("model");
			const sPath = oEvent.getParameter("rowContext")?.getPath();
			const iSelectedRowCount = oModel.getProperty(sPath + "/Items")?.length;
			const iNewRowCount = oEvent.getParameter("expanded") ?
				iRowCount + iSelectedRowCount :
				iRowCount - iSelectedRowCount;

			oTreeTable?.setVisibleRowCount(iNewRowCount);
		}

	});
});