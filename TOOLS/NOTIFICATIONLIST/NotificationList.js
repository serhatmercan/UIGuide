sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.NotificationList", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Items: [],
					Value: ""
				}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAcceptNLI: function (oEvent) {
			const oItem = oEvent.getSource().getParent().getParent();
			const sPath = oItem.getBindingContextPath();
			const oContext = this.getModel().getObject(sPath);
			const oItemData = oEvent.getSource().getParent().getBindingContext().getObject();
		},

		onCloseNLI: function (oEvent) {
			const oItem = oEvent.getSource();
			const oList = oItem.getParent();
			const sTitle = oItem.getTitle();

			oList.removeItem(oItem);
		},

		onPressNLI: function (oEvent) {
			const oItem = oEvent.getSource();
			const oList = oItem.getParent();
		},

		onRejectNLI: function (oEvent) {
			const oItem = oEvent.getSource().getParent().getParent();
			const sPath = oItem.getBindingContextPath();
			const oContext = this.getModel().getObject(sPath);
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});

});