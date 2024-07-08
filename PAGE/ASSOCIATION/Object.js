sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], (BaseController) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched(oEvent) {
			const sID = oEvent.getParameter("arguments")?.ID;
			const sPath = this.getModel().createKey("/MainSet", {
				ID: sID
			});

			this.getView().bindElement({ path: sPath });
		}

	});
});