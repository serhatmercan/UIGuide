sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, Fragment) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		onShowPopover: function (oEvent) {
			const oSource = oEvent.getSource();
			const oView = this.getView();

			if (!this._oPopover) {
				this._materialDetailDialog = Fragment.load({
					id: oView.getId(),
					name: "..fragment.Popover",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._oPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		}

	});

});