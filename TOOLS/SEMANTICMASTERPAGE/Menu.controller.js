/*global history */
sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], (BaseController, History, Device) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.controller.Menu", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.oHashChanger = this.getRouter().oHashChanger;
			this.bFirst = true;
		},

		onAfterRendering() {
			if (this.bFirst) {
				this.bFirst = false;
			}
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onNavBack() {
			const oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (History.getInstance().getPreviousHash() !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		},

		onSelectionChange(oEvent) {
			this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		onUpdateFinished() {
			this.selectMenuItem();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		selectMenuItem() {
			if (!Device.system.phone) {
				const aMenu = this.getModel("Menu").getData();
				const oList = this.byId("List");

				if (aMenu.length > 0) {
					const sIndex = aMenu.findIndex(oMenu => oMenu.pattern === this.oHashChanger.getHash());

					this.oSelectedItem = oList.getItems()?.find(oItem => oItem.getBindingContextPath() === `/${sIndex}`);

					oList.setSelectedItem(this.oSelectedItem);
				}
			}
		},

		showDetail(oItem) {
			const bReplace = !Device.system.phone;
			const oMenu = oItem.getBindingContext("menu").getObject();
			const oList = this.byId("List");
			const oModel = this.getModel();
			const oRouter = this.getRouter();
			const fnNavToCreate = () => {
				oRouter.oHashChanger.replaceHash("");

				this.oSelectedItem = oItem;

				oModel.resetChanges();
				oModel.navTo(oMenu.View, {}, bReplace);
			};
			const fnCancel = () => {
				oList.setSelectedItem(this.oSelectedItem);
			};

			this.oSelectedItem = oItem;

			if (["ViewI", "ViewII"].includes(oMenu.View)) {
				oRouter.navTo(oMenu.View, {}, bReplace);
			}
		}
	});
});