sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.NotificationList", {

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

		onAcceptNLI(oEvent) {
			const oItem = oEvent.getSource().getParent().getParent();
			const sPath = oItem.getBindingContextPath();
			const oContext = this.getModel().getObject(sPath);
			const oItemData = oEvent.getSource().getParent().getBindingContext().getObject();
		},

		onCloseNLI(oEvent) {
			const oItem = oEvent.getSource();
			const oList = oItem.getParent();
			const sTitle = oItem.getTitle();

			oList.removeItem(oItem);
		},

		onPressNLI(oEvent) {
			const oItem = oEvent.getSource();
			const oList = oItem.getParent();
		},

		onRejectNLI(oEvent) {
			const oItem = oEvent.getSource().getParent().getParent();
			const sPath = oItem.getBindingContextPath();
			const oContext = this.getModel().getObject(sPath);
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});
});