sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/TabContainerItem",
	"sap/ui/model/json/JSONModel"
], function (BaseController, TabContainerItem, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.TabContainer", {

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

		onAddTCI: function () {
			const oTabContainer = this.byId("TabContainer");
			const oTCI = new TabContainerItem({
				additionalText: "Developer",
				icon: "sap-icon://group",
				iconTooltip: "UI",
				name: "New Employee",
				modified: false
			});

			oTabContainer.addItem(oTCI);
			oTabContainer.setSelectedItem(oTCI);
		},

		onDeleteTCI: function (oEvent) {
			const oSelectedItem = oEvent.getParameter("item");

			MessageBox.confirm("Do You Want to Close The Tab '" + oSelectedItem.getName() + "' ?", {
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						this.byId("TabContainer").removeItem(oSelectedItem);
					}
				}
			});
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});

});