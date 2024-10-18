sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/CheckBox",
	"sap/m/Input",
	"sap/m/Label",
	"sap/m/LabelDesign",
	"sap/m/ObjectIdentifier",
	"sap/ui/core/TextAlign",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Column"
], (BaseController, CheckBox, Input, Label, LabelDesign, ObjectIdentifier, TextAlign, Filter, FilterOperator, JSONModel, Column) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				Columns: [],
				Items: [],
				Value: ""
			}), "model");

			const oTable = this.byId("Table");
			const oViewModel = this.getModel("model");

			oTable.attachRowSelectionChange(oEvent => {
				const aIndices = oEvent.getSource()?.getSelectedIndices();
				oViewModel.setProperty("/Statu", aIndices?.length === 1);
			});

			oTable.getColumns().forEach(oColumn => {
				const sColumnLabelText = oColumn.getLabel()?.getText();
				switch (sColumnLabelText) {
					case "Column I":
						oColumn.$().css("background", "#507d2a");
						break;
				}
			});

			oTable.onRowsUpdated = () => {
				oTable.getRows().forEach(oRow => {
					const sPath = oRow.getBindingContext("model").getPath();

					if (oRow.getBindingContext("model") && oViewModel.getProperty(sPath + "/ID") === "X") {
						$("#" + oRow.getId()).css("background-color", "red");
					}
				});

				oTable.getRows().forEach((oRow, iIndex) => {
					oRow.getCells().forEach(oCell => {
						const oCellData = oCell.getBinding("title");
						const sCellPath = oCellData.getPath();

						if (sCellPath !== "Type" && iIndex === 0) {
							$($(oCell.$().children()).children()).children().css("font-size", "2rem");
						}

						if (sCellPath === "Type") {
							switch (oCellData.getValue()) {
								case "General":
									oCell.$().parent().parent().css("background", "#77dd77");
									break;
								case "A Project":
									oCell.$().parent().parent().css("background", "#ADE191");
									break;
							}
						}

						if (sCellPath === "PaidCount") {
							oCell.$().parent().parent().css("background", "#EAFFCD");
						}
					});
				});
			};

			oTable.clearSelection();
			oTable.getBinding("rows").refresh(true);

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onChange(oEvent) {
			const sPath = oEvent.getParameter("rowContent").getPath();
		},

		onDrop(oEvent) {
			const oDragSession = oEvent.getParameter("dragSession");
			const oDroppedRow = oEvent.getParameter("droppedControl");
			const iDraggedIndex = oDragSession.getDragControl("getDragControl").getIndex();
			const iDroppedRowIndex = oDroppedRow.getIndex();
		},

		onPressRAI(oEvent) {
			const sID = oEvent.getSource().getBindingContext().getProperty("ID");
		},

		onShow(oEvent) {
			const sID = this.getModel("model").getProperty(oEvent.getSource().getParent().getBindingContext("model").getPath() + "/ID");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addColumn() {
			this.initTable("Table", 2);
			this.addColumnToTable("Table", 2);
		},

		addColumnToTable(sID, iColumnNumber) {
			const oTable = this.byId(sID);

			for (let i = 0; i < iColumnNumber; i++) {
				oTable.addColumn(new Column({
					hAlign: "Center",
					label: new Label({
						text: `Column ${i + 1}`
					}),
					template: new Input({
						value: `{model>Column${i + 1}}`,
						type: "Number"
					})
				}));
			}
		},

		factory(sId, oContext, oParams) {
			const oBindingValue = {
				parts: [
					{ model: "model", path: oContext.getProperty("valuePath") },
					{ model: "model", path: oContext.getProperty("additionalValuePath") }
				],
				formatter: formatter.dynamicCellValueWithKey
			};
			const oTemplate = oContext.getProperty("additionalValuePath") ?
				new ObjectIdentifier({
					title: oBindingValue,
					text: {
						model: "model",
						path: oContext.getProperty("additionalValuePath")
					},
					textAlign: TextAlign.Center
				}) :
				new Label({
					text: oBindingValue,
					textAlign: TextAlign.Center,
					wrapping: true
				});

			return new Column({
				hAlign: TextAlign.Center,
				label: new Label({
					design: LabelDesign.Bold,
					text: oContext.getProperty("label"),
					textAlign: TextAlign.Center,
					wrapping: true
				}),
				minWidth: oContext.getProperty("width") || 96,
				template: oTemplate,
				autoResizable: true
			});
		},

		generateColumns(aData) {
			const aColumns = [
				{
					uiobject: "label",
					label: this.getText("text"),
					width: 300,
					valuePath: "Text",
					additionalValuePath: "Description"
				},
				{
					uiobject: "label",
					label: this.getText("unit"),
					valuePath: "Meins"
				},
				{
					uiobject: "label",
					label: this.getText("number"),
					valuePath: "Number",
					type: "sap.ui.model.type.Float",
					formatOptions: {
						decimals: 2
					}
				}
			];

			this.getModel("model").setProperty("/Columns", aColumns);
		},

		getContexts() {
			return this.byId("Table").getBinding("rows").getContexts();
		},

		getSelectedRows() {
			const oTable = this.byId("Table");
			return oTable.getSelectedIndices().map(iIndex => oTable.getContextByIndex(iIndex).getObject());
		},

		getVisibleRowCount() {
			return this.byId("Table").getVisibleRowCount();
		},

		initTable(sID, iStaticColumn) {
			const oTable = this.byId(sID);
			const aColumns = oTable.getColumns();
			const aColumnsToRemove = aColumns.slice(iStaticColumn);

			aColumnsToRemove.forEach(oColumn => oTable.removeColumn(oColumn));
		},

		patternMatched(oEvent) {
			const oBindingContext = this.getView().getBindingContext();

			if (oBindingContext) {
				this.getModel().deleteCreatedEntry(oBindingContext);
			}
		},

		setFilter() {
			const aFilters = [new Filter("Value", FilterOperator.EQ, "X")];
			this.byId("Table").getBinding("rows").filter(aFilters);
		}

	});

});