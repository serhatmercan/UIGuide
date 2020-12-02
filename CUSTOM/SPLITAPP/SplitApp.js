sap.ui.define([
	"com/spro/rtstore/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/spro/rtstore/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageToast) {
	"use strict";

	return BaseController.extend("com.spro.rtstore.controller.AuditReport", {

		formatter: formatter,

		onInit: function () {

			var oSearchModel = new JSONModel({
				Budat1: new Date(new Date() - new Date(1 * 24 * 60 * 60 * 1000)),
				Budat2: new Date()
			});
			this.setModel(oSearchModel, "searchModel");

			var oTableModel = new JSONModel();
			this.setModel(oTableModel, "tableModel");

			var oListModel = new JSONModel({
				"list": [{
					"title": this.getResourceBundle().getText("cancelDocumentLine"),
					"fragment": "CancelDocument"
				}, {
					"title": this.getResourceBundle().getText("usingPoint"),
					"fragment": "UsingPoint"
				}, {
					"title": this.getResourceBundle().getText("cancelReturn"),
					"fragment": "CancelReturn"
				}, {
					"title": this.getResourceBundle().getText("cancelBill"),
					"fragment": "CancelBill"
				}, {
					"title": this.getResourceBundle().getText("amountDiscount"),
					"fragment": "AmountDiscount"
				}, {
					"title": this.getResourceBundle().getText("checkBill"),
					"fragment": "CheckBill"
				}, {
					"title": this.getResourceBundle().getText("cashierBill"),
					"fragment": "CashierBill"
				}]
			});
			this.setModel(oListModel, "listModel");

			this.getRouter().getRoute("auditReport").attachPatternMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function () {

			this._setFragment("MessagePage");
			this.byId("idList").removeSelections();

		},

		_setFragment: function (sFragmentName) {

			var oDetailPage = this.byId("idDetailPage"),
				oFragment;

			oDetailPage.destroyContent();

			oFragment = sap.ui.xmlfragment("com.spro.rtstore.fragment." + sFragmentName, this);

			oDetailPage.addContent(oFragment);
		},

		onDateRangeChange: function (oEvent) {

			var oList = this.byId("idList").getSelectedContexts()[0].getObject();

			this._onSearchTable(oList.fragment);

		},

		onListItemPress: function (oEvent) {

			var oList = oEvent.getParameter("listItem").getBindingContext("listModel").getObject();

			this._setFragment(oList.fragment);
			this._onSearchTable(oList.fragment);

		},

		_onSearchTable: function (sKey) {

			var oDataModel = this.getModel("dataModel"),
				oSearchModel = this.getModel("searchModel"),
				oTableModel = this.getModel("tableModel"),
				aFilters = [],
				oParams = {},
				that = this;

			if (oDataModel.getProperty("/User/Werks")) {
				aFilters.push(new Filter("Werks", FilterOperator.EQ, "1000"));
			}

			if (oSearchModel.getProperty("/Budat1") && oSearchModel.getProperty("/Budat2")) {
				aFilters.push(new Filter("Budat",
					FilterOperator.BT,
					formatter.getLocaleDate(oSearchModel.getProperty("/Budat1")),
					formatter.getLocaleDate(oSearchModel.getProperty("/Budat2"))));
			}

			oParams.filters = aFilters;

			oParams.success = function (oSuccess) {
				if (oSuccess.results.length === 0) {
					MessageToast.show(this.getResourceBundle.getText("noData"));
				}

				oTableModel.setProperty("/" + sKey, oSuccess.results);

			}.bind(this);

			oParams.error = function (oError) {
				console.log(oError);
			}.bind(this);

			that.getModel().read("/" + sKey + "Set", oParams);

		},

		onNavBack: function () {

			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {
						shellHash: "#Shell-home"
					}
				});
			}

		}

	});
});