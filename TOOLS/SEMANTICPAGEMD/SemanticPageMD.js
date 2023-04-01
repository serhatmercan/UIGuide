sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (BaseController, History, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			const oModel = new JSONModel(jQuery.sap.getModulePath("com.serhatmercan.model", "/Menu.json"));

			this.getView().setModel(oModel);

		},

		onSelectionChange: function (oEvent) {

			var oItem = oEvent.getParameter("listItem").getBindingContext().getObject();

			if (oItem) {
				this.goCurrentView(oItem);
			}

			oEvent.getSource().removeSelections();

		},

		goCurrentView: function (oItem) {
			this.getRouter().navTo(oItem.view, {}, false);
		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

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