sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGoToExternalApplication: function (oEvent, oController) {
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

		/* ================ */
		/* Internal Methods */
		/* ================ */
		
		getMyComponent: function () {			
			return sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		},

		getStartupParameters: function () {
			const oStartupParameters = this.getMyComponent().getComponentData().startupParameters;
			const sID = oStartupParameters.ID;
			const sValue = oStartupParameters.Value;
		},

		patternMatched: function (oEvent) {
			const sID = oEvent.getParameter("arguments").ID;	
			
			this.getStartupParameters();
		}

	});

});