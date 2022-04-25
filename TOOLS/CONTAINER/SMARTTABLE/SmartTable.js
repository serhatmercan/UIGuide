sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.getView().setModel(
				new JSONModel({
					Busy: false,
					Data: [],
					Statu: false
				}), "viewModel");

			this.byId("idST").getTable().attachRowSelectionChange((oEvent) => {
				this.getModel("viewModel").setProperty("/Statu", oEvent.getSource().getSelectedIndices().length === 1);
			});

			this.byId("idST").getTable()._getSelectAllCheckbox().setVisible(false);
		},

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilterPeriod = new Filter("ID", FilterOperator.EQ, "X");
			const oTable = oEvent.getSource().getTable();

			oBindingParams.filters.push(oFilterPeriod);

			this.onBeforeRebindTableWithResizing(oEvent);
			this.onSetTableContent(oTable);
		},

		onDT: function (oEvent) {
			const oData = oEvent.getParameters().getParameter("data");
			let sID = "";

			if (oData !== undefined) {
				sID = oData.results[0].ID;
			}
		},

		onSetTableContent: function (oTable) {
			oEvent.getParameter("bindingParams").events = {
				"dataReceived": () => {
					setTimeout(() => this._setTableContent(oTable));
				}
			};
		},

		onInitST: function () {
			const oSmartFilter = this.byId("idSFB");
			const oJSONData = {};
			const oID = {};

			this._sID = "X";

			if (oSmartFilter && this._sID) {
				oID = {
					items: [{
						key: this._sID
					}]
				};
				oJSONData.ID = oID;
			}

			oSmartFilter.setFilterData(oJSONData);
		},

		getData: function () {
			const oModel = this.getModel();
			const oContext = this.getView().getBindingContext();
			const sBindingPath = oContext.getPath();
			const oData = oContext.getObject();
			const sID = oModel.getProperty(sBindingPath + "/ID");
			const aData = [];

			oData.to_Item.__list.forEach((Item) => {
				aData.push(oContext.getProperty("/" + Item));
			});
		},

		setData: function () {
			const oViewModel = this.getModel("viewModel");
			const sPath = oModel.createKey("/AnnotationListSet", {
				ID: "X"
			});
			const oExpand = {
				"$expand": "to_Item"
			};
			const oView = this.getView();
			const oSmartTable = this.byId("idST");

			oViewModel.setProperty(this._sPath + "/Data", []);

			if (!oView.getBindingContext().getProperty("to_Item")) {
				oView.bindElement({
					path: sPath,
					parameters: oExpand,
					events: {
						dataReceived: this._onDataReceived.bind(this)
					}
				});

				oSmartTable.rebindTable();
			}
		},

		onShow: function (oEvent) {
			const sID = oEvent.getSource().getBindingContext().getProperty("ID");
			const aSmartTableContexts = this.byId("idST").getTable().getSelectedContexts();
			const aTableContexts = this.byId("idTableST").getSelectedContexts();
			const aIDs = [];

			aTableContexts.forEach((oContext) => {
				aIDs.push(this.getModel().getProperty(oContext.getPath() + "/ID"));
			});
		},

		onDetail: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContextPath();
			const oContext = this.getModel().getProperty(sPath);

			this._sID = oContext.ID;
		},

		onPressKey: function (oEvent) {
			const sID = oEvent.getSource().getBindingContext().getProperty("ID");
		},

		onBeforeRebindTableWithResizing: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oTable = oEvent.getSource();

			oBindingParams.events = {
				"dataReceived": () => {
					setTimeout(() => this._setTableWithResizing(oTable));
				}
			};
		},

		onChangeKey: function (oEvent) {
			const sValue = oEvent.getParameter("selectedItem").getKey();
			const sRowPath = oEvent.getSource().getBindingContext().getPath();
			const oModel = this.getModel();
			const oRowData = oModel.getProperty(sRowPath);
			const aData = this.getView().getBindingContext().getProperty("to_Item").map(sPath => oModel.getProperty("/" + sPath));
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

		_getSelectedData: function () {
			const aContexts = this.byId("idTableST").getSelectedContexts();

			if (aContexts.length > 0) {
				this._oSelectedData = this.getModel().getProperty(aContexts[0].getPath());
			}
		},

		_getSelectedDataFromUISmartTable: function () {
			const oTable = this.byId("idST").getTable();
			const aContexts = oTable.getBinding("rows").getContexts();
			const aIndices = oTable.getSelectedIndices();
			const aData = [];

			aIndices.forEach(iIndex => aData.push(aContexts[iIndex].getObject()));

			return aData;
		},

		_getSelectedMultiData: function () {
			const oTable = this.byId("idTableST").getTable();
			const aSelectedData = oTable.getSelectedIndices().map(x => oTable.getContextByIndex(x).getObject());
		},

		_getTotalCount: function () {
			const oTable = this.byId("idTableST").getTable();
			const aSelectedData = oTable.getSelectedIndices().map(x => oTable.getContextByIndex(x).getObject());
			const iTotal = aSelectedData.reduce((sum, current) => sum + +current.Amount, 0)
		},

		_refreshTable: function () {
			this.byId("idTableST").clearSelection();
			this.byId("idTableST").removeSelections();
			this.byId("idTableST").getBinding("items").refresh(true);
			this.byId("idTableST").getBinding("rows").refresh(true);
			this.byId("idST").rebindTable();
		},

		_setTableContent: function (oTable) {
			oTable.getItems().forEach(oItem => {
				let bFlag = this.getModel().getProperty(oItem.getBindingContextPath() + "/Flag") === "X" ? true : false;
				let oRow = sap.ui.getCore().byId(oItem.$().find(".sapMCb").attr("id"));

				oRow.setEnabled(!bFlag);
				oRow.setSelected(bFlag);
			});
		},

		_setTableWithResizing: function (oTable) {
			const aColumns = oTable.getTable().getColumns();

			for (let i = aColumns.length - 1; i > -1; i--) {
				aColumns[i].getParent().autoResizeColumn(i);
			}
		},

		_onDataReceived: function () {
			const aData = this.getView().getElementBinding().getBoundContext().getObject().to_Item.__list;
		}

	});

});