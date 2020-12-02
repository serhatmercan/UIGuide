sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {

			var oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});

			this.setModel(oViewModel, "objectView");

		},

		_onObjectMatched: function (oEvent) {
			var sId = oEvent.getParameter("arguments").objectId;

			this.getView().bindElement({
				path: "/MainSet(Id='" + sId + "')"
			});
		}

	});

});