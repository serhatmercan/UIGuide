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
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onOLI(oEvent) {
			const oListItem = oEvent.getParameter("listItem");
			const sID = oListItem?.getBindingContext()?.getProperty("ID");
			const aAttributes = oListItem.getAttributes();
			const sText = aAttributes[0]?.getText();
			const sNumberUnit = oListItem.getNumberUnit();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});
});