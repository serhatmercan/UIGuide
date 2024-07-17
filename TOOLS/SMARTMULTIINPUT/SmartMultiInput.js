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
			this.setModel(
				new JSONModel({
					Items: [],
					Value: ""
				}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGetSMIData() {
			return this.byId("SmartMultiInput")?.getTokens()?.map(oToken => oToken?.getProperty("key"));
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});

});