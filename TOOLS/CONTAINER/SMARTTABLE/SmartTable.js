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

			this.byId("ST").getTable().attachRowSelectionChange((oEvent) => {
				this.getModel("model").setProperty("/Statu", oEvent.getSource().getSelectedIndices().length === 1);
			});

			this.byId("ST").getTable()._getSelectAllCheckbox().setVisible(false);
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

			oBindingParams.filters.push(oFilterPeriod);

			this.onBeforeRebindTableWithResizing(oEvent);
			this.onSetFilter();
			this.onSetTableContent(oTable);
		},

		onChangeKey: function (oEvent) {
			const sValue = oEvent.getParameter("selectedItem").getKey();
			const sRowPath = oEvent.getSource().getBindingContext().getPath();
			const oModel = this.getModel();
			const oRowData = oModel.getProperty(sRowPath);
			const aData = this.getView().getBindingContext().getProperty("Items").map(sPath => oModel.getProperty("/" + sPath));
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

		onFieldChange: function(oEvent){},

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

		onSetFilter: function () {
			this.byId("SFB").getAllFilterItems().filter(oFilter => oFilter.getName() === "ID").forEach(oItem => {
				oItem.getControl().setValueHelpOnly(true);
			});
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

			oData.Items.__list.forEach((Item) => {
				aData.push(oContext.getProperty("/" + Item));
			});
		},

		getSelectedData: function () {
			const aContexts = this.byId("SmartTable").getSelectedContexts();

			if (aContexts.length > 0) {
				this.oSelectedData = this.getModel().getProperty(aContexts[0].getPath());
			}
		},

		getSelectedDataFromUISmartTable: function () {
			const oTable = this.byId("ST").getTable();
			const aContexts = oTable.getBinding("rows").getContexts();
			const aIndices = oTable.getSelectedIndices();
			const aData = [];

			aIndices.forEach(iIndex => aData.push(aContexts[iIndex].getObject()));

			return aData;
		},

		getSelectedMultiData: function () {
			const oTable = this.byId("SmartTable").getTable();
			const aSelectedData = oTable.getSelectedIndices().map(x => oTable.getContextByIndex(x).getObject());
		},

		getTotalCount: function () {
			const oTable = this.byId("SmartTable").getTable();
			const aSelectedData = oTable.getSelectedIndices().map(x => oTable.getContextByIndex(x).getObject());
			const iTotal = aSelectedData.reduce((iSum, oCurrent) => iSum + +oCurrent.Amount, 0)
		},

		refreshTable: function () {
			this.byId("SmartTable").clearSelection();
			this.byId("SmartTable").removeSelections();
			this.byId("SmartTable").getBinding("items").refresh(true);
			this.byId("SmartTable").getBinding("rows").refresh(true);
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

				oRow.setEnabled(!bFlag);
				oRow.setSelected(bFlag);
			});
		},

		setTableWithResizing: function (oTable) {
			const aColumns = oTable.getTable().getColumns();

			for (let i = aColumns.length - 1; i > -1; i--) {
				aColumns[i].getParent().autoResizeColumn(i);
			}
		}		

	});

});