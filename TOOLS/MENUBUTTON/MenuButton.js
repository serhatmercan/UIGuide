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
				MenuStatu: false,
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onItemSelected(oEvent) { },

		onShowMI(sType, oEvent) { }

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});
});