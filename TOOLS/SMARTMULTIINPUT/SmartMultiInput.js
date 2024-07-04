sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Items: [],
					Value: ""
				}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGetSMIData: function () {
			const aSMIData = [];

			this.byId("SmartMultiInput").getTokens().forEach((oToken) => {
				aSMIData.push(oToken.getProperty("key"));
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {

		}

	});

});