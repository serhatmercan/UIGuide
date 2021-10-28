sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onSSH: function () {
			this._sPath = oEvent.getSource().getBindingContext("model").getPath();

			if (!this._oSSH) {
				this._oSSH = sap.ui.xmlfragment("idSSH", "com.serhatmercan.SmartSearchHelp", this);

				const oSmartFilter = sap.ui.core.Fragment.byId("idSSH", "idSFB");
				const oSmartTable = sap.ui.core.Fragment.byId("idSSH", "idST");

				oSmartTable.setSmartFilterId(oSmartFilter.getId());

				this._oSSH.setModel(this.getModel("i18n"), "i18n");
				this._oSSH.setModel(this.getModel());
				this.getView().addDependent(this._oSSH);
			}
			this._oSSH.open();
		},

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilterPeriod = new sap.ui.model.Filter("Key", sap.ui.model.FilterOperator.EQ, "X");

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

		onSelectSSH: function (oEvent) {
			const sPath = oEvent.getSource().getBindingContextPath();
			const sID = this.getModel().getProperty(sPath + "/ID");
			const oModel = this.getModel("model");

			oModel.setProperty("/Value", sID);
			oModel.setProperty(this._sPath + "/Value", sID);

			this.onCloseSSH();
		},

		onCloseSSH: function () {
			this._oSSH.close();
			this._oSSH.destroy();
			this._oSSH = null;
		},

	});

});