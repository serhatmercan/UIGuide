sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageBox"
<<<<<<< HEAD
], (BaseController, Formatter, MessageBox) => {
=======
], function (BaseController, Formatter, MessageBox) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
	"use strict";

	return BaseController.extend("xxx.controller.Main", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

<<<<<<< HEAD
		onInit() {
=======
		onInit: function () {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			this.getRouter().getRoute("Main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

<<<<<<< HEAD
		patternMatched() {
			this.onClearModel();
=======
		patternMatched: function (oEvent) {
			this.onClearModel();
			this.onFireToShowMessages();
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
		}

	});
});