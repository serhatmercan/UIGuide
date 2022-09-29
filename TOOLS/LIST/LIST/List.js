sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/GroupHeaderListItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, GroupHeaderListItem, Filter, FilterOperator, JSONModel) {
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

			this.byId("List").attachEventOnce("updateFinished", () => {

			});

			this.byId("List").removeSelections();
		},

		onAfterRendering: function () {
			this.byId("List").getBinding("items").attachDataRequested((oEvent) => {

			});
			this.byId("List").getBinding("items").attachDataReceived((oEvent) => {

			});
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAcceptNLI: function (oEvent) {
			const oItem = oEvent.getSource().getParent().getParent();
			const sPath = oItem.getBindingContextPath();
			const oContext = this.getModel().getObject(sPath);
		},

		onDelete: function (oEvent) {
			const sPath = oEvent.getParameter("listItem").getBindingContextPath();
			const sPathItem = oEvent.getParameter("listItem").getBindingContext("model").getPath();
			const aIndexes = sPath.split("/");
			const sIndex = aIndexes[aIndexes.length - 1];
			const oViewModel = this.getModel("model");
			let sModelPath;
			let aResults;

			aIndexes.pop();
			sModelPath = aIndexes.join("/");
			aResults = oModel.getProperty(sModelPath);
			aResults.splice(parseInt(sIndex), 1);
			oViewModel.setProperty(sModelPath, aResults);
		},

		onDetailNLI: function (oEvent) {
			const oItem = oEvent.getSource().getParent().getBindingContext().getObject();
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

		onSelectionChange: function (oEvent) {
			const oItem = oEvent.getParameter("listItem") || oEvent.getSource();
			const sID = oItem.getBindingContext().getProperty("ID");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		createGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		}

	});

});