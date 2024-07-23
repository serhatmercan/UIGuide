sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				Data: [],
				Statu: false
			});
			this.setModel(oViewModel, "model");

			const oTable = this.byId("ST").getTable();

			// Grid Table		
			oTable.attachRowSelectionChange(oEvent => {
				const oViewModel = this.getModel("model");
				const aIndices = oEvent.getSource()?.getSelectedIndices();

				oViewModel.setProperty("/Statu", aIndices?.length === 1);
			});

			// Responsive Table			
			oTable.attachSelectionChange(oEvent => {
				const oViewModel = this.getModel("model");
				const aPaths = oEvent.getSource()?.getSelectedContextPaths();

				oViewModel.setProperty("/Statu", !!aPaths?.length);
			});

			oTable?._getSelectAllCheckbox()?.setVisible(false);

			this.getRouter().getRoute("SmartTable").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onBeforeExport(oEvent) {
			const oExportSettings = oEvent?.getParameter("exportSettings");
			const oBeginDate = oExportSettings.workbook?.columns?.find(oColumn => oColumn?.property === "BeginDate");

			oExportSettings?.fileName = "Excel Test";
			oExportSettings?.dataSource?.count = 1000;

			oBeginDate?.type = "Date";
		},

		onBRT(oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilterPeriod = new Filter("ID", FilterOperator.EQ, "X");
			const oTable = oEvent?.getSource()?.getTable();
			const oSFB = this.byId("SFB");
			const oComboBoxFilter = oSFB?.getControlByKey("ComboBox");

			oBindingParams?.filters?.push(oFilterPeriod);

			this.onBRTDataReceived(oEvent);
			this.onSetFilter();
			this.onSetTableContent(oTable);

			if (oComboBoxFilter instanceof sap.m.ComboBox) {
				const sSelectedKey = oComboBoxFilter?.getSelectedKey();

				if (sSelectedKey) {
					oBindingParams?.filters?.push(new Filter("ID", FilterOperator.EQ, sSelectedKey));
				}
			}
		},

		onBRTDataReceived(oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oTable = oEvent.getSource();

			oBindingParams?.events = {
				dataReceived: () => {
					setTimeout(() => {
						this.setTableColor(oTable);
						this.setTableWithResizing(oTable);
					});
				}
			};
		},

		async onChangeInput(oEvent) {
			const oModel = this.getModel();
			const sPath = oEvent.getSource().getBindingContext().getPath();
			const sKey = oModel.getProperty(sPath + "/Key");
			if (!sKey) return;
		},

		onChangeKey(oEvent) {
			const sValue = oEvent.getParameter("selectedItem")?.getKey();
			const sRowPath = oEvent.getSource()?.getBindingContext()?.getPath();
			const oModel = this.getModel();
			const oRowData = oModel?.getProperty(sRowPath);
			const aItems = this.getView()?.getBindingContext()?.getProperty("Items");
			const aData = aItems.map(sPath => oModel.getProperty("/" + sPath));
		},

		onClearFilters() {
			this.byId("ST")?.applyVariant({});
		},

		onDetail(oEvent) {
			const sPath = oEvent.getSource()?.getBindingContextPath();
			const oContext = this.getModel()?.getProperty(sPath);

			this.sID = oContext.ID;
		},

		onDT(oEvent) {
			const oData = oEvent.getParameter("data");
			const sID = oData?.results[0]?.ID;
		},

		onFieldChange(oEvent) { },

		onFilter() {
			const oSmartTable = this.byId("ST")?.getTable();
			const aFilters = [
				new Filter("Statu", FilterOperator.EQ, "X")
			];

			oSmartTable?.getBinding("items")?.filter(aFilters); // Grid
			oSmartTable?.getBinding("rows")?.filter(aFilters); // Responsive
		},

		onInitST() {
			const oSmartFilter = this.byId("SFB");
			let oID = {
				items: [{
					key: "X",
					text: "ABC"
				}]
			};

			if (this.sID) {
				oSmartFilter?.setFilterData({ ID: oID });
			}
		},

		onPressKey(oEvent) {
			const sID = oEvent?.getSource()?.getBindingContext()?.getProperty("ID");
		},

		onSetTableContent(oTable) {
			oEvent?.getParameter("bindingParams")?.events = {
				dataReceived: () => {
					setTimeout(() => this.setTableContent(oTable));
				}
			};
		},

		onShow(oEvent) {
			const sID = oEvent?.getSource()?.getBindingContext()?.getProperty("ID");
			const oModel = this.getModel();
			const aSmartTableContexts = this.byId("ST")?.getTable()?.getSelectedContexts();
			const aTableContexts = this.byId("SmartTable")?.getSelectedContexts();
			const aIDs = aTableContexts?.map(oContext => oModel?.getProperty(oContext.getPath() + "/ID"));
		},

		onShowDetail(oEvent) {
			const oContext = oEvent?.getSource()?.getBindingContext();

			if (!oContext) return;

			this.getRouter().navTo("Detail", { ID: oContext?.getProperty("ID") });
		},

		onSSBarcode(oEvent) {
			const oModel = this.getModel();
			const sPath = oEvent?.getSource()?.getBindingContext()?.getPath();
			const xValue = oEvent?.getParameter("text");

			oModel.setProperty(sPath + "/ID", xValue);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		dataReceived() {
			const aData = this.getView()?.getElementBinding()?.getBoundContext()?.getObject()?.Items?.__list;
		},

		getData() {
			const oModel = this.getModel();
			const oContext = this.getView().getBindingContext();
			const sBindingPath = oContext?.getPath();
			const oData = oContext?.getObject();
			const sID = oModel?.getProperty(sBindingPath + "/ID");
			const aData = oData?.Items?.__list?.map(sPath => oContext?.getProperty("/" + sPath));
		},

		getSelectedDataFromGridST() {
			const oTable = this.byId("SmartTable")?.getTable();
			const aIndices = oTable?.getSelectedIndices();
			const aData = aIndices.map(iIndex => oTable?.getContextByIndex(iIndex)?.getObject());;

			return aData;
		},

		getSelectedDataFromResponsiveST() {
			const aContexts = this.byId("ST")?.getTable()?.getSelectedContexts();
			const oModel = this.getModel();

			return aContexts.map(oContext => oModel.getProperty(oContext.getPath()));
		},

		getTotalCount() {
			const oTable = this.byId("SmartTable")?.getTable();
			const aSelectedData = oTable?.getSelectedIndices()?.map(iIndex => oTable?.getContextByIndex(iIndex)?.getObject());
			const iTotal = aSelectedData?.reduce((iSum, oCurrent) => iSum + +oCurrent.Amount, 0);
		},

		getVariant() {
			return this.byId("SmartTable")?.fetchVariant();
		},

		patternMatched() {
			this.getModel().resetChanges();
			this.byId("ST")?.rebindTable();
		},

		refreshTable() {
			const oSmartTable = this.byId("SmartTable");

			oSmartTable?.clearSelection();
			oSmartTable?.removeSelections();
			oSmartTable?.getBinding("items")?.refresh(true);	// Grid
			oSmartTable?.getBinding("rows")?.refresh(true);	// Responsive

			this.byId("ST")?.rebindTable();
		},

		setData() {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const sPath = oModel.createKey("/...Set", { ID: "X" });
			const oExpand = { "$expand": "Items" };
			const oView = this.getView();
			const oContext = oView.getBindingContext();
			const oSmartTable = this.byId("ST");

			oViewModel.setProperty(this.sPath + "/Data", []);

			if (!oContext?.getProperty("Items")) {
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

		setTableColor(oTable) {
			const oModel = this.getModel();
			const aRows = oTable.getRows();

			aRows?.forEach(oRow => {
				const sStatu = oModel.getProperty(oRow?.getBindingContext()?.getPath() + "/Statu");
				let sBackgroundColor = "#fff";

				switch (sStatu) {
					case "CM":
						sBackgroundColor = "#30914c";
						break;
					case "PR":
						sBackgroundColor = "#e76500";
						break;
				}

				oRow.$().css("background-color", sBackgroundColor);
				$("#" + oRow.getId()).css("background-color", sBackgroundColor);
			});
		},

		setTableContent(oTable) {
			const oModel = this.getModel();
			const aItems = oTable?.getItems();

			aItems?.forEach(oItem => {
				const bFlag = oModel.getProperty(oItem?.getBindingContextPath() + "/Flag") === "X";
				const oRow = sap.ui.getCore().byId(oItem.$().find(".sapMCb").attr("id"));
				const oCell = oItem?.getCells()?.find(oCell => oCell?.getBinding("text")?.getPath() === "ID");

				oRow?.setEnabled(!bFlag);
				oRow?.setSelected(bFlag);

				oCell?.$().css("background-color", "#4BB543");
				oCell?.$().css("font-weight", "bold");
			});
		},

		setTableWithResizing(oTable) {
			const aColumns = oTable?.getTable()?.getColumns();

			aColumns?.forEach((oColumn, iIndex) => {
				oColumn?.getParent()?.autoResizeColumn(iIndex);
			});
		},

		sortTable() {
			this.byId("SmartTable")?.applyVariant({
				sort: {
					sortItems: [
						{ columnKey: "ID", operation: "Descending" },
						{ columnKey: "Value", operation: "Ascending" }
					]
				}
			});
		}

	});

});