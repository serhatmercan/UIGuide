sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onVHR: function () {
			this._sPath = oEvent.getSource().getBindingContext("model").getPath();

			if (!this._oVHRDialog) {
				this._oVHRDialog = sap.ui.xmlfragment("idVHR", "com.serhatmercan.SmartSearchHelp", this);

				sap.ui.core.Fragment.byId("idVHR", "idST").setSmartFilterId(sap.ui.core.Fragment.byId("idVHR", "idSFB").getId());

				this._oVHRDialog.setModel(this.getModel("i18n"), "i18n");
				this._oVHRDialog.setModel(this.getModel());
				this.getView().addDependent(this._oVHRDialog);
			}
			this._oVHRDialog.open();
		},

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilterPeriod = new Filter("Key", FilterOperator.EQ, "X");

			oBindingParams.filters.push(oFilterPeriod);
		},

		onInitST: function () {
			let oSmartFilter = this.byId("idSFB");
			let oJSONData = {};
			let oID = {};

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

		onSelectVHR: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContextPath();
			const sID = this.getModel().getProperty(sPath + "/ID");
			const oModel = this.getModel("model");

			oModel.setProperty("/Value", sID);
			oModel.setProperty(this._sPath + "/Value", sID);

			this.onCloseVHR();
		},

		onCloseVHR: function () {
			this._oVHRDialog.close();
			this._oVHRDialog.destroy();
			this._oVHRDialog = null;
			this._sPath = "";
		},

	});

});