sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("xxx.controller.JSON", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Busy: false,
				Data: {},
				Items: [],
				No: 0,
				Value: ""
			});
			this.setModel(oModel, "model");

			oModel.attachPropertyChange(this.attachPropertyChange.bind(this));

			this.getRouter().getRoute("JSON").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAddRowToArray() {
			const oViewModel = this.getModel("model");
			const aItems = [
				...oViewModel.getProperty("/Items"),
				{
					Value: "X"
				}
			];

			oViewModel.setProperty("/Items", aItems);
		},

		onAddRowToBetweenRowsInArray() {
			const oViewModel = this.getModel("model");
			const aItems = [...oViewModel.getProperty("/Items")];
			const iIndex = this.byId("Table").getSelectedIndices()[0];
			let iID = 1;

			if (aItems.length !== 0) {
				const oSelectedData = aItems[iIndex];
				iID = +oSelectedData.ID + 1;

				aItems.forEach(oItem => {
					if (+iID === +oItem.ID) {
						oItem.ID = (+oItem.ID + 1).toString();
						iID = oItem.ID;
					}
				});
			}

			const oData = {
				ID: iID.toString(),
				Value: ""
			};

			aItems.push(oData);
			oViewModel.setProperty("/Items", aItems);

			this.onSortArray();
		},

		onDeleteRowsFromArray() {
			const oViewModel = this.getModel("model");
			const oTable = this.byId("Table");
			const aItems = [...oViewModel.getProperty("/Items")];
			const aReverseIndices = [...oTable.getSelectedIndices()].reverse();

			aReverseIndices.forEach(iIndex => {
				aItems.splice(iIndex, 1);
			});

			oViewModel.setProperty("/Items", aItems);
			oTable.setSelectedIndex(-1);
		},

		onSortArray() {
			const oViewModel = this.getModel("model");
			const aItems = [...oViewModel.getProperty("/Items")];

			aItems.sort((a, b) => a.ID - b.ID);

			oViewModel.setProperty("/Items", aItems);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		attachPropertyChange(oEvent) {
			const sPath = oEvent.getParameter("path");
			const sValue = oEvent.getParameter("value");

			switch (sPath) {
				case "/Data/ID":
					break;
				case "Items":
					break;
			}
		},

		clearModel() {
			this.getModel("model").setProperty("/", {
				Busy: false,
				Data: {},
				Items: [],
				No: 0,
				Value: ""
			});
		},

		convertDataToJSON() {
			const sJSONData = `{"Family":[ {"FirstName":"Serhat","LastName":"Mercan"},
										   {"FirstName":"Elif","LastName":"Mercan"},
					                       {"FirstName":"Selim","LastName":"Mercan"}]}`;

			return JSON.parse(sJSONData).Family;
		},

		convertDataToJSONString(oData) {
			return JSON.stringify(oData);
		},

		getData() {
			return this.getModel("model").getProperty("/Items");
		},

		patternMatched() {
			this.clearModel();
		},

		setData() {
			this.getModel("model").setProperty("/Items", []);
		}
	});
});
