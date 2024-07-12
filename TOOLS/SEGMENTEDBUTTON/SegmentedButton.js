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
			const oViewModel = new JSONModel({
				Busy: false,
				Value: "SBIA"
			});

			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onSelectionChange(oEvent) {
			const sKey = oEvent.getParameter("item").getKey();
			let sItemKey = "";

			switch (oEvent.getParameter("item").getKey()) {
				case "SBIA":
					sItemKey = "A";
					break;
				case "SBIAB":
					sItemKey = "B";
					break;
			}
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});
});
