sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageBox"
], (BaseController, Formatter, MessageBox) => {
	"use strict";

	return BaseController.extend("xxx.controller.Main", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() {
			this.onClearModel();
		}

	});
});