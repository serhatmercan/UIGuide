sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/item",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, Item, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Key: "",
				Items: [
					{ Key: "1", Text: "One" },
					{ Key: "2", Text: "Two" },
					{ Key: "3", Text: "Three" }
				]
			});
			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onBindItems() {
			const oSelect = this.byId("Select");
			const oFilter = new Filter("Key", FilterOperator.EQ, "X");
			const oTemplate = new Item({
				key: {
					parts: [
						{ path: "ID" },
						{ path: "Key" }
					],
					formatter: this.formatter.createKey
				},
				text: "{Text}"
			});

			oSelect.unbindItems();
			oSelect.setEnabled(false);

			oSelect.bindItems({
				path: "/SHSet",
				filters: oFilter,
				template: oTemplate
			});
		},

		onChangeSelect(oEvent) {
			const oSelectedItem = oEvent.getParameter("selectedItem");
			const oData = oSelectedItem?.getBindingContext()?.getObject();
			const sKey = oSelectedItem?.getBindingContext()?.getProperty("Key");
			const sSelectedKey = oEvent.getSource()?.getSelectedKey();
			let sType;

			switch (sSelectedKey) {
				case "idSIKey":
					sType = "1H";
					break;
				default:
					break;
			}

			// Get Smart Table Binding Value
			const sValue = oSelectedItem?.getKey();
			const sRowPath = oEvent.getSource()?.getBindingContext()?.getPath();
			const oModel = this.getModel();
			const oRowData = oModel?.getProperty(sRowPath);
			const aData = this.getView()?.getBindingContext()?.getProperty("Items")?.map(sPath => oModel.getProperty("/" + sPath));
		}

	});

});