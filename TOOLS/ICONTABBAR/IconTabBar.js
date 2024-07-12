sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], (BaseController) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.byId("ITB").setSelectedKey("ITFI");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onSelectITB(oEvent) {
			const { key: sKey } = oEvent.getParameter();

			switch (sKey) {
				case "ITFI":
					break;
				default:
					break;
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getITBContents() {
			this.byId("ITB").getItems().forEach(oItem => {
				oItem?.getContent()[0]?.clearSelection();
			});
		},

		getSelectedDataITB() {
			const oITB = this.byId("ITB");
			const oSelectedFilterItem = oITB.getAggregation("items").find(oItem => oItem.getKey() === oITB.getSelectedKey());
			const oSelectedTable = oSelectedFilterItem.getContent()[0];
		}

	});
});