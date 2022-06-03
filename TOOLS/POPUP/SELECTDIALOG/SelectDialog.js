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
					Items: [],
					Value: "" 
				}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onCancelSD: function () {
			this.oSD.close();			
			this.oSD.destroy();
			this.oSD = null;
		},

		onConfirmSD: function (oEvent) {
			const aSelectedItems = oEvent.getParameter("selectedItems");
			const oSelectedItem = oEvent.getParameter("selectedItem");
			const oData = oSelectedItem.getBindingContext().getProperty();
			const sTitle = oSelectedItem.getTitle();
			const sDescription = oSelectedItem.getDescription();
			const sInfo = oSelectedItem.getInfo();

			// Set Input Value
			oEvent.getSource().getParent().setValue(sTitle);

			// Set Value To Model Property
			this.getModel("model").setProperty("/Value", oData.Value);

			this.onCancelSD();
		},	

		onSearchSD: function (oEvent) {
			const aFilters = [
				new Filter("Value", FilterOperator.Contains, oEvent.getParameter("value"))
			];

			oEvent.getParameter("itemsBinding").filter(aFilters);
			oEvent.getSource().getBinding("items").filter(aFilters);
		},

		onShowSD: function () { 
			this.oSD = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.SelectDialog", this);
			this.getView().addDependent(this.oSD);
			this.oSD.open();
		},

		onShowSD: function () {  
			const aFilters = [
				new Filter("Value", FilterOperator.Contains, "X")
			];

			this.oSD = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.SelectDialog", this);
			this.oSD.setModel(this.getModel("i18n"), "i18n");
			this.oSD.setModel(this.getModel());

			sap.ui.core.Fragment.byId(this.getView().getId(), "SD").getBinding("items").filter(aFilters);

			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), this.getView(), this.oSD);

			// BIND: Add Filter To Set
			this.oSD._oDialog.attachBeforeOpen(function () {
				this.getModelData();				
				this.byId("SD").getBinding("items").filter(aFilters);
			}.bind(this));

			// MODEL: Set Data To Model
			this.oSD.bindElement({
				path: "model>/Items"
			});

			// Add Button To Toolbar In Select Dialog
			this.oSD._oDialog._header.addContentRight(new sap.m.Button({
				icon: "sap-icon://add",				
				tooltip: this.getResourceBundle().getText("button"),
				type: "Emphasized",
				press: this.onPress.bind(this) // Call Function
			}));

			// Remove Search Field From Select Dialog
			this.oSD._oSubHeader.setVisible(false);
		}

	});

});