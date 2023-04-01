sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onConfirm: function () {			
			const oTable = this.byId("TreeTable");
			const oData = oTable.getContextByIndex(oTable.getSelectedIndex()).getObject();
		}

	});

});