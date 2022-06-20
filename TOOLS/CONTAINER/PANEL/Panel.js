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
			this.setModel(
				new JSONModel({					
					Items: [],
					Value: ""
			}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);

			this.byId("Panel").setExpanded(false);
		},

        /* ============== */
        /* Event Handlers */
        /* ============== */

        /* ================ */
        /* Internal Methods */
        /* ================ */

		patternMatched: function (oEvent) {
							
		}

    });

});