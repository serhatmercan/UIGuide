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
			const oModel = new JSONModel({
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onDeleteFLI(oEvent) {
			const oViewModel = this.getModel("model");
			const aItems = oViewModel.getProperty("/Items");
			const sPath = oEvent.getParameter("item").getBindingContextPath();
			const iIndex = +sPath.split("/").pop();

			aItems.splice(iIndex, 1);
			oViewModel.setProperty("/Items", aItems);
		},

		onPostFI(oEvent) {
			const sValue = oEvent.getParameter("value");
			const oViewModel = this.getModel("model");
			const aItems = oViewModel.getProperty("/Items");

			aItems.push({
				Date: new Date(),
				Icon: oEvent.getSource().getProperty("icon"),
				Info: "",
				User: "XSMERCAN",
				Text: sValue
			});

			oViewModel.setProperty("/Items", aItems);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() { }

	});
});