sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, History) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({					
					Items: [],
					Value: ""
			}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

        /* ============== */
        /* Event Handlers */
        /* ============== */

		onNavBack: function () {
			if (History.getInstance().getPreviousHash() !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Main", {}, true);
			}
		},

        /* ================ */
        /* Internal Methods */
        /* ================ */

		patternMatched: function (oEvent) {
							
		}

    });

});