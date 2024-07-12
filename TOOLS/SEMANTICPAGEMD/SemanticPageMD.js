sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], (BaseController, History, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit() {
			const sPath = jQuery.sap.getModulePath("com.serhatmercan.model", "/Menu.json");
			const oViewModel = new JSONModel(sPath);

			this.setModel(oViewModel, "viewModel");
		},

		onSelectionChange(oEvent) {
			const oItem = oEvent.getParameter("listItem").getBindingContext().getObject();

			if (oItem) {
				this.goCurrentView(oItem);
			}

			oEvent.getSource().removeSelections();
		},

		goCurrentView(oItem) {
			this.getRouter().navTo(oItem.view, {}, false);
		},

		onNavBack() {
			const sPreviousHash = History.getInstance().getPreviousHash();
			const oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}
		}

	});
});