sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.byId("ITB").setSelectedKey("ITFI");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */
		
		onSelectITB: function (oEvent) {
			if (oEvent.getParameter("key") === "ITFI") {}

			switch (oEvent.getParameter("key")) {
			case "ITFI":
				break;
			default:
				break;
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getITBContents: function () {
			this.byId("ITB").getItems().forEach(oItem => {
				oItem.getContent()[0].clearSelection();
			});
		},

		getSelectedDataITB: function (oEvent) {
			const oITB = this.byId("ITB");
			const oSelectedFilterItem = oITB.getAggregation("items").find(oItem => oItem.getKey() === oITB.getSelectedKey());
			const oSelectedTable = oSelectedFilterItem.getContent()[0];
		}		

	});

});