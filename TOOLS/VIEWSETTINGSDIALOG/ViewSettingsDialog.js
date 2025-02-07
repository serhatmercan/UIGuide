sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/GroupHeaderListItem",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter"
], function (BaseController, GroupHeaderListItem, Fragment, JSONModel, Filter, Sorter) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				InfoToolbarText: "",
				InfoToolbarVisible: false,
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onFilter(oEvent) {
			const { filterItems: aFilterItems, filterString: sFilterString } = oEvent.getParameters();
			const oViewModel = this.getModel("model");
			const aFilter = [];

			aFilterItems?.forEach(oFilterItem => {
				const [sPath, sOperator, sValue1, sValue2] = oFilterItem?.getKey()?.split("__");
				aFilter.push(new Filter(sPath, sOperator, sValue1, sValue2));
			});

			this.byId("List")?.getBinding("items")?.filter(aFilter);

			oViewModel.setProperty("/InfoToolbarText", sFilterString);
			oViewModel.setProperty("/InfoToolbarVisible", aFilter.length > 0 ? true : false);
		},

		onGroup(oEvent) {
			const { groupItem: oGroupItem, groupDescending: bGroupDescending } = oEvent.getParameters();
			const sKey = oGroupItem?.getKey();
			const aGroups = [
				new Sorter(sKey, bGroupDescending, true)
			];

			this.byId("List")?.getBinding("items")?.sort(oGroupItem ? aGroups : []);
		},

		onSort(oEvent) {
			const { sortItem: oSortItem, sortDescending: bSortDescending } = oEvent.getParameters();
			const sKey = oSortItem?.getKey();
			const aSorters = [
				new Sorter(sKey, bSortDescending)
			];

			this.byId("List")?.getBinding("items")?.sort(oSortItem ? aSorters : []);
		},

		async onShowViewSettingsDialog(sID, oEvent) {
			if (!this.oDialog) {
				await this.loadFragment({
					name: "com.serhatmercan.fragment.ViewSettingsDialog", // sID
					controller: this
				}).then(oDialog => {
					oView.addDependent(oDialog);
					this.oDialog = oDialog;
					this.oDialog.open();
				});
			} else {
				this.oDialog.open();
			}
		},

		onShowSort() {
			const oView = this.getView();
			const sID = oView.getId();

			if (!this.oSortDialog) {
				Fragment.load({
					id: sID,
					name: "com.serhatmercan.fragment.ViewSettingsDialog",
					controller: this
				}).then(oDialog => {
					this.oSortDialog = oDialog;
					oView.addDependent(this.oSortDialog);
					this.oSortDialog.open();
				});
			} else {
				this.oSortDialog.open();
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */


		formatGroupHeader(oGroup) {
			switch (oGroup?.key) {
				case "0":
					return new GroupHeaderListItem({ title: "Beverages" });
				case "1":
					return new GroupHeaderListItem({ title: "Electronics" });
				case "2":
					return new GroupHeaderListItem({ title: "Food" });
				default:
					return new GroupHeaderListItem({ title: "Unknwon" });
			}
		}
	});
});