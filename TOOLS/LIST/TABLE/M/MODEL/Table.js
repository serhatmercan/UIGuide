sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/m/Input",
	"sap/m/Text",
	"sap/m/CheckBox",
], function (BaseController, JSONModel, Label, Input, Text, CheckBox) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oTableModel = new JSONModel({
				Value1: "",
				Value2: ""
			});

			this.setModel(oTableModel, "tableModel");

		},

		onAddColumn: function () {
			this._initTable("idTable", "idCLI", 2);
			this._initModel();
			this._setTableColumn();
		},

		getDataValue: function () {

			var oTable = this.getView().byId("idTable"),
				oModel = oTable.getModel("tableModel"),
				aData = oModel.getData();

		},

		getSelectedPath: function () {

			var oTable = this.getView().byId("idTable"),
				aPaths = oTable.getSelectedContextPaths(),
				oContext;

			for (var i = 0; i < aPaths.length; i++) {
				oContext = this.getModel("tableModel").getProperty(aPaths[i]);
			}

		},

		getColumnData: function () {

			var aItems = this.getView().byId("idTable").getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getCells()[1].getTitle() === "X") {
					aItems[i].setSelected(true);
				}
			}

		},

		getTableID: function (oEvent) {
			const sID = oEvent.getSource().getParent().getParent().getId();
			const iIndex = sID.indexOf("idTable");
			const sTableID = sID.substr(iIndex);
		},

		onPress: function (oEvent) {
			this.getRouter().navTo("viewName", {
				value: oEvent.getSource().getBindingContext("tableModel").getProperty("Value1")
			});
		},

		removeSelectedRow: function () {
			this.byId("idTable").clearSelection();
			this.byId("idTable").removeSelections();
		},

		onCellClick: function (oEvent) {
			const sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();
			const oRow = this.getModel("model").getProperty(sPath);
		},

		_initTable: function (sId, sCLIID, iStaticColumn) {
			const oTable = this.getView().byId(sId);
			const oCLI = sap.ui.core.Fragment.byId(this.getView().getId(), sCLIID);

			for (let i = oTable.getColumns().length; i >= iStaticColumn; i--) {
				oTable.removeColumn(i);
				oCLI.removeCell(i);
			}
		},

		_initModel: function () {
			this.getModel("model").setProperty("/Value1", []);
		},

		_setTableColumn: function () {
			const oModel = this.getModel("model");
			const iNumber = 5;
			const aColumnIDs = [];

			iNumber.forEach((i) => {
				aColumnIDs.push("P" + (i + 1));
			});

			this._addColumnToMTable("idTable", "idCLI", aColumnIDs, "model>/Value", "model");
			this._setTableData(oLotModel, iNumber, sStatu);
		},

		_addColumnToMTable: function (sTableID, sCLIID, aColumnIDs, sPath, sModel) {
			const oTable = sap.ui.core.Fragment.byId(this.getView().getId(), sTableID);
			const oCLI = sap.ui.core.Fragment.byId(this.getView().getId(), sCLIID);

			const fnChange = function (oEvent) {
				this._setData();
			}.bind(this);

			aColumnIDs.forEach((ColumnID) => {
				oTable.addColumn(new sap.m.Column({
					hAlign: "Center",
					header: new Label({
						text: ColumnID
					})
				}));

				// CheckBox
				oCLI.addCell(new CheckBox({
					enabled: "{" + sModel + ">" + aColumnIDs[i] + "Statu}",
					selected: "{" + sModel + ">" + aColumnIDs[i] + "}",
					select: fnChange
				}));

				// Input
				oCLI.addCell(new Input({
					type: "Number",
					valueState: "{= parseFloat(${" + sModel + ">" + aColumnIDs[i] + "}) > 0 ? 'Success' : 'Error' }",
					valueLiveUpdate: true,
					value: "{" + sModel + ">" + aColumnIDs[i] + "}",
					change: fnChange
				}));
			});

			oTable.bindItems(sPath, oCLI);
		},

		_setTableData: function (oModel, iNumber, sStatu) {
			oModel.getProperty("/Value").forEach((Row) => {
				iNumber.forEach((Column) => {
					if (sStatu === "BO") {
						oModel.setProperty("/Value/" + i + "/P" + j, false);
					} else {
						oModel.setProperty("/Value/" + i + "/P" + j, 100);
					}
				});
			});
		},

	});

});