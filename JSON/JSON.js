sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("xxx.controller.JSON", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Busy: false,
					Data: {},
					Items: [],
					No: 0,
					Value: ""
				}), "model"
			);

			this.getModel("model").attachPropertyChange((oEvent) => {
				const sPath = oEvent.getParameter("path");
				const sValue = oEvent.getParameter("value");

				switch (sPath) {
					case "/Data/ID":
						break;
					case "Items":
						break;
				}
			});

			this.getRouter().getRoute("JSON").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAddRowToArray: function () {
			const oViewModel = this.getModel("model");
			const aItems = oViewModel.getProperty("/Items");

			aItems.push({
				Value: "X"
			});

			oViewModel.setProperty("/Items", aItems);
		},

		onAddRowToBetweenRowsInArray: function () {
			const oViewModel = this.getModel("model");
			const aItems = oViewModel.getProperty("/Items");
			const iIndex = this.byId("Table").getSelectedIndices()[0];
			let oData = {};
			let oSelectedData = {};
			let iID = 1;

			if (aItems.length !== 0) {
				oSelectedData = aItems[iIndex];
				iID = +oSelectedData.ID + 1;

				aItems.forEach(oItem => {
					if (+iID === +oItem.ID) {
						oItem.ID = (+oItem.ID + 1).toString;
						iID = oItem.ID;
					}
				});
			}

			oData = {
				ID: iID.toString(),
				Value: ""
			};

			aItems.push(oData);
			oViewModel.setProperty("/Items", aItems);
			this.onSortArray();
		},

		onDeleteRowsFromArray: function () {
			const oViewModel = this.getModel("model");
			const oTable = this.byId("Table");
			const aItems = oViewModel.getProperty("/Items");
			const aReverseIndices = [].concat(oTable.getSelectedIndices()).reverse();

			aReverseIndices.forEach(iIndex => {
				aItems.splice(iIndex, 1);
			});

			oViewModel.setProperty("/Items", aItems);
			oTable.setSelectedIndex(-1);
		},

		onSortArray: function () {
			const oViewModel = this.getModel("model");
			const aItems = oViewModel.getProperty("/Items");

			aItems.sort((a, b) => {
				return a.ID - b.ID;
			});

			oViewModel.setProperty("/Items", aItems);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		clearModel: function () {
			this.getModel("model").setProperty("/", {
				Busy: false,
				Data: {},
				Items: [],
				No: 0,
				Value: ""
			});

			this.getModel("model").refresh();
		},

		convertDataToJSON: function () {
			const sJSONData = "{\"Family\":[" +
				"{\"FirstName\":\"Serhat\",\"LastName\":\"Mercan\" }," +
				"{\"FirstName\":\"Elif\",\"LastName\":\"Mercan\" }," +
				"{\"FirstName\":\"Selim\",\"LastName\":\"Mercan\"}" +
				"]}";

			return JSON.parse(sJSONData).Family;
		},

		convertDataToJSON: function () {
			return JSON.stringify(oData);
		},

		getData: function () {
			const aItems = this.getModel("model").getProperty("/Items");
		},

		patternMatched: function (oEvent) {
			this.clearModel();
		},

		setData: function () {
			this.getModel("model").setProperty("/Items", []);
		}

	});
});