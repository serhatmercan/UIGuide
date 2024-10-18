sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/ColumnListItem",
	"sap/m/Label",
	"sap/m/Text",
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Column"
], (BaseController, ColumnListItem, Label, Text, ValueHelpDialog, Filter, FilterOperator, JSONModel, UIColumn) => {
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

		onCancel() {
			if (this.oVHD) {
				this.oVHD.close();
				this.oVHD.destroy();
				this.oVHD = null;
			}
		},

		async onShowVHD() {
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

			await this.loadFragment({
				name: "com.serhatmercan.fragments.dialog.VHD"
			}).then((oDialogSuggestions) => {
				this.oVHD = oDialogSuggestions;

				oDialogSuggestions.getTableAsync().then((oTable) => {
					if (oTable.bindRows) {
						oTable.bindAggregation("rows", {
							path: "/...SHSet",
							events: {
								dataReceived: () => { oDialogSuggestions.update() }
							}
						});

						let oUIColumn = new UIColumn({
							label: new Label({
								text: this.getText("Key")
							}),
							template: new Text({
								text: "{Key}",
								wrapping: false
							})
						});

						oUIColumn.data({
							fieldName: "Key"
						});

						oTable.addColumn(oUIColumn);

						oDialogSuggestions.update();
					}

					oDialogSuggestions.open();
				});
			});
		},

		onOK(oEvent) {
			const aTokens = oEvent.getParameter("tokens");
		},

		onSearchFB() {
			const aSearchValues = oEvent.getParameter("selectionSet");
			const aFilters = [];

			aSearchValues.forEach(oSearchValue => {
				const sName = oSearchValue.getProperty("name");
				const sValue = oSearchValue.getProperty("value");

				if (sValue !== "") aFilters.push(new Filter(sName, FilterOperator.EQ, sValue));
			});

			if (!aFilters.length) return;

			this.oVHD.getTableAsync().then((oTable) => {
				const oBinding = oTable.getBinding("items") || oTable.getBinding("rows");

				if (oBinding) oBinding.filter(aFilters);

				this.oVHD.update();
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