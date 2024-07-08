sap.ui.define([
	"./BaseController"
], (BaseController) => {
	"use strict";

	return BaseController.extend("xxx.controller.Main", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.ODataModel = this.getOwnerComponent().getModel("ss");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched(oEvent) { }

	});
});