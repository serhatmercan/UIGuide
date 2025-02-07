sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				Items: [],
				Value: ""
			}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onCancelTSD() {
			this.oDialog.destroy();
			this.oDialog = null;
		},

		onConfirmTSD(oEvent) {
			const oModel = this.getModel();
			const aSelectedItems = oEvent.getParameter("selectedContexts").map(oContext => oModel.getProperty(oContext.getPath()));
			const oSelectedItem = oEvent.getParameter("selectedItem");
			const oSIData = oSelectedItem?.getBindingContext("model")?.getObject();
			const sKey = oSIData?.Key;

			this.onCancelTSD();
		},

		onLiveChangeTSD(oEvent) {
			const sTSDID = oEvent.getSource().getId();
			const sValue = oEvent.getParameter("value");
			const aFilters = [
				new Filter("Text", FilterOperator.Contains, sValue),
				new Filter("Text", FilterOperator.Contains, sValue.toLowerCase()),
				new Filter("Text", FilterOperator.Contains, sValue.toUpperCase())
			];

			this.byId("TSD")?.getBinding("items")?.filter(aFilters);
			sap.ui.getCore().byId(sTSDID)?.getBinding("items")?.filter(aFilters, "Application");
		},

		onSearchTSD(oEvent) {
			const sTSDID = oEvent.getSource().getId();
			const sValue = oEvent.getParameter("value");
			const aFilters = [
				new Filter("Text", FilterOperator.Contains, sValue),
				new Filter("Text", FilterOperator.Contains, sValue.toLowerCase()),
				new Filter("Text", FilterOperator.Contains, sValue.toUpperCase())
			];

			this.byId("TSD")?.getBinding("items")?.filter(aFilters);
			sap.ui.getCore().byId(sTSDID)?.getBinding("items")?.filter(aFilters, "Application");
		},

		async onShowTSD() {
			if (!this.oTSDDialog) {
				this.oTSDDialog = await this.loadFragment({
					name: "com.serhatmercan.fragments.TSD",
					controller: this
				});
				this.getView().addDependent(this.oTSDDialog);
			}

			this.oTSDDialog.open();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() { }

	});
});