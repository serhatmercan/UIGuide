sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.getView().setModel(
				new JSONModel({
					Busy: false,
					Data: [],
					Statu: false
				}), "model");

			// Grid Table		
			this.byId("ST").getTable().attachRowSelectionChange((oEvent) => {
				this.getModel("model").setProperty("/Statu", oEvent.getSource().getSelectedIndices().length === 1);
			});

			// Responsive Table			
			this.byId("ST").getTable().attachSelectionChange((oEvent) => {
				this.getModel("model").setProperty("/Statu", !!oEvent.getSource().getSelectedContextPaths().length);
			});

			this.byId("ST").getTable()._getSelectAllCheckbox().setVisible(false);

			this.getRouter().getRoute("SmartTable").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onBeforeRebindTableWithResizing: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oTable = oEvent.getSource();

			oBindingParams.events = {
				"dataReceived": () => {
					setTimeout(() => this.setTableWithResizing(oTable));
				}
			};
		},

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilterPeriod = new Filter("ID", FilterOperator.EQ, "X");
			const oTable = oEvent.getSource().getTable();
			const oSFB = this.byId("SFB");
			var oComboBoxFilter = oSFB.getControlByKey("ComboBox");

			oBindingParams.filters.push(oFilterPeriod);

			this.onBeforeRebindTableWithResizing(oEvent);
			this.onSetFilter();
			this.onSetTableContent(oTable);

			if (oSFB instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
				if (oComboBoxFilter instanceof sap.m.ComboBox) {
					switch (oComboBoxFilter.getSelectedKey()) {
						case "1":
							oBindingParams.filters.push(new Filter("ID", "EQ", "1"));
							break;
						case "2":
							oBindingParams.filters.push(new Filter("ID", "EQ", "2"));
							break;
						case "3":
							oBindingParams.filters.push(new Filter("ID", "EQ", "3"));
							break;
						default:
							break;
					}
				}
			}
		},

		onChangeKey: function (oEvent) {
			const sValue = oEvent.getParameter("selectedItem").getKey();
			const sRowPath = oEvent.getSource().getBindingContext().getPath();
			const oModel = this.getModel();
			const oRowData = oModel.getProperty(sRowPath);
			const aData = this.getView().getBindingContext().getProperty("Items").map(sPath => oModel.getProperty("/" + sPath));
		},

		onClearFilters: function () {
			this.byId("ST").getTable().getBinding("items").aApplicationFilters = [];
		},

		onDetail: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContextPath();
			const oContext = this.getModel().getProperty(sPath);

			this.sID = oContext.ID;
		},

		onDT: function (oEvent) {
			const oData = oEvent.getParameters().getParameter("data");
			let sID = "";

			if (oData !== undefined) {
				sID = oData.results[0].ID;
			}
		},

		onFieldChange: function (oEvent) { },

		onFilter: function () {
			const aFilters = [
				new Filter("Statu", FilterOperator.EQ, "X")
			];

			this.byId("ST").getTable().getBinding("items").filter(aFilters); // Grid
			this.byId("ST").getTable().getBinding("rows").filter(aFilters);	// Responsive
		},

		onInitST: function () {
			const oSmartFilter = this.byId("SFB");
			const oJSONData = {};
			const oID = {};

			this.sID = "X";

			if (oSmartFilter && this.sID) {
				oID = {
					items: [{
						key: this.sID
					}]
				};
				oJSONData.ID = oID;
			}

			oSmartFilter.setFilterData(oJSONData);
		},

		onPressKey: function (oEvent) {
			const sID = oEvent.getSource().getBindingContext().getProperty("ID");
		},

		onSetTableContent: function (oTable) {
			oEvent.getParameter("bindingParams").events = {
				"dataReceived": () => {
					setTimeout(() => this.setTableContent(oTable));
				}
			};
		},

		onShow: function (oEvent) {
			const sID = oEvent.getSource().getBindingContext().getProperty("ID");
			const aSmartTableContexts = this.byId("ST").getTable().getSelectedContexts();
			const aTableContexts = this.byId("SmartTable").getSelectedContexts();
			const aIDs = [];

			aTableContexts.forEach((oContext) => {
				aIDs.push(this.getModel().getProperty(oContext.getPath() + "/ID"));
			});
		},

		onShowDetail: function (oEvent) {
			const oContext = oEvent.getSource().getBindingContext();

			if (!oContext) {
				return;
			}

			this.getRouter().navTo("Detail", {
				ID: oContext.getProperty("ID")
			});
		},

		onSSBarcode: function (oEvent) {
			this.getModel().setProperty(oEvent.getSource().getBindingContext().getPath() + "/ID", oEvent.getParameter("text"));
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		dataReceived: function () {
			const aData = this.getView().getElementBinding().getBoundContext().getObject().Items.__list;
		},

		getData: function () {
			const oModel = this.getModel();
			const oContext = this.getView().getBindingContext();
			const sBindingPath = oContext.getPath();
			const oData = oContext.getObject();
			const sID = oModel.getProperty(sBindingPath + "/ID");
			const aData = [];

			oData.Items.__list.forEach((sPath) => {
				aData.push(oContext.getProperty("/" + sPath));
			});
		},

		getSelectedDataFromGridST: function () {
			const oTable = this.byId("SmartTable").getTable();

			return oTable.getSelectedIndices().map(iIndex => oTable.getContextByIndex(iIndex).getObject());
		},

		getSelectedDataFromResponsiveST: function () {
			return this.byId("ST").getTable().getSelectedContexts().map(oContext => this.getModel().getProperty(oContext.getPath() + "/"));
		},

		getTotalCount: function () {
			const oTable = this.byId("SmartTable").getTable();
			const aSelectedData = oTable.getSelectedIndices().map(x => oTable.getContextByIndex(x).getObject());
			const iTotal = aSelectedData.reduce((iSum, oCurrent) => iSum + +oCurrent.Amount, 0)
		},

		getVariant: function () {
			return this.byId("SmartTable").fetchVariant();
		},

		patternMatched: function () {
			this.getModel().resetChanges();
			this.byId("ST").rebindTable();
		},

		refreshTable: function () {
			this.byId("SmartTable").clearSelection();
			this.byId("SmartTable").removeSelections();
			this.byId("SmartTable").getBinding("items").refresh(true);	// Grid
			this.byId("SmartTable").getBinding("rows").refresh(true);	// Responsive
			this.byId("ST").rebindTable();
		},

		setData: function () {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const sPath = oModel.createKey("/...Set", {
				ID: "X"
			});
			const oExpand = {
				"$expand": "Items"
			};
			const oView = this.getView();
			const oSmartTable = this.byId("ST");

			oViewModel.setProperty(this.sPath + "/Data", []);

			if (!oView.getBindingContext().getProperty("Items")) {
				oView.bindElement({
					path: sPath,
					parameters: oExpand,
					events: {
						dataReceived: this.dataReceived.bind(this)
					}
				});

				oSmartTable.rebindTable();
			}
		},

		setTableContent: function (oTable) {
			oTable.getItems().forEach(oItem => {
				let bFlag = this.getModel().getProperty(oItem.getBindingContextPath() + "/Flag") === "X" ? true : false;
				let oRow = sap.ui.getCore().byId(oItem.$().find(".sapMCb").attr("id"));
				let oCell = oItem.getCells().find(oCell => oCell.getBinding("text").getPath() === "ID");

				oRow.setEnabled(!bFlag);
				oRow.setSelected(bFlag);

				oCell.$().css("background-color", "#4BB543");
				oCell.$().css("font-weight", "bold");
			});
		},

		setTableWithResizing: function (oTable) {
			const aColumns = oTable.getTable().getColumns();

			for (let i = aColumns.length - 1; i > -1; i--) {
				aColumns[i].getParent().autoResizeColumn(i);
			}
		},

		sortTable: function () {
			this.byId("SmartTable").applyVariant({
				sort: {
					sortItems: [{
						columnKey: "ID",
						operation: "Descending"
					}, {
						columnKey: "Value",
						operation: "Ascending"
					}]
				}
			});
		}

	});

});