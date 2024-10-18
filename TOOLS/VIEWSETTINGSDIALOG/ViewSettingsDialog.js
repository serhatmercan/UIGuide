sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter"
], function (BaseController, Fragment, JSONModel, Sorter) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onConfirm(oEvent) {
			const { sortItem: oSortItem, sortDescending: bSortDescending } = oEvent.getParameters();
			const sKey = oSortItem?.getKey();
			const aSorters = [
				new Sorter(sKey, bSortDescending)
			];
			const aItems = this.byId("Table")?.getBinding("items");

			aItems?.sort(aSorters);
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
		}
	});
});