sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.NavigationList", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Items: [],
				Value: ""
			});
			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onCollapseExpand() {
			const oNavigationList = this.byId("NavigationList");

			oNavigationList.setExpanded(!oNavigationList.getExpanded());
		}

	});
});