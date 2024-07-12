sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], (BaseController, History, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Items: [],
				Value: ""
			});
			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGoToPage(sType) {
			const oRouter = this.getRouter();

			if (sType === "GTI") {
				oRouter.navTo("GTI");
			}
		},

		onNavBack() {
			const sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Main", {}, true);
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		setInitialPage() {
			setTimeout(() => {
				this.byId("Page").scrollTo(0, 0);
			}, 250);
		}

	});

});