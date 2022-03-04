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

			onACVH: function () {
				this._oDialogVH.close();
				this._oDialogVH.destroy();
				this._oDialogVH = null;
				this._sPath = "";
			},

			onVHR: function () {
				this._sPath = oEvent.getSource().getBindingContext("model").getPath();

				this._oDialogVH = sap.ui.xmlfragment("idVH", "com.serhatmercan.SmartSearchHelp", this);
				this._oDialogVH.setModel(this.getModel("i18n"), "i18n");
				this._oDialogVH.setModel(this.getModel());

				sap.ui.core.Fragment.byId("idVH", "idST").setSmartFilterId(sap.ui.core.Fragment.byId("idVH", "idSFB").getId());

				this.getView().addDependent(this._oDialogVH);

				this._oDialogVH.open();
			},

			onBRT: function (oEvent) {
				const oBindingParams = oEvent.getParameter("bindingParams");
				const oFilterPeriod = new Filter("Key", FilterOperator.EQ, "X");
				const oFilterPeriodX = new Filter("Key", FilterOperator.CP, "*");

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

			onSelectVH: function (oEvent) {
				const sPath = oEvent.getSource().getBindingContextPath();
				const sID = this.getModel().getProperty(sPath + "/ID");
				const oModel = this.getModel("model");

				oModel.setProperty("/Value", sID);
				oModel.setProperty(this._sPath + "/Value", sID);

				this.getModel("model").setProperty(this._sPath + "/ID",
					this.getModel().getProperty(oEvent.getSource().getBindingContextPath() + "/ID"));

				this.onACVH();
			}

		});

	});