sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Filter, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */	

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilter = new Filter("Value", FilterOperator.EQ, this.byId("CB").getSelected());

			oBindingParams.filters.push(oFilter);
		},

		onGetSFBData: function () {
			const oSFBData = this.byId("SFB").getFilterData();
			const sID = oSFBData.ID;
			const aIDRange = oSFBData.ID.ranges;
			const sIDValue = aIDRange[0].value1;
			const oIDRange = {
				Include: aIDRange[0].exclude,
				Operation: aIDRange[0].operation,
				Value: aIDRange[0].value1
			};
		},

		onInitSFB: function (oEvent) {
			const oSFB = this.byId("SFB");
			const oST = this.byId("ST");
			const oID = {};

			oEvent.getSource().getAllFilterItems().filter(oFilter => oFilter.getName() === "ID")[0].setVisible(false);
			oSFB.getAllFilterItems().filter(oFilter => oFilter.getName() === "ID")[0].setVisible(false);

			oID.ID = "X";

			oSFB.setFilterData(oID);
			oST.rebindTable();
		}

	});

});