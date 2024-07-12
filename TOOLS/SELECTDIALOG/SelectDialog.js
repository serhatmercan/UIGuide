sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Button",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, Button, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				Items: [],
				Value: ""
			}), "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onCancelSD() {
			this.oSD.close();
			this.oSD.destroy();
			this.oSD = null;
		},

		onConfirmSD(oEvent) {
			const { selectedItems: aSelectedItems, selectedItem: oSelectedItem } = oEvent.getParameter();
			const oData = oSelectedItem?.getBindingContext()?.getProperty();
			const sTitle = oSelectedItem?.getTitle();
			const sDescription = oSelectedItem?.getDescription();
			const sInfo = oSelectedItem?.getInfo();

			// Set Input Value
			oEvent.getSource()?.getParent()?.setValue(sTitle);

			// Set Value To Model Property
			this.getModel("model").setProperty("/Value", oData.Value);

			this.onCancelSD();
		},

		onSearchSD(oEvent) {
			const sValue = oEvent.getParameter("value");
			const aFilters = [
				new Filter("Value", FilterOperator.Contains, sValue)
			];

			oEvent.getParameter("itemsBinding")?.filter(aFilters);
			oEvent.getSource()?.getBinding("items")?.filter(aFilters);
		},

		onShowSD() {
			const aFilters = [
				new Filter("Value", FilterOperator.Contains, "X")
			];

			this.oSD = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.fragment.SelectDialog", this);
			this.oSD.setModel(this.getModel("i18n"), "i18n");
			this.oSD.setModel(this.getModel());

			sap.ui.core.Fragment.byId(this.getView().getId(), "SD").getBinding("items")?.filter(aFilters);

			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), this.getView(), this.oSD);

			// Bind: Add Filter To Set
			this.oSD?._oDialog?.attachBeforeOpen(() => {
				this.getModelData();
				this.byId("SD")?.getBinding("items")?.filter(aFilters);
			});

			// Model: Set Data To Model
			this.oSD.bindElement({
				path: "model>/Items"
			});

			// Add Button To Toolbar In Select Dialog
			this.oSD?._oDialog?._header?.addContentRight(
				new Button({
					icon: "sap-icon://add",
					tooltip: this.getText("button"),
					type: "Emphasized",
					press: this.onPress.bind(this) // Call Function
				})
			);

			// Remove Search Field From Select Dialog
			this.oSD._oSubHeader.setVisible(false);
		}

	});

});