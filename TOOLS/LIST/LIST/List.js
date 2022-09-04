sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Count: 0,
					Results: [],
					Value: "",
					Values: []
				}), "model"
			);

			this.byId("List").removeSelections();
		},

		onAfterRendering: function() {
			this.byId("List").getBinding("items").attachDataRequested((oEvent) => {

			});			
			this.byId("List").getBinding("items").attachDataReceived((oEvent) => {

			});
		},	

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onDelete: function (oEvent) {
			const sPath = oEvent.getParameter("listItem").getBindingContextPath();
			const sPathItem = oEvent.getParameter("listItem").getBindingContext("model").getPath();
			const aIndexes = sPath.split("/");
			const sIndex = aIndexes[aIndexes.length - 1];
			const oModel = this.getModel("model");
			let sModelPath;
			let aResults;

			aIndexes.pop();
			sModelPath = aIndexes.join("/");
			aResults = oModel.getProperty(sModelPath);
			aResults.splice(parseInt(sIndex), 1);
			oModel.setProperty(sModelPath, aResults);
		},

		onItemPress: function (oEvent) {

		},

		onLiveChange: function () {
			const sValue = oEvent.getParameter("newValue");
			const aItems = this.byId("List").getBinding("items");

			aItems.filter([new Filter("ID", FilterOperator.Contains, sValue)]);
		},

		onOLI: function (oEvent) {
			const sID = oEvent.getParameter("listItem").getBindingContext().getProperty("ID");
		},

		onPress: function (oEvent) {
			const oData = oEvent.getSource().getBindingContext("model").getObject();
		},

		onSelectionChange: function(oEvent){
			const oItem = oEvent.getParameter("listItem") || oEvent.getSource();
			const sID = oItem.getBindingContext().getProperty("ID");
		}

	});

});