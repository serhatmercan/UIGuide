sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel, Fragment) => {
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

		onClose(oEvent) {
			oEvent.getSource().getParent().getParent().close();
		},

		onShowPopover(oEvent) {
			this.showPopover(oEvent, "PopoverID", "Popover");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		showPopover(oEvent, sDialogID, sName) {
			const oSource = oEvent.getSource();
			const oView = this.getView();
			let oDialog = this.byId(sDialogID);

			if (!oDialog) {
				Fragment.load({
					id: oView.getId(),
					name: `com.serhatmercan.fragment.dialog.${sName}`,
					controller: this
				}).then((oPopover) => {
					oView.addDependent(oPopover);
					oPopover.openBy(oSource);
				});
			} else {
				oDialog.openBy(oSource);
			}
		}

	});

});