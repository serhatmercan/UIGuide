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
			this.setModel(new JSONModel({
				Items: [],
				Value: ""
			}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onTP(oEvent) {
			const oSelectedItem = oEvent.getSource().getSelectedItem();
			const sTitle = oSelectedItem?.getAggregation("cells")[0]?.getTitle();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() { }

	});
});