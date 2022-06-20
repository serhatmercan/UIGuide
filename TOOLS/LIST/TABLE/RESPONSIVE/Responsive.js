sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/CheckBox",
    "sap/m/Column",
    "sap/m/Input",
    "sap/m/Label"
], function (BaseController, JSONModel, Filter, FilterOperator, CheckBox, Column, Input, Label) {
	"use strict";

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

			this.byId("Table").onAttachUpdateFinished = function (oEvent) {
				oEvent.getSource().getAggregation("items").forEach((oItem) => oItem.setType("Navigation"));
			}.bind(this);

            this.byId("Table").onRowsUpdated = function () {
				this.byId("Table").getRows().forEach(oRow => {
					if (oRow.getBindingContext("model") &&
						this.getModel("model").getProperty(oRow.getBindingContext("model").getPath() + "/ID") === "X") {
						$("#" + oRow.getId()).css("background-color", "red");
					}
				});
			}.bind(this);

			this.byId("Table").getBinding("items").refresh(true);
			this.byId("Table").removeSelections();			

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
			const oModel = this.getModel("model");
			const aItems = oModel.getProperty("/Items");

			aItems.splice(iIndex, 1);

			oModel.setProperty("/Items", aItems);
		},

		onDeleteRow: function () {
			const aPaths = oEvent.getSource().getBindingContext("model").getPath().split("/");
			const iIndex = aPaths[aPaths.length - 1];
			const oModel = this.getModel("model");
			const aItems = oModel.getProperty("/Items");

			aItems.splice(iIndex, 1);
			oModel.setProperty("/Items", aItems);
		},

		onPress: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContextPath();
			const sID = oEvent.getSource().getBindingContext("model").getProperty("ID");

			this.getRouter().navTo("View", {
				ID: sID
			});
		},

		onSelectionChange: function (oEvent) {
			const sPath = oEvent.getSource().getSelectedItem().getBindingContext("model").getPath();
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

        getBindingContext: function(){            
            const oModel = this.getModel();
			let aItems = [];

            aItems = oModel.getProperty(this.getView().getBindingContext().getPath() + "/Items").map(sPath => {
				return oModel.getProperty("/" + sPath);
			});

            return aItems;
        },

        getSelectedContexts: function(){
            return this.byId("Table").getSelectedContexts();
        },

		getSelectedData: function(){
			const oModel = this.getModel();
			let aItems = [];

			aItems = this.byId("Table").getSelectedContextPaths().map(sPath => {
				return oModel.getProperty("/" + sPath);
			});

			return aItems;
		},

		groupingItems: function(){
			
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

		setFilter: function(){
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

        setTableData: function (oModel, iNumber, sStatu) {
            const aItems = oModel.getProperty("/Items");

			aItems.forEach((oItem) => {
                for (let i = 0; i < iNumber; i++) {
                    oItem("P" + iNumber) = sStatu === "BO" ? false : 100;                   
                }				
			});

            oModel.setProperty("/Items", aItems);
		}

	});

});