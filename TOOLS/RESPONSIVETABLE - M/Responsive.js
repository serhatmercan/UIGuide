sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/CheckBox",
	"sap/m/Column",
	"sap/m/Input",
	"sap/m/Label",
	'sap/m/library',
	"sap/ui/model/Sorter"
], function (BaseController, JSONModel, Filter, FilterOperator, CheckBox, Column, Input, Label, MobileLibrary, Sorter) {
	"use strict";

	const URLHelper = MobileLibrary.URLHelper;

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Items: []
				}), "model");

			this.byId("Table")._getSelectAllCheckbox().setVisible(false);

			this.byId("Table").attachSelectionChange((oEvent) => {
				this.getModel("model").setProperty("/Statu", !!oEvent.getSource().getSelectedContextPaths().length);
			});

			this.byId("Table").onAttachUpdateFinished = function (oEvent) {
				oEvent.getSource().getAggregation("items").forEach((oItem) => oItem.setType("Navigation"));
			}.bind(this);

			this.byId("Table").getBinding("items").refresh(true);
			this.byId("Table").removeSelections(true);

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAddColumn: function () {
			this.initTable("Table", "CLI", 2);
			this.initModel();
			this.setTableColumn();
		},

		onCellClick: function (oEvent) {
			const oRow = this.getModel("model").getProperty(oEvent.getSource().getParent().getBindingContext("model").getPath());
		},

		onChangeCB: function (oEvent) {
			const sID = this.getModel("model").getProperty(oEvent.getSource().getSelectedItem().getBindingContext("model").getPath() + "/ID");
			const aRows = this.byId("Table").getItems();
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, sID)
			];

			aRows.forEach((oRow) => {
				oRow.getCells()[1].getBinding("items").filter(aFilters);
			});
		},

		onCheckCellValue: function () {
			this.byId("Table").getRows().forEach(oRow => {
				oRow.getCells().forEach(oCell => {
					oCell.setValueState(oCell.getValue() === "" ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.None);
				});
			});
		},

		onDelete: function (oEvent) {
			const iIndex = +oEvent.getParameter("listItem").getBindingContextPath().slice(-1);
			const oViewModel = this.getModel("model");
			const aItems = oModel.getProperty("/Items");

			aItems.splice(iIndex, 1);

			oViewModel.setProperty("/Items", aItems);
		},

		onDeleteSelectedRows: function () {
			const oViewModel = this.getModel("model");
			const oTable = this.byId("Table");
			const aItems = oViewModel.getProperty("/Items");
			const aReverseSelectedRowsPaths = [].concat(oTable.getSelectedContextPaths()).reverse();

			aReverseSelectedRowsPaths.forEach(sReverseSelectedRowPath => {
				aItems.splice(+sReverseSelectedRowPath.split("/")[sReverseSelectedRowPath.split("/").length - 1], 1);
			});

			oViewModel.setProperty("/Items", aItems);

			oTable.removeSelections(true);
		},

		onDeleteRow: function () {
			const aPaths = oEvent.getSource().getBindingContext("model").getPath().split("/");
			const iIndex = +aPaths[aPaths.length - 1];
			const oViewModel = this.getModel("model");
			const aItems = oModel.getProperty("/Items");

			aItems.splice(iIndex, 1);
			oViewModel.setProperty("/Items", aItems);
		},

		onDownloadExcel: function () {
			const sDownloadUrl = this.byId("Table").getBinding("items").getDownloadUrl();
			const sUrlParameters = "$format=xlsx&$select=ID,Value,Text";

			window.open(sDownloadUrl + "&" + sUrlParameters);
		},

		onDownloadExcelII: function () {
			const oModel = this.getModel();
			const sPath = oModel.createKey("/ExcelDownloadSet", {
				"ID": "X"
			});
			const sUrl = oModel.sServiceUrl + sPath + "/$value"

			URLHelper.redirect(sUrl, true);
		},

		onPress: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContextPath();
			const sID = oEvent.getSource().getBindingContext("model").getProperty("ID");

			this.getRouter().navTo("View", {
				ID: sID
			});
		},

		onSelectionChange: function (oEvent) {
			const oData = oEvent.getParameter("listItem").getBindingContext().getObject();
			const sPath = oEvent.getSource().getSelectedItem().getBindingContext("model").getPath();
		},

		onSortWithViewSettingsDialog: function () {
			const oParams = oEvent.getParameters();
			const aSorters = [
				new Sorter(oParams.sortItem.getKey(), oParams.sortDescending)
			];
			const xSorters = [
				new Sorter("ID", true)
			];

			this.byId("Table").getBinding("items").sort(aSorters);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addColumnToTable: function (sTableID, sCLIID, aColumnIDs, sPath, sModel) {
			const oTable = sap.ui.core.Fragment.byId(this.getView().getId(), sTableID);
			const oCLI = sap.ui.core.Fragment.byId(this.getView().getId(), sCLIID);
			const fnChange = (oEvent) => {
				this.setData();
			};

			aColumnIDs.forEach((sColumnID) => {
				oTable.addColumn(new Column({
					hAlign: "Center",
					header: new Label({
						text: sColumnID
					})
				}));

				// CheckBox
				oCLI.addCell(new CheckBox({
					enabled: "{" + sModel + ">" + sColumnID + "Statu}",
					selected: "{" + sModel + ">" + sColumnID + "}",
					select: fnChange
				}));

				// Input
				oCLI.addCell(new Input({
					type: "Number",
					value: "{" + sModel + ">" + sColumnID + "}",
					valueState: "{= +${" + sModel + ">" + sColumnID + "} > 0 ? 'Success' : 'Error' }",
					valueLiveUpdate: true,
					change: fnChange
				}));
			});

			oTable.bindItems(sPath, oCLI);
		},

		getBindingContext: function () {
			const oModel = this.getModel();
			let aItems = [];

			aItems = oModel.getProperty(this.getView().getBindingContext().getPath() + "/Items").map(sPath => {
				return oModel.getProperty("/" + sPath);
			});

			return aItems;
		},

		getSelectedContexts: function () {
			return this.byId("Table").getSelectedContexts();
		},

		getSelectedData: function () {
			const oModel = this.getModel();
			let aItems = [];

			aItems = this.byId("Table").getSelectedContextPaths().map(sPath => {
				return oModel.getProperty("/" + sPath);
			});

			return aItems;
		},

		groupingItems: function () {

		},

		initModel: function () {
			this.getModel("model").setProperty("/Items", []);
		},

		initTable: function (sId, sCLIID, iStaticColumn) {
			const oTable = this.byId(sId);
			const oCLI = sap.ui.core.Fragment.byId(this.getView().getId(), sCLIID);

			for (let i = oTable.getColumns().length; i >= iStaticColumn; i--) {
				oTable.removeColumn(i);
				oCLI.removeCell(i);
			}
		},

		patternMatched: function (oEvent) {
			const oBindingContext = this.getView().getBindingContext();

			if (oBindingContext) {
				this.getModel().deleteCreatedEntry(oBindingContext);
			}
		},

		selectRow: function () {
			this.byId("Table").getItems().forEach(oItem => {
				oItem.setSelected(oItem.getCells()[1].getTitle() === "X");
			});
		},

		setFilter: function () {
			let aFilters = [
				new Filter("Value", FilterOperator.EQ, "X")
			];

			this.byId("Table").getBinding("items").filter(aFilters);
		},

		setTableColumn: function () {
			const iNumber = 5;
			const aColumnIDs = [];

			iNumber.forEach((i) => {
				aColumnIDs.push("P" + (i + 1));
			});

			this.addColumnToTable("Table", "CLI", aColumnIDs, "model>/Items", "model");
			this.setTableData(this.getModel("model"), iNumber, sStatu);
		},

		setTableData: function (oViewModel, iNumber, sStatu) {
			const aItems = oViewModel.getProperty("/Items");

			aItems.forEach((oItem) => {
				for (let i = 0; i < iNumber; i++) {
					oItem("P" + iNumber) = sStatu === "BO" ? false : 100;
				}
			});

			oViewModel.setProperty("/Items", aItems);
		},

		setValueTextColor: function (iValue) {
			iValue > 0 ? this.addStyleClass("green") : this.addStyleClass("red");

			return iValue;
		}

	});

});