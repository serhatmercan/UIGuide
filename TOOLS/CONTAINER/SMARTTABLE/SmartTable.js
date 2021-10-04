sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.getView().setModel(
				new JSONModel({
					Busy: false,
					Data: []
				}), "viewModel");
		},

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilterPeriod = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, "X");

			oBindingParams.filters.push(oFilterPeriod);

			this.onBeforeRebindTableWithResizing(oEvent);
		},

		onDT: function (oEvent) {
			const oData = oEvent.getParameters().getParameter("data");
			let sID = "";

			if (oData !== undefined) {
				sID = oData.results[0].ID;
			}
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

			aTableContexts.forEach((Context) => {
				aIDs.push(this.getModel().getProperty(Context.getPath() + "/ID"));
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

		_getSelectedData: function () {
			const aContexts = this.byId("idTableST").getSelectedContexts();

			if (aContexts.length > 0) {
				this._oSelectedData = this.getModel().getProperty(aContexts[0].getPath());
			}
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
			this.byId("idTableST").getBinding("items").refresh(true);
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