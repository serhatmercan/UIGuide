sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageBox"
], function (BaseController, Formatter, MessageBox) {
	"use strict";

	return BaseController.extend("xxx.controller.Main", {

		Formatter: Formatter,

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.getRouter().getRoute("main").attachPatternMatched(this._onViewMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		_onViewMatched: function (oEvent) {

		}

	});
});