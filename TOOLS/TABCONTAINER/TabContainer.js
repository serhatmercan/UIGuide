sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/TabContainerItem",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageBox, TabContainerItem, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.TabContainer", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				Items: [],
				Value: ""
			}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAddTCI() {
			const oTabContainer = this.byId("TabContainer");
			const oTCI = new TabContainerItem({
				additionalText: "Developer",
				icon: "sap-icon://group",
				iconTooltip: "UI",
				name: "New Employee",
				modified: false
			});

			oTabContainer?.addItem(oTCI);
			oTabContainer?.setSelectedItem(oTCI);
		},

		onDeleteTCI(oEvent) {
			const oTabContainer = this.byId("TabContainer");
			const oSelectedItem = oEvent?.getParameter("item");
			const sTabName = oSelectedItem?.getName();

			MessageBox.confirm(`Do You Want to Close The Tab '${sTabName}'?`, {
				onClose: (oAction) => {
					if (oAction === MessageBox.Action.OK) {
						oTabContainer.removeItem(oSelectedItem);
					}
				}
			});
		}

	});
});