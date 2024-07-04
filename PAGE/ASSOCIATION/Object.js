sap.ui.define([
	"com/serhatmercan/controller/BaseController"	
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {
			const sPath = this.getModel().createKey("/MainSet", {
				ID: oEvent.getParameter("arguments").ID
			});

			this.getView().bindElement({
				path: sPath
			});
		}

	});

});