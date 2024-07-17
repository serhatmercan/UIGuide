sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
], (BaseController, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oViewModel, "model");

			this.byId("SFB").triggerSearch();
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onBRT(oEvent) {
			const oBindingParams = oEvent.getParameter("bindingParams");
			const oFilter = new Filter("Value", FilterOperator.EQ, this.byId("CB").getSelected());

			oBindingParams.filters.push(oFilter);
		},

		onFilterChangeSFB(oEvent) {
			const sFilteredFieldName = oEvent.getParameters().getParameter("filterChangeReason");
			const oSFB = oEvent.getSource();
			const oFilterData = oSFB.getFilterData();
			const aFilterItems = oSFB.getAllFilterItems();
			const oBeginDate = aFilterItems?.find(oFilter => oFilter.getName() === "Begda");
			const oSubCategory = aFilterItems?.find(oFilter => oFilter.getName() === "SubCat");
			const aSubCategoryFilters = [];

			if (["Begda", "Endda"].includes(sFilteredFieldName)) {
				oBeginDate.setProperty("mandatory", !!oFilterData.Endda);
				oBeginDate.getControl()?.setValueState(oFilterData.Endda ? "Error" : "None");
			}

			if (oFilterData?.Category) {
				oFilterData?.Category?.items?.forEach(oCategory => {
					aSubCategoryFilters.push(new Filter("Cat", FilterOperator.EQ, oCategory?.key));
				});
			}

			oSubCategory?.getControl()?.getBinding("items")?.filter(aSubCategoryFilters);
		},

		onGetSFBData() {
			const oSFBData = this.byId("SFB")?.getFilterData();
			const sID = oSFBData?.ID;
			const aIDRange = oSFBData?.ID?.ranges;
			const sIDValue = aIDRange[0]?.value1;
			const oIDRange = {
				Include: aIDRange[0]?.exclude,
				Operation: aIDRange[0]?.operation,
				Value: aIDRange[0]?.value1
			};
		},

		onInitSFB(oEvent) {
			const oSFB = this.byId("SFB");
			const oST = this.byId("ST");
			const aFilterItems = oEvent.getSource().getAllFilterItems();

			aFilterItems.filter(oFilter => oFilter.getName() === "ID")[0]?.setVisible(false);

			oSFB?.setFilterContainerWidth("15rem");
			oSFB?.getControlByKey("ID")?.setEnabled(false);

			const oFilter = {
				ID: "X",
				Key: {
					items: [{
						key: "X",
						text: "X Description"
					}]
				}
			};

			oSFB?.setFilterData(oFilter);
			oST?.rebindTable();
		},

		onSelectITB() {
			this.byId("SFB")?.triggerSearch();
		},

		onSearchSFB() {
			const oComboBox = this.byId("ComboBox");
			const oFilterData = this.byId("SFB").getFilterData();
			const oViewModel = this.getModel("model");
			const aFilters = [];

			if (oFilterData?.ID) {
				oFilterData?.ID?.items?.forEach(oID => aFilters.push(new Filter("ID", FilterOperator.EQ, oID.key)));
				oFilterData?.ID?.ranges?.forEach(oID => aFilters.push(new Filter("ID", FilterOperator.EQ, oID.value1)));

				if (oFilterData?.ID?.value) {
					aFilters.push(new Filter("ID", FilterOperator.EQ, oFilterData.ID.value));
				}
			}

			if (oFilterData?.Text) {
				oFilterData?.Text?.ranges?.forEach(oText => aFilters.push(new Filter("Text", FilterOperator.EQ, oText.value1)));
			}

			if (oComboBox?.getSelectedKey()) {
				aFilters.push(new Filter("Value", FilterOperator.EQ, oComboBox.getSelectedKey() === "Yes" ? "X" : ""));
			}

			this.onReadQuery("/...Set", aFilters, this.getModel())
				.then(oData => oViewModel.setProperty("/Items", oData.results))
				.catch(() => { })
				.finally(() => { });
		},

		onSetFilter() {
			this.byId("SFB")?.getAllFilterItems()?.filter(oFilter => oFilter.getName() === "ID").forEach(oItem => {
				oItem?.getControl()?.setValueHelpOnly(true);
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		setFilterData() {
			this.byId("SFB")?.setFilterData({
				Date: {
					low: new Date(),
					high: new Date()
				},
				Text: {
					ranges: [{
						exclude: false,
						keyField: "Text",
						operation: "EQ",
						value1: "X",
						value2: null
					}]
				}
			});
		}

	});

});