/*global history */
sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"com/serhatmercan/model/models"
], function(BaseController, JSONModel, History, Filter, FilterOperator, GroupHeaderListItem, Device, models) {
	"use strict";

	return BaseController.extend("com.serhatmercan.controller.Menu", {

		onInit: function() {
			this._oHashChanger = this.getRouter().oHashChanger;
			this._First = true;
		},

		onAfterRendering: function() {
			if (this._First) {
				this._First = false;
			}
		},

		onUpdateFinished: function(oEvent) {
			this.selectMenuItem();
		},

		selectMenuItem: function() {
			if (!Device.system.phone) {
				var sHash = this._oHashChanger.getHash(),
					aMenu = this.getModel("menu").getData(),
					oList = this.byId("idList"),
					aItems = oList.getItems(),
					sIndex;
				if (aMenu.length > 0) {
					sIndex = aMenu.findIndex(x => x.pattern === sHash);
					this._SelectedItem = aItems.find(x => x.getBindingContextPath() === "/" + sIndex);
					oList.setSelectedItem(this._SelectedItem);
				}
			}
		},

		onMenuItemPress: function(oEvent) {
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		onNavBack: function() {
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
		},

		_showDetail: function(oItem) {
			var oMenu = oItem.getBindingContext("menu").getObject(),
				bReplace = !Device.system.phone,
				oList = this.byId("idList"),
				that = this;

			function navToCreate() {
				that.getRouter().oHashChanger.replaceHash("");
				that.getModel().resetChanges();
				that._SelectedItem = oItem;
				that.getRouter().navTo(oMenu.view, {}, bReplace);
			}

			function fnCancel() {
				oList.setSelectedItem(that._SelectedItem);
			}

			if (this.getModel().hasPendingChanges()) {
				models.getPendingChangesDialog(this, navToCreate, fnCancel);
			} else {
				this._SelectedItem = oItem;
				if (oMenu.view == 'controlLotList' || oMenu.view == 'controlLotCreate') {
					this.getRouter().navTo(oMenu.view, {}, bReplace);
				}
			}
		}
	});

});