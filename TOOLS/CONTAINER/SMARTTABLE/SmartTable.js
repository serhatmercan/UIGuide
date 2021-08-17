sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {},

		onShow: function (oEvent) {
			let aContexts = this.byId("idTableST").getTable().getSelectedContexts();

			for (let i = 0; i < aContexts.length; i++) {
				this_sID = this.getModel().getProperty(aContexts[i].getPath() + "/ID");
			}
		},

		onDetail: function (oEvent) {
			let sPath = oEvent.getSource().getBindingContextPath(),
				oContext = this.getModel().getProperty(sPath);

			this._sID = oContext.ID;
		},

		_getSelectedData: function () {
			const aContexts = this.byId("idTableST").getTable().getSelectedContexts();

			if (aContexts.length > 0) {
				this._oSelectedData = this.getModel().getProperty(aContexts[0].getPath());
			}
		},

		_refreshTable: function () {
			this.byId("idTableST").getBinding("items").refresh(true);
		}

	});

});