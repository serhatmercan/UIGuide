sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/CheckBox",
	"sap/ui/model/json/JSONModel"
], (BaseController, CheckBox, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({ Value: "" });
			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onSelectCB(oEvent) {
			const sValue = oEvent.getSource().getSelected();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		generateCheckbox() {
			return new CheckBox({
				selected: "{model>Value}",
				select: (oEvent) => {
					const bSelected = oEvent.getParameter("selected");
				}
			});
		},

		getValue() {
			const sValue = this.byId("CheckBox").getSelected();
			return sValue;
		}

	});
});