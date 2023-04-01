/*global history */
sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"com/serhatmercan/model/models"
], function(BaseController, History, Device, Models) {
	"use strict";

	return BaseController.extend("com.serhatmercan.controller.Menu", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function() {
			this.oHashChanger = this.getRouter().oHashChanger;
			this.First = true;
		},

		onAfterRendering: function() {
			if (this.First) {
				this.First = false;
			}
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onNavBack: function() {
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

		onSelectionChange: function(oEvent) {
			this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		onUpdateFinished: function() {
			this.selectMenuItem();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		selectMenuItem: function() {
			if (!Device.system.phone) {
				const aMenu = this.getModel("Menu").getData();
				const oList = this.byId("List");
				let sIndex;

				if (aMenu.length > 0) {
					sIndex = aMenu.findIndex(oMenu => oMenu.pattern === this.oHashChanger.getHash());
					this.oSelectedItem = oList.getItems().find(x => x.getBindingContextPath() === "/" + sIndex);
					oList.setSelectedItem(this.oSelectedItem);
				}
			}
		},

		showDetail: function(oItem) {
			const bReplace = !Device.system.phone;
			const oMenu = oItem.getBindingContext("menu").getObject();
			const oList = this.byId("List");
			const fnNavToCreate = () => {
				this.getRouter().oHashChanger.replaceHash("");
				this.getModel().resetChanges();
				this.oSelectedItem = oItem;
				this.getRouter().navTo(oMenu.View, {}, bReplace);
			};
			const fnCancel = () => {
				oList.setSelectedItem(this.oSelectedItem);
			};

			this.oSelectedItem = oItem;

			if (oMenu.View == "ViewI" || oMenu.View == "ViewII") {
				this.getRouter().navTo(oMenu.View, {}, bReplace);
			}
			
		}

		
	});

});