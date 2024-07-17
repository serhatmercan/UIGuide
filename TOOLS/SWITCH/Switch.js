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
			this.setModel(new JSONModel({
				Busy: false,
				Value: ""
			}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onChange(oEvent) {
			const oViewModel = this.getModel("model");
			const bState = oEvent?.getParameter("state");
			const oContext = oEvent?.getSource()?.getBindingContext("model");
			const sPath = oContext?.getPath();

			oViewModel.setProperty(`${sPath}/Value`, bState);
		}

	});

});