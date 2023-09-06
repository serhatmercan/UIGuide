sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/CheckBox",
	"sap/m/Column",
	"sap/m/Input",
	"sap/m/Label"
], function (BaseController, JSONModel, Filter, FilterOperator, CheckBox, Column, Input, Label) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Columns: [],
					Items: [],
					Value: ""
				}), "model"
			);

			this.byId("Table").onRowsUpdated = function () {
				this.byId("Table").getRows().forEach(oRow => {
					if (oRow.getBindingContext("model") &&
						this.getModel("model").getProperty(oRow.getBindingContext("model").getPath() + "/ID") === "X") {
						$("#" + oRow.getId()).css("background-color", "red");
					}
				});
			}.bind(this);

			this.byId("Table").clearSelection();
			this.byId("Table").getBinding("rows").refresh(true);

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onChange: function (oEvent) {
			const sPath = oEvent.getParameter("rowContent").getPath();
		},

		onDrop: function (oEvent) {
			const oDragSession = oEvent.getParameter("dragSession");
			const oDroppedRow = oEvent.getParameter("droppedControl");
			const iDragedIndex = oDragSession.getDragControl("getDragControl").getIndex();
			const iDroppedRowIndex = oDroppedRow.getIndex();
		},

		onPressRAI: function (oEvent) {
			const sID = oEvent.getSource().getBindingContext().getProperty("ID");
		},

		onShow: function (oEvent) {
			const sID = this.getModel("model").getProperty(oEvent.getSource().getParent().getBindingContext("model").getPath() + "/ID");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addColumn: function () {
			this.initTable("Table", 2);
			this.addColumnToTable("Table", 2);
		},

		addColumnToTable: function (sID, iColumnNumber) {
			const oTable = this.byId(sID);

			for (let i = 0; i < iColumnNumber; i++) {
				oTable.addColumn(new sap.ui.table.Column({
					hAlign: "Center",
					label: new Label({
						text: "Column" + " " + (i + 1)
					}),
					path: "model>/Table",
					template: new Input({
						value: "{model>Column" + (i + 1) + "}",
						type: "Number"
					})
				}));
			}
		},

		factory: function (sId, oContext, oParams) {
			let oBindingValue,
				oAdditionalBindingValue,
				oTemplate;

			oBindingValue = {
				formatOptions: oContext.getProperty("formatOptions"),
				model: "model",
				path: oContext.getProperty("valuePath"),
				type: oContext.getProperty("type")
			};

			oBindingValue = {
				parts: [{
					model: "model",
					path: oContext.getProperty("valuePath")
				}, {
					model: "model",
					path: oContext.getProperty("additionalValuePath")
				}],
				formatter: formatter.dynamicCellValueWithKey
			};

			if (oContext.getProperty("additionalValuePath")) {
				oAdditionalBindingValue = {
					formatOptions: oContext.getProperty("formatOptions"),
					model: "model",
					path: oContext.getProperty("additionalValuePath"),
					type: oContext.getProperty("type")
				};

				oTemplate = new sap.m.ObjectIdentifier({
					title: oBindingValue,
					text: oAdditionalBindingValue,
					textAlign: sap.ui.core.TextAlign.Center
				});
			} else {
				oTemplate = new sap.m.Label({
					text: oBindingValue,
					textAlign: sap.ui.core.TextAlign.Center,
					wrapping: true
				});
			}

			return new sap.ui.table.Column({
				hAlign: sap.ui.core.TextAlign.Center,
				label: new sap.m.Label({
					design: sap.m.LabelDesign.Bold,
					text: oContext.getProperty("label"),
					textAlign: sap.ui.core.TextAlign.Center,
					wrapping: true
				}),
				minWidth: oContext.getProperty("width") || 96,
				template: oTemplate,
				autoResizable: true
			});
		},

		generateColumns: function (aData) {
			const oResourceBundle = this.getResourceBundle();
			const aColumns = [];

			aColumns.push({
				uiobject: "label",
				label: oResourceBundle.getText("text"),
				width: 300,
				valuePath: "Text",
				additionalValuePath: "Description"
			});

			aColumns.push({
				uiobject: "label",
				label: oResourceBundle.getText("unit"),
				valuePath: "Meins"
			});

			aColumns.push({
				uiobject: "label",
				label: oResourceBundle.getText("number"),
				valuePath: "Number",
				type: "sap.ui.model.type.Float",
				formatOptions: {
					decimals: 2
				}
			});

			this.getModel("model").setProperty("/Columns", aColumns);
		},

		getContexts: function () {
			return this.byId("Table").getBinding("rows").getContexts();
		},

		getSelectedRows: function () {
			const oTable = this.byId("Table");
			let aItems = [];

			oTable.getSelectedIndices().forEach(iIndex => {
				aItems.push(oTable.getContextByIndex(iIndex).getObject());
			});

			return aItems;
		},

		getVisibleRowCount: function () {
			return this.byId("Table").getVisibleRowCount();
		},

		initTable: function (sID, iStaticColumn) {
			const oTable = this.byId(sID);

			for (let i = oTable.getColumns().length; i >= iStaticColumn; i--) {
				oTable.removeColumn(i);
			}
		},

		patternMatched: function (oEvent) {
			const oBindingContext = this.getView().getBindingContext();

			if (oBindingContext) {
				this.getModel().deleteCreatedEntry(oBindingContext);
			}
		},

		setFilter: function () {
			let aFilters = [
				new Filter("Value", FilterOperator.EQ, "X")
			];

			this.byId("Table").getBinding("rows").filter(aFilters);
		}

	});

});