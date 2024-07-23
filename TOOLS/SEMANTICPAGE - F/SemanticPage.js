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
				"ActionButtonsInfo": {
					"MidColumn": {
						"FullScreen": false,
						"Toolbar": true
					}
				},
				"Layout": "OneColumn"
			}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onCloseDetailPage() {
			this.getModel("model").setProperty("/ActionButtonsInfo/MidColumn/FullScreen", false);
			this.getRouter().navTo("main");
		},

		onExitFullScreenDetailPage() {
			const oViewModel = this.getModel("model");
			oViewModel.setProperty("/ActionButtonsInfo/MidColumn/FullScreen", false);
			oViewModel.setProperty("/Layout", "TwoColumnsMidExpanded");
		},

		onShowFullScreenDetailPage() {
			const oViewModel = this.getModel("model");
			oViewModel.setProperty("/ActionButtonsInfo/MidColumn/FullScreen", true);
			oViewModel.setProperty("/Layout", "MidColumnFullScreen");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() {
			this.getModel("model").setProperty("/Layout", "TwoColumnsMidExpanded");
		}

	});
});