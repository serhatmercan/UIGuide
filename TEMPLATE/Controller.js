sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Library, Spreadsheet, JSONModel) {
	"use strict";

	const EdmType = Library.EdmType;

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

		onExport: function () {
			const oModel = this.getModel();
			const oTable = this.byId("Table");
			const oRowBinding = oTable.getBinding("items");
			const oRowBindinUI = oTable.getBinding("rows");
			const aColumns = this.createColumns();
			const oSettings = {
				dataSource: oRowBinding,
				fileName: "Table Export.xlsx",
				workbook: {
					columns: aColumns
				}
			};
			const oSheet = new Spreadsheet(oSettings);

			oRowBinding.oList = oRowBinding.oList.map(oData => ({
				...oData,
				Description: oModel.getProperty("/...VHSet('" + oData.ID + "')/Description")
			}));

			oSheet.build().finally(() => {
				oSheet.destroy();
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		createColumns: function () {
			const aColumns = [];
			const oResourceBundle = this.getResourceBundle();

			// Boolean
			aColumns.push({
				label: oResourceBundle.getText("active"),
				property: "Active",
				type: EdmType.Boolean,
				falseValue: oResourceBundle.getText("no"),
				trueValue: oResourceBundle.getText("yes")
			});

			// Date
			aColumns.push({
				label: oResourceBundle.getText("birthdate"),
				property: "Birthdate",
				type: EdmType.Date,
				format: "dd-mm-yyyy",
			});

			// Decimal
			aColumns.push({
				label: oResourceBundle.getText("value"),
				property: "value",
				type: EdmType.Decimal,
				textAlign: "end"
			});

			// Number
			aColumns.push({
				label: oResourceBundle.getText("salary"),
				property: "Salary",
				type: EdmType.Number,
				delimiter: true,
				scale: 2
			});

			// String
			aColumns.push({
				label: oResourceBundle.getText("currency"),
				property: "Currency",
				type: EdmType.String,
				width: 25
			});

			// String II
			aColumns.push({
				label: oResourceBundle.getText("fullname"),
				property: ["Firstname", "Lastname"],
				type: EdmType.String,
				template: "{0}, {1}"
			});

			// Time
			aCols.push({
				label: oResourceBundle.getText("time"),
				property: "Time/ms",
				type: EdmType.Time,
			});

			return aColumns;
		},

		patternMatched: function (oEvent) {

		}

	});

});