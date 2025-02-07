sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/CheckBox",
	"sap/m/Column",
	"sap/m/ColumnListItem",
	"sap/m/Input",
	"sap/m/Label",
	"sap/m/library",
	"sap/m/ObjectIdentifier",
	"sap/m/ObjectNumber",
	"sap/m/ObjectStatus",
	"sap/m/Table",
	"sap/m/Text",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter"
], (BaseController, CheckBox, Column, ColumnListItem, Input, Label, MobileLibrary, ObjectIdentifier, ObjectNumber, ObjectStatus, Table, Text, Filter, FilterOperator,
	JSONModel, Sorter) => {
	"use strict";

	const { URLHelper } = MobileLibrary;

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Items: []
			});
			this.setModel(oViewModel, "model");

			this.byId("Table")._getSelectAllCheckbox().setVisible(false);

			this.byId("Table").attachSelectionChange((oEvent) => {
				const aPaths = oEvent.getSource().getSelectedContextPaths();
				oModel.setProperty("/Statu", !!aPaths.length);
			});

			this.byId("Table").attachUpdateFinished((oEvent) => {
				oEvent.getSource()?.getItems()?.forEach(oItem => {
					const sBindingPath = oItem.getBindingContext("model").getPath();
					const oViewModel = this.getModel("model");
					const sStatu = oViewModel.getProperty(`${sBindingPath}/Statu`);

					if (oItem.getBindingContext("model") && sStatu === "G") {
						oItem.$().css("background-color", "#30914c");
					} else if (oItem.getBindingContext("model") && sStatu === "W") {
						oItem.$().css("background-color", "#e76500");
					} else {
						oItem.$().css("background-color", "#fff");
					}
				});
			});

			this.byId("Table").getBinding("items").refresh(true);
			this.byId("Table").removeAllItems();
			this.byId("Table").removeSelections(true);

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAddColumn() {
			this.initTable("Table", "CLI", 2);
			this.initModel();
			this.setTableColumn();
		},

		onBindItems() {
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, "X")
			];

			this.byId("Table").bindItems({
				path: "/TableSet",
				template: new ColumnListItem({
					cells: [
						new Text({ text: "{ID}" }),
						new Text({ text: { path: "Date", formatter: this.formatter.convertDate } })
					]
				}),
				filters: aFilters,
				events: { dataReceived: () => { } }
			});
		},

		onCellClick(oEvent) {
			const sPath = oEvent.getSource()?.getParent()?.getBindingContext("model")?.getPath();
			const oRow = this.getModel("model").getProperty(sPath);
		},

		onChangeCB(oEvent) {
			const sPath = oEvent.getSource()?.getSelectedItem()?.getBindingContext("model")?.getPath();
			const sID = this.getModel("model").getProperty(sPath + "/ID");
			const aRows = this.byId("Table").getItems();
			const aFilters = [new Filter("ID", FilterOperator.EQ, sID)];

			aRows.forEach(oRow => {
				oRow.getCells()[1]?.getBinding("items")?.filter(aFilters);
			});
		},

		onCheckCellValue() {
			const oValueState = sap.ui.core.ValueState;

			this.byId("Table").getRows()?.forEach(oRow => {
				oRow.getCells().forEach(oCell => {
					oCell.setValueState(oCell.getValue() === "" ? oValueState.Error : oValueState.None);
				});
			});
		},

		onDelete(oEvent) {
			const iIndex = +oEvent.getParameter("listItem")?.getBindingContextPath()?.slice(-1);
			const oViewModel = this.getModel("model");
			const aItems = oViewModel.getProperty("/Items");

			aItems.splice(iIndex, 1);
			oViewModel.setProperty("/Items", aItems);
		},

		onDeleteSelectedRows() {
			const oViewModel = this.getModel("model");
			const oTable = this.byId("Table");
			const aItems = oViewModel.getProperty("/Items");
			const aReverseSelectedRowsPaths = [...oTable.getSelectedContextPaths()].reverse();

			aReverseSelectedRowsPaths.forEach(sReverseSelectedRowPath => {
				aItems.splice(+sReverseSelectedRowPath.split("/").pop(), 1);
			});

			oViewModel.setProperty("/Items", aItems);
			oTable.removeSelections(true);
		},

		onDeleteRow(oEvent) {
			const aPaths = oEvent.getSource()?.getBindingContext("model")?.getPath()?.split("/");
			const iIndex = +aPaths.pop();
			const oViewModel = this.getModel("model");
			const aItems = oViewModel.getProperty("/Items");

			aItems.splice(iIndex, 1);
			oViewModel.setProperty("/Items", aItems);
		},

		onDownloadExcel() {
			const sDownloadUrl = this.byId("Table").getBinding("items")?.getDownloadUrl();
			const sFilter = "?$filter=ID eq 'X'";
			const sUrlParameters = "$format=xlsx&$select=ID,Value,Text";

			window.open(`${sDownloadUrl}${sFilter}&${sUrlParameters}`);
		},

		onDownloadExcelII() {
			const oModel = this.getModel();
			const sPath = oModel.createKey("/ExcelDownloadSet", { "ID": "X" });
			const sUrl = `${oModel.sServiceUrl}${sPath}/$value`;

			URLHelper.redirect(sUrl, true);
		},

		onDropTable(oEvent) {
			const oDraggedItem = oEvent.getParameter("draggedControl");
			const oDroppedItem = oEvent.getParameter("droppedControl");

			if (oDroppedItem instanceof ColumnListItem) {
				const oDroppedTable = oDroppedItem.getParent();
				const iDraggedItemIndex = oDroppedTable.indexOfItem(oDraggedItem);
				const iDroppedItemIndex = oDroppedTable.indexOfItem(oDroppedItem);
				const oViewModel = this.getModel("model");
				let aItems = [...oViewModel.getProperty("/Items")];

				if (iDraggedItemIndex !== iDroppedItemIndex) {
					const [oReplacedItem] = aItems.splice(iDraggedItemIndex, 1);

					aItems.splice(iDroppedItemIndex, 0, oReplacedItem);
					aItems = aItems.map((oItem, iIndex) => ({ ...oItem, ItemNo: iIndex.toString() }));

					oViewModel.setProperty("/Items", aItems);
				}
			}
		},

		onItemPress(oEvent) {
			const oSelectedItem = oEvent?.getSource()?.getSelectedItem();
			const sValue = oSelectedItem?.getCells()[0]?.getText();
		},

		onPress(oEvent) {
			const sID = oEvent.getSource()?.getBindingContext("model")?.getProperty("ID");
			this.getRouter().navTo("View", { ID: sID });
		},

		onSelectionChange(oEvent) {
			const sPath = oEvent.getSource()?.getSelectedItem()?.getBindingContext("model")?.getPath();
		},

		onSortWithViewSettingsDialog(oEvent) {
			const oParams = oEvent.getParameters();
			const aSorters = [new Sorter(oParams.sortItem.getKey(), oParams.sortDescending)];

			this.byId("Table")?.getBinding("items")?.sort(aSorters);
		},

		onUpdateFinished(oEvent) {
			const iTotalItems = oEvent.getParameter("total");
			const oViewModel = this.getModel("model");
			const oTable = this.byId("Table");
			const aItems = oTable?.getBinding("items");
			const sTableText = "product";
			const sType = "Navigation"; // "Inactive"

			if (aItems.isLengthFinal()) {
				const sTitle = iTotalItems ? this.getText(`${sTableText}s`, iTotalItems) : this.getText(sTableText); // Product | Products ({0})

				oViewModel.setProperty('/Title', sTitle);
				oTable?.getAggregation("items")?.forEach((oItem) => oItem.setType(sType));
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addColumnToTable(sTableID, sCLIID, aColumnIDs, sPath, sModel) {
			const oFragment = sap.ui.core.Fragment;
			const sID = this.getView().getId();
			const oTable = oFragment.byId(sID, sTableID);
			const oCLI = oFragment.byId(sID, sCLIID);

			aColumnIDs.forEach(sColumnID => {
				oTable.addColumn(new Column({ hAlign: "Center", header: new Label({ text: sColumnID }) }));

				oCLI.addCell(new CheckBox({
					enabled: `{${sModel}>${sColumnID}Statu}`,
					selected: `{${sModel}>${sColumnID}}`,
					select: () => this.setData()
				}));

				oCLI.addCell(new Input({
					type: "Number",
					value: `{${sModel}>${sColumnID}}`,
					valueState: `{= +${sModel}>${sColumnID} > 0 ? 'Success' : 'Error' }`,
					valueLiveUpdate: true,
					change: () => this.setData()
				}));
			});

			oTable.bindItems(sPath, oCLI);
		},

		bindAggregation() {
			this.byId("Table")
				.bindAggregation("items", {
					path: "/Products",
					sorter: new Sorter("ProductName", false),
					parameters: {
						expand: "Category,Supplier"
					},
					template: new ColumnListItem({
						type: "Navigation",
						press: this.onPress.bind(this),
						cells: [
							new ObjectIdentifier({ title: "{ProductName}" }),
							new Text({ text: "{Category/CategoryName}" }),
							new ObjectStatus({
								text: "{= ${Discontinued} ? ${i18n>discontinued} : ${i18n>inProduction}}",
								state: "{= ${Discontinued} ? 'Error' : 'Success'}"
							}),
							new ObjectNumber({
								number: "{UnitsInStock}",
								state: { path: 'UnitsInStock', formatter: this.formatter.formatStockStatus }
							}),
							new ObjectNumber({
								number: {
									parts: ['UnitPrice', 'Currency'],
									type: 'sap.ui.model.type.Currency'
								},
								unit: "USD"
							})
						]
					})
				});
		},

		createFactory() {
			return new ColumnListItem({
				type: "Active",
				cells: [
					new Text({
						text: "{model>ID}"
					})
				]
			})
		},

		generateTable() {
			const that = this;
			const oTable = new Table("Table", {
				columns: [
					new Column({
						header: new Text({
							text: "Text"
						})
					})
				],
				items: {
					path: "model>/Items",
					factory: that.createFactory.bind(this)
				}
			});
		},

		getBindingContext() {
			const oModel = this.getModel();
			const sPath = this.getView().getBindingContext().getPath();
			const aItems = oModel.getProperty(sPath + "/Items").map(xPath => oModel.getProperty(`/${xPath}`));

			return aItems;
		},

		getSelectedContextProperty(sProperty) {
			return this.byId("Table")?.getSelectedContexts()[0]?.getProperty(sProperty);
		},

		getSelectedContexts() {
			return this.byId("Table")?.getSelectedContexts();
		},

		getSelectedData() {
			const oModel = this.getModel();
			const aItems = this.byId("Table")?.getSelectedContextPaths()?.map(sPath => oModel.getProperty(`/${sPath}`));

			return aItems;
		},

		initModel() {
			this.getModel("model").setProperty("/Items", []);
		},

		initTable(sId, sCLIID, iStaticColumn) {
			const oTable = this.byId(sId);
			const oCLI = sap.ui.core.Fragment.byId(this.getView().getId(), sCLIID);

			for (let i = oTable.getColumns().length; i >= iStaticColumn; i--) {
				oTable.removeColumn(i);
				oCLI.removeCell(i);
			}
		},

		patternMatched(oEvent) {
			const oBindingContext = this.getView().getBindingContext();

			if (oBindingContext) {
				this.getModel().deleteCreatedEntry(oBindingContext);
			}
		},

		removeItem() {
			const oTable = this.byId("Table");
			const aSelectedItems = oTable.getSelectedItems();

			aSelectedItems.forEach(oSelectedItem => oTable.removeItem(oSelectedItem));
		},

		selectRow() {
			this.byId("Table")?.getItems()?.forEach(oItem => {
				oItem.setSelected(oItem.getCells()[1]?.getTitle() === "X");
			});
		},

		setFilter() {
			const aFilters = [new Filter("Value", FilterOperator.EQ, "X")];
			this.byId("Table")?.getBinding("items")?.filter(aFilters);
		},

		setTableColumn() {
			const iNumber = 5;
			const aColumnIDs = Array.from({ length: iNumber }, (xData, i) => `P${i + 1}`);

			this.addColumnToTable("Table", "CLI", aColumnIDs, "model>/Items", "model");
			this.setTableData(this.getModel("model"), iNumber, "BO");
		},

		setTableData(oViewModel, iNumber, sStatu) {
			const aItems = oViewModel.getProperty("/Items");

			aItems.forEach(oItem => {
				for (let i = 0; i < iNumber; i++) {
					oItem[`P${i}`] = sStatu === "BO" ? false : 100;
				}
			});

			oViewModel.setProperty("/Items", aItems);
		},

		setValueTextColor(iValue) {
			this.addStyleClass(iValue > 0 ? "green" : "red");
			return iValue;
		}

	});
});