sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/ComboBox",
	"sap/ui/core/ListItem",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], (BaseController, ComboBox, ListItem, JSONModel, Filter, FilterOperator) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Items: [],
				Value: ""
			});
			this.setModel(oViewModel, "model");

			this.byId("ComboBox").fireSelectionChange({
				selectedItem: sID
			});

			this.byId("ComboBox").setFilterFunction((sTerm, oItem) => {
				return oItem.getKey().match(new RegExp(sTerm, "i")) || oItem.getText().match(new RegExp(sTerm, "i"));
			});

			this.getOwnerComponent().getModel().attachRequestCompleted(this.attachRequestCompleted.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onChangeCB(oEvent) {
			const oComboBox = oEvent.getSource();
			const oItem = oComboBox.getSelectedItem();
			const oViewModel = this.getModel("model");
			const oObject = oItem.getBindingContext().getObject();
			const sAdditionalText = oItem.getProperty("additionalText");
			const sPath = oComboBox.getParent().getBindingContext("model").getPath();
			const sValue = oViewModel.getProperty("/Value");
			const sText = oItem.getProperty("text");
			const aFilters = [
				new Filter("Value", FilterOperator.EQ, sValue)
			];

			oViewModel.setProperty(`${sPath}/Value`, sText);

			oComboBox.getBinding("items").filter(aFilters);
			oComboBox.setValueState(oItem ? "None" : "Error");
		},

		onCheckValue(oEvent) {
			const oComboBox = oEvent.getSource();

			oComboBox.setValueState(oComboBox.getSelectedItem() ? "None" : "Error");
		},

		onFilterTableRow(oEvent) {
			const aRows = this.byId("Table").getItems();
			const oSource = oEvent.getSource();
			const oItem = oSource.getSelectedItem();
			const iIndex = oSource.getParent().getBindingContext("model").getPath().slice(-1);

			if (oSource) {
				const aFilters = [
					new Filter("ID", FilterOperator.EQ, oSource.getAdditionalText())
				];

				aRows.forEach((oRow) => {
					oRow.getCells()[3].getBinding("items").filter(aFilters);
				});
			}
		},

		onLoadItemsCB(oEvent) {
			const aFilters = [
				new Filter("Value", FilterOperator.EQ, "X")
			];

			oEvent.getSource().getBinding("items").filter(aFilters);
		},

		onSelectionChangeCB(oEvent) {
			const oSelectedItem = oEvent.getParameter("selectedItem");
			const oItem = oEvent.getSource();
			const sKey = oItem.getKey();
			const sValue = oItem.getValue();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		attachRequestCompleted() {
			setTimeout(() => {
				const sPath = this.getView().getBindingContext().getPath();

				this.byId("ComboBox").fireChange();
				this.byId("ComboBox").getInnerControls()[0].getBinding("items").filter([
					new Filter("ID", FilterOperator.EQ, this.getModel().getProperty(sPath + "/ID"))
				]);
			}, 500);
		},

		setBindItems() {
			const oComboBox = this.byId("ComboBox");

			oComboBox.unbindItems();
			oComboBox.bindItems({
				path: "model>/",
				template: new ListItem({
					key: "{model>Key}",
					text: "{model>Key}",
					additionalText: "{model>Text}"
				})
			});
		},

		setComboBox() {
			const oComboBox = new ComboBox({
				items: [
					new ListItem({
						key: "0001",
						text: "Text I",
						additionalText: "0001"
					}),
					new ListItem({
						key: "0002",
						text: "Text II",
						additionalText: "0002"
					})
				],
				showSecondaryValues: true,
				change: (oEvent) => {
					const sKey = oEvent.getSource().getSelectedKey();
				},
				selectionChange: (oEvent) => {
					const sKey = oEvent.getSource().getSelectedKey();
				}
			});
		}

	});
});