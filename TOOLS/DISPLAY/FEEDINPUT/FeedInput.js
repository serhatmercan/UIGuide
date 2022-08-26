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

		onDeleteFLI: function(oEvent){
			const oModel = this.getModel("model");
			const aItems = oModel.getProperty("/Items");
			const sPath = oEvent.getParameter("item").getBindingContextPath();
			const iIndex = sPath.split("/")[sPath.split("/").length - 1];
			
			aItems.splice(iIndex, 1);			
			oModel.setProperty("/Items", aItems);
		},

		onPostFI: function(oEvent){
			const sValue = oEvent.getParameter("value");
			const oModel = this.getModel("model");
			const aItems = oModel.getProperty("/Items");

			aItems.push({
				Date: new Date(),
				Icon: oEvent.getSource().getProperty("icon"),
				Info: "",
				User: "XSMERCAN",
				Text: sValue   
			});

			oModel.setProperty("/Items", aItems);
		},

        /* ================ */
        /* Internal Methods */
        /* ================ */

		patternMatched: function (oEvent) {
							
		}

    });

});