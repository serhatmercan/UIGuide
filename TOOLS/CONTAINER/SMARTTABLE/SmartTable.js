sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {},

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilterPeriod = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, "X");

			oBindingParams.filters.push(oFilterPeriod);
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

		onShow: function (oEvent) {
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

		_getSelectedData: function () {
			const aContexts = this.byId("idTableST").getSelectedContexts();

			if (aContexts.length > 0) {
				this._oSelectedData = this.getModel().getProperty(aContexts[0].getPath());
			}
		},

		_refreshTable: function () {
			this.byId("idTableST").getBinding("items").refresh(true);
		}

	});

});