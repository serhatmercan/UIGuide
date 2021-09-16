sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		_onObjectMatched: function (oEvent) {
			const sId = oEvent.getParameter("arguments").id;

			this.oStartupParameters = this._getMyComponent().getComponentData().startupParameters;
			this.oStartupParameters.ID;
		},

		_getMyComponent: function () {
			const sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		}

	});

});