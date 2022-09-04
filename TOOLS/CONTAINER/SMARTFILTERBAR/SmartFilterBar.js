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

			this.byId("SFB").triggerSearch();

		/* ============== */
		/* Event Handlers */
		/* ============== */	

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilter = new Filter("Value", FilterOperator.EQ, this.byId("CB").getSelected());

			oBindingParams.filters.push(oFilter);
		},

		onFilterChangeSFB: function (oEvent) {
            const oSFB = oEvent.getSource();
            const oFilteredFieldName = oEvent.getParameters().getParameter("filterChangeReason");
            const oFilterData = oSFB.getFilterData();
            const aFilterItems = oSFB.getAllFilterItems();
            const oBeginDate = aFilterItems.find(oFilter => oFilter.getName() === "Begda");                        

            if (oFilteredFieldName === "Begda" || oFilteredFieldName === "Endda") {
                oBeginDate.setProperty("mandatory", oFilterData.Endda ? true : false);	
				oBeginDate.getControl().setValueState(oEndDate ? "Error" : "None");
            }
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
		},

		onSetFilter: function () {
			this.byId("SFB").getAllFilterItems().filter(oFilter => oFilter.getName() === "ID").forEach(oItem => {
				oItem.getControl().setValueHelpOnly(true);
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		setFilterData: function(){
			this.byId("SFB").setFilterData({
				Date: {
					low: new Date(),
					high: new Date()
				},
				Text: {
					ranges: [{
						"exclude": false,
						"keyField": "Text",
						"operation": "EQ",						
						"value1": "X",
						"value2": null
					}]
				}
			});
		}

	});

});