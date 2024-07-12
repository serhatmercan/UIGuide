sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], (BaseController) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const sPath = oElementBinding.getPath();
			const oListSelector = this.getOwnerComponent().oListSelector;
			const oList = oListSelector._oList;
			const aItems = oList?.getItems() ?? [];
			const oSelectedItem = oList?.getSelectedItem();
			const oSelectedItemx = aItems.find(oItem => oItem.getSelected() === true);
			const iSelectedIndex = aItems.findIndex(oItem => oItem.getSelected() === true);

			if (oSelectedItem) {
				oSelectedItem.getTouchedX();
			}

			const iFocusedIndex = oList?._oItemNavigation?.getFocusedIndex();

			if (oList) {
				oList.scrollToIndex(iSelectedIndex);
				oList.scrollToIndex(iFocusedIndex);
				oList.setSelectedItem(oSelectedItemx);
			}

			oListSelector.selectAListItem(sPath);

			aItems.some(oItem => {
				if (oItem.getBindingContext()?.getPath() === sBindingPath) {
					oList.setSelectedItem(oItem);
					return true;
				}
				return false;
			});

			setTimeout(() => {
				oList?.scrollToIndex(23)
					.then(() => { })
					.catch(() => { });
			}, 200);
		}

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});

});