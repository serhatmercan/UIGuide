sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, Fragment) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		/* ============== */
        /* Event Handlers */
        /* ============== */        

		onShowPopover: function (oEvent) {
			this.showPopover(oEvent, "PopoverID", "Popover");
		},

		onClose: function () {
			oEvent.getSource().getParent().getParent().close();
		},

		/* ================ */
        /* Internal Methods */
        /* ================ */

		showPopover: function (oEvent, sDialogID, sName) {
			const oSource = oEvent.getSource();
			const oView = this.getView();
			let oDialog = this.byId(sDialogID);

			if (!oDialog) {
				Fragment.load({
					id: oView.getId(),
					name: "com.serhatmercan.fragment.dialog." + sName,
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					oPopover.openBy(oSource);
				});
			} else {
				oDialog.openBy(oSource);
			}
		}

	});

});