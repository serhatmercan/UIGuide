sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const sPath = oElementBinding.getPath();
			const oListSelector = this.getOwnerComponent().oListSelector;
			const oList = oListSelector._oList;
			const aItems = oList?.getItems();
			const oSelectedItem = oList.getSelectedItem();

			aItems?.find(oItem => oItem.getSelected() === true);
			aItems?.findIndex(oItem => oItem.getSelected() === true);

			oSelectedItem.getTouchedX();

			oList._oItemNavigation.getFocusedIndex();

			oList?.scrollToIndex(aItems?.findIndex(oItem => oItem.getSelected() === true));
			oList?.scrollToIndex(oList?._oItemNavigation?.getFocusedIndex());

			oList.setSelectedItem(aItems?.find(oItem => oItem.getSelected() === true));

			oListSelector.selectAListItem(sPath);

			aItems.some((oItem) => {
				if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === sBindingPath) {
					oList.setSelectedItem(oItem);
					return true;
				}
			});

			setTimeout(() => {
				oList?.scrollToIndex(23)
					.then(() => {
						debugger;
					})
					.catch(() => {
						debugger;
					})
					.finally(() => { });
			}, 200);

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function () { }

	});

});