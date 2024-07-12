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
			const oViewModel = new JSONModel({
				RBExternal: true,
				RBInternal: false,
			});
			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onSelectRBG(oEvent) {
			const iIndex = oEvent.getSource().getSelectedIndex();

			switch (iIndex) {
				case 0:
					break;
				case 1:
					break;
				default:
					break;
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getSelectedIndex() {
			return this.byId("idRBG").getSelectedIndex();
		}

	});
});