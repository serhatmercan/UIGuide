sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			var oTableModel = new JSONModel({
				Value: ""
			});

			this.setModel(oTableModel, "tableModel");
		},
		
		_refreshTable: function() {
			this.byId("idTable").getBinding("items").refresh(true);
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
			let oTable = this.getView().byId(sId),
				that = this;

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

			function fnConfirmDialog() {
				let oTableModel = oTable.getModel(sModel),
					oTableData = oTableModel.getProperty(sProperty),
					aReverse = [].concat(oTable.getSelectedIndices()).reverse();

				aReverse.forEach(function (index) {
					oTableData.splice(index, 1);
				});

				oTableModel.refresh();
				oTable.setSelectedIndex(-1);
			}

			this._getConfirmDialog(this, "Message", "Warning", this.getResourceBundle().getText("warning"), this.getResourceBundle().getText(
				"infoDeleteRow"), fnConfirmDialog);
		}

	});

});