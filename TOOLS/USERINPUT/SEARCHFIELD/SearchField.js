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
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		/* ============== */
        /* Event Handlers */
        /* ============== */

		onLiveChange: function (oEvent) {
			const sValue = oEvent.getParameter("newValue");
		},

		onSearch: function(oEvent){

		}

	});

});