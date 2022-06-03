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
			
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getSelectedIndex: () => {
			return this.byId("idRBG").getSelectedIndex();
		}
		

	});

});