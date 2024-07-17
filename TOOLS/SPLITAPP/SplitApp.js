sap.ui.define([
	"./BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], (BaseController, Fragment, History, JSONModel) => {
	"use strict";

	return BaseController.extend("xxx.controller.SplitApp", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Items: [
					{ Title: "Title I", Fragment: "FI" },
					{ Title: "Title II", Fragment: "FII" },
					{ Title: "Title III", Fragment: "FIII" }
				]
			});
			this.setModel(oModel, "model");

			this.getRouter().getRoute("SplitApp").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onNavBack() {
			const sPreviousHash = History?.getInstance()?.getPreviousHash();
			const oCrossAppNavigator = sap.ushell.Container?.getService("CrossApplicationNavigation");

			if (sPreviousHash || !oCrossAppNavigator?.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator?.toExternal({
					target: { shellHash: "#Shell-home" }
				});
			}
		},

		onPressLI(oEvent) {
			const sFragment = oEvent?.getParameter("listItem")?.getBindingContext("model")?.getProperty("Fragment");

			if (!sFragment) return;

			this.setFragment(sFragment);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() {
			this.setFragment("MessagePage");
			this.byId("List").removeSelections();
		},

		async setFragment(sFragmentName) {
			const oDetailPage = this.byId("DetailPage");
			const oView = this.getView();
			const oFragment = await Fragment.load({
				id: oView.getId(),
				name: "com.serhatmercan.fragment." + sFragmentName,
				controller: this
			});

			oDetailPage?.destroyContent();
			oDetailPage?.addContent(oFragment);
		}

	});
});