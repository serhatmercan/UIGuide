sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		_onObjectMatched: function (oEvent) {
			const sId = oEvent.getParameter("arguments").id;

			this._getStartupParameters();
		},

		_getMyComponent: function () {
			const sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		},

		_goToExternalApplication: function () {
			const oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
			const oParams = {};
			const oTarget = {
				action: "manage", // display
				semanticObject: "ZApplication"
			};
			const oProperties = {
				target: oTarget,
				params: oParams
			};

			oParams["ID"] = ["X"];
			oParams["Value"] = ["ABC"];

			oCrossAppNav.toExternal(oProperties);
		},

		_getStartupParameters: function () {
			const oStartupParameters = this._getMyComponent().getComponentData().startupParameters;
			const sID = oStartupParameters.ID;
			const sValue = oStartupParameters.Value;
		},

		_getMyComponent: function () {
			return sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		}

	});

});