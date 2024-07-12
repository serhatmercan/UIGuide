sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], (BaseController, History, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

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