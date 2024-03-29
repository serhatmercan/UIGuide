sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageBox"
], function (BaseController, Formatter, MessageBox) {
	"use strict";

	return BaseController.extend("xxx.controller.Main", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {
			this.onClearModel();
			this.onFireToShowMessages();
		}

	});
});