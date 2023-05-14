sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const oModel = new JSONModel({
				RBExternal: true,
				RBInternal: false,
			});

			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onSelectRBG: function (oEvent) {
			const iIndex = oEvent.getSource().getSelectedIndex();

			switch (oEvent.getSource().getSelectedIndex()) {
				case 0:
					break;
				case 1:
					break;
				case 2:
					break;
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getSelectedIndex: () => {
			return this.byId("idRBG").getSelectedIndex();
		}


	});

});