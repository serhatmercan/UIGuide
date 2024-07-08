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
			const oTable = this.byId("Table");
			const aCells = oTable.getItems()[0].getCells();

			oTable.getColumns().forEach((oColumn, iIndex) => {
				const sLabel = oColumn.getAggregation("header").getProperty("text");
				const sPath = aCells[iIndex].getBindingInfo("text").binding.getPath();

				aExcelColumns.push({
					label: sLabel,
					property: sPath,
					type: EdmType.String,
					width: oColumn.getWidth()
				});
			});

			// Boolean
			aColumns.push({
				label: this.getText("active"),
				property: "Active",
				type: EdmType.Boolean,
				falseValue: this.getText("no"),
				trueValue: this.getText("yes")
			});

			// Date
			aColumns.push({
				label: this.getText("birthdate"),
				property: "Birthdate",
				type: EdmType.Date,
				format: "dd-mm-yyyy",
			});

			// Decimal
			aColumns.push({
				label: this.getText("value"),
				property: "value",
				type: EdmType.Decimal,
				textAlign: "end"
			});

			// Number
			aColumns.push({
				label: this.getText("salary"),
				property: "Salary",
				type: EdmType.Number,
				delimiter: true,
				scale: 2
			});

			// String
			aColumns.push({
				label: this.getText("currency"),
				property: "Currency",
				type: EdmType.String,
				width: 25
			});

			// String II
			aColumns.push({
				label: this.getText("fullname"),
				property: ["Firstname", "Lastname"],
				type: EdmType.String,
				template: "{0}, {1}"
			});

			// String III (Date(YYYYMMDD) -> String(DD.MM.YYYY))
			aColumns.push({
				inputFormat: "^([0-9]{4})([0-9]{2})([0-9]{2})$",
				label: this.getText("date"),
				property: "Date",
				template: "{2}.{1}.{0}",
				type: EdmType.String
			});

			// Time
			aColumns.push({
				label: this.getText("time"),
				property: "Time/ms",
				type: EdmType.Time,
			});

			return aColumns;
		},

		patternMatched: function (oEvent) {

		}

	});

});