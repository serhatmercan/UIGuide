sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/GroupHeaderListItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, GroupHeaderListItem, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(
				new JSONModel({
					Count: 0,
					Results: [],
					Value: "",
					Values: []
				}), "model"
			);

			this.byId("List").attachEventOnce("updateFinished", () => { });
			this.byId("List").removeSelections();
		},

		onAfterRendering() {
			const oListBinding = this.byId("List").getBinding("items");

			oListBinding.attachDataRequested(() => { });
			oListBinding.attachDataReceived(() => { });
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAcceptNLI(oEvent) {
			const oItem = oEvent.getSource().getParent().getParent();
			const sPath = oItem.getBindingContextPath();
			const oContext = this.getModel().getObject(sPath);
		},

		onDelete(oEvent) {
			const sPath = oEvent.getParameter("listItem").getBindingContextPath();
			const aIndexes = sPath.split("/");
			const iIndex = parseInt(aIndexes.pop(), 10);
			const sModelPath = aIndexes.join("/");
			const oViewModel = this.getModel("model");
			const aResults = oViewModel.getProperty(sModelPath);

			aResults.splice(iIndex, 1);
			oViewModel.setProperty(sModelPath, aResults);
		},

		onDetailNLI(oEvent) {
			const oItem = oEvent.getSource().getParent().getBindingContext().getObject();
		},

		onItemPress(oEvent) { },

		onLiveChange(oEvent) {
			const sValue = oEvent.getParameter("newValue");
			const oBinding = this.byId("List").getBinding("items");

			oBinding.filter([new Filter("ID", FilterOperator.Contains, sValue)]);
		},

		onOLI(oEvent) {
			const sID = oEvent.getParameter("listItem").getBindingContext().getProperty("ID");
		},

		onPress(oEvent) {
			const oData = oEvent.getSource().getBindingContext("model").getObject();
			const sValue = oEvent.getSource().getBindingContext().getProperty("Value");
		},

		onSelectionChange(oEvent) {
			const oItem = oEvent.getParameter("listItem") || oEvent.getSource();
			const sID = oItem.getBindingContext().getProperty("ID");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		createGroupHeader(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		}

	});
});