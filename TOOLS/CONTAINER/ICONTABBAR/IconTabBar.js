sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.byId("idITB").setSelectedKey("keyITF1");
		},

		onSelectITB: function (oEvent) {
			if (oEvent.getParameter("key") === "ITF1") {}

			switch (oEvent.getParameter("key")) {
			case "keyITF1":
				break;
			default:
				break;
			}
		},

		getSelectedDataITB: function (oEvent) {
			const oITB = this.byId("idITB");
			const oSelectedFilterItem = oITB.getAggregation("items").find(oItem => oItem.getKey() === oITB.getSelectedKey());
			const oSelectedTable = oSelectedFilterItem.getContent()[0];
		},

		getITBContents: function () {
			this.byId("idITB").getItems().forEach(oItem => {
				oItem.getContent()[0].clearSelection();
			});
		}

	});

});