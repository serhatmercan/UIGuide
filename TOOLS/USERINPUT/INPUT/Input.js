sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
				Value: "",
				Integer: 1,
				Unit: ""
			}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACVH: function () {
			this.oVHDialog.close();
			this.oVHDialog.destroy();
			this.oVHDialog = null;
			this.sPath = "";
		},

		onBRT: function (oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilterPeriod = new Filter("Key", FilterOperator.EQ, "X");
			const oFilterPeriodX = new Filter("Key", FilterOperator.CP, "*");

			oBindingParams.filters.push(oFilterPeriod);
		},

		onInitST: function () {
			let oSmartFilter = this.byId("SFB");
			let oJSONData = {};
			let oID = {};

			this.sID = "X";

			if (oSmartFilter && this.sID) {
				oID = {
					items: [{
						key: this.sID
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
			oModel.setProperty(this.sPath + "/Value", sID);
			oModel.setProperty(this.sPath + "/ID", this.getModel().getProperty(oEvent.getSource().getBindingContextPath() + "/ID"));

			this.onACVH();
		},

		onVHR: function () {
			this.sPath = oEvent.getSource().getBindingContext("model").getPath();

			this.oVHDialog = sap.ui.xmlfragment("VH", "com.serhatmercan.SmartSearchHelp", this);

			sap.ui.core.Fragment.byId("VH", "ST").setSmartFilterId(sap.ui.core.Fragment.byId("VH", "SFB").getId());

			this.getView().addDependent(this.oVHDialog);

			this.oVHDialog.open();
		},

		onChangeInput: function (oEvent) {
			var sValue = oEvent.getParameter("newValue");

			this.onValidateField(oEvent);
		},

		onFocusInput: function () {
			this.byId("idInput").focus();
		},

		onValidateField: function (oEvent) {
			const iValue = +oEvent.getParameters().value;
			const oSource = oEvent.getSource();
			const sProperty = oSource.getBinding("value").getPath();
			const sPath = oSource.getParent().getBindingContext("viewModel").getPath();

			this.getModel("viewModel").setProperty(sPath + "/" + sProperty, iValue > 0 ? iValue : 0);
		},

		clearInput: function (oEvent) {
			oEvent.getSource().setValue("");
		},

		onPressSHList: function () {

			if (!this._oInputSHList) {
				this._oInputSHList = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.InputSHList", this);
				this._oInputSHList._oSubHeader.setVisible(false);
				this.getView().addDependent(this._oInputSHList);
			}

			this._oInputSHList._oDialog.attachBeforeOpen(function () {

				var oDialog = this.byId("idInputSH"),
					sValue = this.getModel("model").getProperty("/Value"),
					aFilters = [];

				if (sMatnr) {
					aFilters.push(new Filter("Title", FilterOperator.EQ, sValue));
				}

				oDialog.getBinding("items").filter(aFilters);

			}.bind(this));

			this._oInputSHList.open();
		},

		onConfirmSD: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				sTitle = oSelectedItem.getTitle(),
				sDescription = oSelectedItem.getDescription(),
				sInfo = oSelectedItem.getInfo();

			this._oInputSHList.close();
		},

		onCancelSD: function () {
			this._oInputSHList.destroy();
			this._oInputSHList = null;
		},

		onShowVHValue: function () {
			let aFilters = [new Filter("Value", FilterOperator.Contains, this._sValue)];

			if (!this._oVHValue) {
				this._oVHValue = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.valueHelp.Value", this);
				this._oVHValue.setModel(this.getModel("i18n"), "i18n");
				this._oVHValue.setModel(this.getModel());
				this.getView().addDependent(this._oVHValue);
				sap.ui.core.Fragment.byId(this.getView().getId(), "idSDValue").getBinding("items").filter(aFilters);
			}

			this._oVHValue.open();
		},

		onSearchSDValue: function (oEvent) {
			const aFilters = [new Filter("Title", FilterOperator.Contains, oEvent.getParameter("value"))];
			oEvent.getParameter("itemsBinding").filter(aFilters);
		},

		onConfirmSDValue: function (oEvent) {
			let oSelectedItem = oEvent.getParameter("selectedItem"),
				sTitle = oSelectedItem.getTitle(),
				sDescription = oSelectedItem.getDescription(),
				sInfo = oSelectedItem.getInfo();

			let oData = oEvent.getParameter("selectedItem").getBindingContext().getProperty(),
				oModel = this.getView().getModel("model");

			oModel.setProperty("/Value", oData.Value);

			this.onCancelSDValue();
		},

		onCancelSDValue: function () {
			this._oVHValue.close();
			this._oVHValue.destroy();
			this._oVHValue = null;
		},

		onLiveChange: function (oEvent) {

		},

		onSubmit: function (oEvent) {
			const sValue = oEvent.getParameter("value");
		}

	});

});