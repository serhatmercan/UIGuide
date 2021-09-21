sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			var oTableModel = new JSONModel({
				Columns: [],
				Items: [],
				Value: ""
			});

			this.setModel(oTableModel, "tableModel");
		},

		_generateColumns: function (aData) {
			const oBundle = this.getResourceBundle();
			const oModel = oTable.getModel("tableModel");
			const aColumns = [];

			aColumns.push({
				uiobject: "label",
				label: oBundle.getText("text"),
				width: 300,
				valuePath: "Text",
				additionalValuePath: "Description"
			});

			aColumns.push({
				uiobject: "label",
				label: oBundle.getText("unit"),
				valuePath: "Meins"
			});

			aColumns.push({
				uiobject: "label",
				label: oBundle.getText("number"),
				valuePath: "Number",
				type: "sap.ui.model.type.Float",
				formatOptions: {
					decimals: 2
				}
			});

			oModel.setProperty("/Columns", aColumns);
		},

		_factory: function (sId, oContext, oParam) {
			let oBindingValue,
				oAdditionalBindingValue,
				oTemplate;

			oBindingValue = {
				model: "tableModel",
				path: oContext.getProperty("valuePath"),
				type: oContext.getProperty("type"),
				formatOptions: oContext.getProperty("formatOptions")
			};

			oBindingValue = {
				parts: [{
					model: "tableModel",
					path: oContext.getProperty("valuePath")
				}, {
					model: "tableModel",
					path: oContext.getProperty("additionalValuePath")
				}],
				formatter: formatter.dynamicCellValueWithKey
			};

			if (oContext.getProperty("additionalValuePath")) {
				oAdditionalBindingValue = {
					model: "tableModel",
					path: oContext.getProperty("additionalValuePath"),
					type: oContext.getProperty("type"),
					formatOptions: oContext.getProperty("formatOptions")
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
				label: new sap.m.Label({
					text: oContext.getProperty("label"),
					design: sap.m.LabelDesign.Bold,
					textAlign: sap.ui.core.TextAlign.Center,
					wrapping: true
				}),
				template: oTemplate,
				autoResizable: true,
				minWidth: oContext.getProperty("width") || 96,
				hAlign: sap.ui.core.TextAlign.Center
			});
		},

		_refreshTable: function () {
			this.byId("idTable").getBinding("items").refresh(true);
		},

		filterTable: function () {
			const oTable = this.getView().byId("idTable");

			oTable.getBinding("rows").filter([new Filter("Value", FilterOperator.Contains, "X")]);
		},

		getDataValue: function () {
			var oTable = this.getView().byId("idTable"),
				oModel = oTable.getModel("tableModel"),
				aData = oModel.getData();
		},

		getTableData: function () {
			var oTable = this.getView().byId("idTable"),
				aContexts = oTable.getBinding("rows").getContexts();
		},

		getSelectedPath: function () {
			var oTable = this.getView().byId("idTable"),
				aPaths = oTable.getSelectedContextPaths(),
				oContext;

			for (var i = 0; i < aPaths.length; i++) {
				oContext = this.getModel("tableModel").getProperty(aPaths[i]);
			}
		},

		getSelectedIndices: function (oEvent) {
			var aSelectedIndices = oEvent.getSource().getSelectedIndices(),
				sCurrentIndex = 1,
				sIndex = aSelectedIndices.indexOf(sCurrentIndex);
		},

		_getSelectedDataFromTable: function () {
			const oViewModel = this.getModel("viewModel");
			const oTable = this.byId("idTable");
			const aIndices = oTable.getSelectedIndices();
			const aData = [];

			aIndices.forEach((Index) => {
				aData.push(oViewModel.getProperty(oTable.getContextByIndex(Index).getPath()));
			});

			return aData;
		},

		addDataSelectedTable: function () {
			var oTable = this.getView().byId("idTable"),
				aContexts = oTable.getBinding("rows").getContexts(),
				aData = oTable.getModel("tableModel").getData(),
				sIndex = aData.findIndex(x => x.Id === sId),
				aSelected;

			if (sIndex != -1) {
				if (sIndex < aContexts.length) {
					oTable.addSelectionInterval(sIndex, sIndex);
				} else {
					aSelected = oTable.getSelectedContextPaths();
					aSelected.push("/" + sIndex);
					oTable.setSelectedContextPaths(aSelected);
				}
			}
		},

		removeDataSelectedTable: function () {
			var oTable = this.getView().byId("idTable"),
				sIndex = aData.findIndex(x => x.Id === sId);

			oTable.removeSelectionInterval(sIndex, sIndex);
		},

		onPress: function (oEvent) {
			this.getRouter().navTo("viewName", {
				value: oEvent.getSource().getBindingContext("tableModel").getProperty("Value")
			});
		},

		onRowSelectionChange: function (oEvent) {
			var sCurrentIndex = oEvent.getParameters().rowIndices[0];
		},

		removeSelectedRow: function () {
			this.byId("idTable").clearSelection();
			this.byId("idTable").removeSelections();
		},

		onShow: function (oEvent) {
			let sPath = oEvent.getSource().getParent().getBindingContext("tableModel").getPath(),
				sProjectCode = this.getModel("tableModel").getProperty(sPath + "/Value");
		},

		onAddDColumn: function () {
			let iColumnNumber = 1;

			this._initUITable("idTable", 2);
			this._addColumnUITable("idTable", iColumnNumber);
		},

		_initUITable: function (sId, iStaticColumn) {
			let oTable = this.getView().byId(sId);

			for (let i = oTable.getColumns().length; i >= iStaticColumn; i--) {
				oTable.removeColumn(i);
			}
		},

		_addColumnUITable: function (sId, iColumnNumber) {
			const oTable = this.getView().byId(sId);

			for (let i = 0; i < iColumnNumber; i++) {
				oTable.addColumn(new sap.ui.table.Column({
					path: "model>/Table",
					hAlign: "Center",
					label: new Label({
						text: "Column" + " " + (i + 1)
					}),
					template: new Input({
						value: "{model>Column" + (i + 1) + "}",
						type: "Number"
					})
				}));
			}
		},

		onAddRow: function (oEvent) {
			let oRow = {
				ID: "",
				Value: ""
			};

			this._addRowToTable("model", "/Table", oRow);
		},

		_addRowToTable: function (sModel, sProperty, oRow) {
			let oModel = this.getView().getModel(sModel),
				aTable = oModel.getProperty(sProperty);

			aTable.push(oRow);
			oModel.setProperty(sProperty, aTable);
			oModel.refresh();
		},

		onDeleteRow: function (oEvent) {
			this._deleteRowsFromTable("idTable", "model", "/Table");
		},

		_deleteRowsFromTable: function (sId, sModel, sProperty) {
			let oTable = sap.ui.getCore().byId(sId);

			if (oTable.getSelectedIndices().length === 0) {
				MessageToast.show(this.getResourceBundle().getText("infoChooseRow"));
				return;
			}

			MessageBox.confirm(this.getResourceBundle().getText("infoDeleteRow"), {
				onClose: (sAction) => {
					if (sAction === MessageBox.Action.OK) {
						const oTableModel = oTable.getModel(sModel);
						const oTableData = oTableModel.getProperty(sProperty);
						const aReverse = [].concat(oTable.getSelectedIndices()).reverse();

						aReverse.forEach(function (index) {
							oTableData.splice(index, 1);
						});

						oTableModel.refresh();
						oTable.setSelectedIndex(-1);
					}
				}
			});
		},

		onPressRAI: function (oEvent) {
			const oSelectedRow = oEvent.getSource().getBindingContext();
			const sID = oSelectedRow.getProperty("ID");
		}

	});

});