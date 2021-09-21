sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oModel = new JSONModel({
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");

		},

		showSelectDialog: function () {
			// First Usage
			if (!this._oSD) {
				this._oSD = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.SelectDialog", this);
				this.getView().addDependent(this._oSD);
			}
			// First Usage

			// Second Usage
			let aFilters = [new Filter("Value", FilterOperator.Contains, "Value 1")];
			if (!this._vhSD) {
				this._vhSD = sap.ui.xmlfragment("idVHSD", "com.serhatmercan.fragment.SelectDialog", this);
				this._vhSD.setModel(this.getModel("i18n"), "i18n");
				this._vhSD.setModel(this.getModel());
			}
			sap.ui.core.Fragment.byId("idVHSD", "idSD").getBinding("items").filter(aFilters);
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), this.getView(), this._vhSD);
			// Second Usage

			/*			
			// BIND: Add Filter To Set
			this._oSD._oDialog.attachBeforeOpen(function () {
				var oDialog = this.byId("idSD"),
					sTitle = "",
					aFilters = [];

				aFilters.push(new Filter("Title", FilterOperator.EQ, sTitle));
				oDialog.getBinding("items").filter(aFilters);
			}.bind(this));
			
			// MODEL: Get Data To Model
			this._oSD.attachBeforeOpen(function() {
				this.getModelData(); // Read
			}.bind(this));
			
			// MODEL: Set Data To Model
			this._oSD.bindElement({
				path: "model>/Values"
			});
			
			// Add Button To Toolbar In Select Dialog
			this._oSD._oDialog._header.addContentRight(new sap.m.Button({
					icon: "sap-icon://add",
					type: "Emphasized",
					tooltip: this.getResourceBundle().getText("button"),
					press: this.onPressButton.bind(this) // Call Function
			}));

			// Remove Search Field From Select Dialog
			this._oSD._oSubHeader.setVisible(false);
			
			// Add Input to Dialog
			oControl.addDependent(this._oDialog);
			
			*/
			this._oSD.open();
		},

		onConfirmSD: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oData = oSelectedItem.getBindingContext().getProperty(),
				sTitle = oSelectedItem.getTitle(),
				sDescription = oSelectedItem.getDescription(),
				sInfo = oSelectedItem.getInfo();

			// Set Input Value
			// oEvent.getSource().getParent().setValue(oSelectedItem.getTitle());

			// Set Value To Model Property
			// this.getView().getModel("model").setProperty("/Value", oData.Value);

			this.onCancelSD();
		},

		onCancelSD: function () {
			// w/ out ID
			this._oSD.close();

			// w/ ID
			this._oSD.destroy();
			this._oSD = null;
		},

		onSearchSD: function (oEvent) {
			// First Usage //
			var sValue = oEvent.getParameter("value"),
				oFilter = new Filter("Name", FilterOperator.Contains, sValue),
				oBinding = oEvent.getSource().getBinding("items");

			oBinding.filter([oFilter]);

			// Second Usage //
			let aFilters = [new Filter("Value", FilterOperator.Contains, oEvent.getParameter("value"))];
			oEvent.getParameter("itemsBinding").filter(aFilters);
		}

	});

});