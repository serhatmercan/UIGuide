sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Text",
	"sap/ui/model/json/JSONModel"
], (BaseController, Text, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				Items: [],
				Value: ""
			}), "model");

			new sap.Text({
				text: "Text"
			}).addStyleClass(".redText");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() { }

	});
});