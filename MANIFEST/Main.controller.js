sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("xxx.controller.Main", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.ODataModel = this.getOwnerComponent().getModel("ss");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) { }

	});
});