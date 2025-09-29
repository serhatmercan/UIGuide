sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageBox"
], (BaseController, formatter, MessageBox) => {
	"use strict";

	return BaseController.extend("xxx.controller.Main", {

		formatter,

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