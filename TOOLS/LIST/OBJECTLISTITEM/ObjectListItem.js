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
		},

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onOLI: function (oEvent) {
			const sID = oEvent.getParameter("listItem").getBindingContext().getProperty("ID");
		},

        /* ================ */
        /* Internal Methods */
        /* ================ */

		patternMatched: function (oEvent) {
							
		}

    });

});