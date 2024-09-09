sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"sap/ui/model/json/JSONModel"
], (BaseController, Library, Spreadsheet, JSONModel) => {
	"use strict";

	const EdmType = Library.EdmType;

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				Items: [],
				Value: ""
			}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onExport() {
			const oModel = this.getModel();
			const oTable = this.byId("Table");
			const oRowBinding = oTable?.getBinding("items") || oTable?.getBinding("rows");
			const aColumns = this.createColumns();
			const oSettings = {
				dataSource: oRowBinding,
				fileName: "Table Export.xlsx",
				workbook: { columns: aColumns }
			};
			const oSheet = new Spreadsheet(oSettings);

			oRowBinding?.oList = oRowBinding?.oList?.map(oData => ({
				...oData,
				Description: oModel.getProperty(`/...VHSet('${oData.ID}')/Description`)
			}));

			oSheet?.build()?.finally(() => oSheet.destroy());
		},

		onExportDraft() {
			const aData = [{ ID: "ABC", Key: "123", Text: "Material" }];
			const aColumns = [
				{ label: this.getText("id"), property: "ID", type: "string" },
				{ label: this.getText("key"), property: "Key", type: "string" },
				{ label: this.getText("text"), property: "Text", type: "string" }
			];
			const oSettings = {
				fileName: "Draft.xlsx",
				dataSource: aData,
				workbook: { columns: aColumns }
			};
			const oSheet = new Spreadsheet(oSettings);

			oSheet?.build()?.finally(() => oSheet.destroy());
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		createColumns() {
			const oTable = this.byId("Table");
			const aColumns = [];

			oTable?.getColumns()?.forEach((oColumn, iIndex) => {
				const sLabel = oColumn?.getHeader()?.getText();
				const sPath = oTable?.getItems()[0]?.getCells()[iIndex]?.getBindingContext()?.getPath();

				aColumns.push({
					label: sLabel,
					property: sPath,
					type: EdmType.String,
					width: oColumn.getWidth()
				});
			});

			aColumns.push(
				// Boolean
				{
					label: this.getText("active"),
					property: "Active",
					type: EdmType.Boolean,
					falseValue: this.getText("no"),
					trueValue: this.getText("yes")
				},
				// Date
				{
					label: this.getText("birthdate"),
					property: "Birthdate",
					type: EdmType.Date,
					format: "dd-mm-yyyy"
				},
				// Decimal
				{
					label: this.getText("value"),
					property: "value",
					type: EdmType.Decimal,
					textAlign: "end"
				},
				// Number
				{
					label: this.getText("salary"),
					property: "Salary",
					type: EdmType.Number,
					delimiter: true,
					scale: 2
				},
				// String
				{
					label: this.getText("currency"),
					property: "Currency",
					type: EdmType.String,
					width: 25
				},
				// String II
				{
					label: this.getText("fullname"),
					property: ["Firstname", "Lastname"],
					type: EdmType.String,
					template: "{0}, {1}"
				},
				// String III (Date(YYYYMMDD) -> String(DD.MM.YYYY))
				{
					inputFormat: "^([0-9]{4})([0-9]{2})([0-9]{2})$",
					label: this.getText("date"),
					property: "Date",
					template: "{2}.{1}.{0}",
					type: EdmType.String
				},
				// Time
				{
					label: this.getText("time"),
					property: "Time/ms",
					type: EdmType.Time
				}
			);

			return aColumns;
		}

	});
});