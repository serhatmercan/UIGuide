sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, ColumnListItem, Label, ValueHelpDialog, Filter, FilterOperator, JSONModel) => {
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

		onShowVHD() {
			this.oVHD = new ValueHelpDialog({
				title: "VHD",
				key: "Key",
				descriptionKey: "Value",
				supportMultiselect: false,
				supportRanges: false,
				supportRangesOnly: false,
				ok: (oEvent) => {
					const aTokens = oEvent.getParameter("tokens");
					const sKey = aTokens[0]?.getKey();
					const sText = aTokens[0]?.getText();

					this.oVHD.close();
				},
				cancel: (oEvent) => {
					this.oVHD.close();
				}
			});

		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		createVHD() {
			const aColumns = [{
				"Label": "Key Code",
				"Template": "Key"
			}, {
				"Label": "Text",
				"Template": "Text"
			}];
			const oColumnModel = new JSONModel({
				"Columns": aColumns
			});
			const oVHDTable = this.oVHD.getTable();
			const aFilters = [
				new Filter("Key", FilterOperator.EQ, "01")
			];

			oVHDTable.setModel(oColumnModel, "columns");

			if (oVHDTable.bindRows) {
				oVHDTable.bindRows({
					path: "/",
					filters: aFilters
				});
			}

			if (oVHDTable.bindItems) {
				oVHDTable.bindAggregation("items", {
					path: "/",
					filters: aFilters,
					template: new ColumnListItem({
						cells: aColumns.map((oColumn) => {
							return new Label({
								text: "{" + oColumn.Template + "}"
							});
						})
					})
				});
			}

			this.oVHD.setTokens(this.byId("MultiInput").getTokens());
			this.oVHD.update();
			this.oVHD.open();
		},

		patternMatched() { }

	});
});