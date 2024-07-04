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

		onGoToExternalApplication: function () {
			const oParams = {};
			const oTarget = {
				action: "manage",
				semanticObject: "ZApplication"
			};
			const oProperties = {
				params: oParams,
				target: oTarget
			};

			oParams["ID"] = "X";
			oParams["Value"] = "ABC";
			oParams["ID"] = ["X"];
			oParams["Value"] = ["ABC"];

			// Parameter Contains / Character
			oParams["Value"] = oParams["Value"].replace("/", "%%");

			oTarget.action = "display";
			oTarget.action = "manage&/ZApplication/" + "ABC" + "/9999999999";

			sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(oProperties);
		},

		onGoToExternalApplicationInNewTab: function () {
			const oHrefForExternal = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
				target: {
					action: "display",
					semanticObject: "ZSM_APP"
				},
				params: {}
			});

			sap.m.URLHelper.redirect(window.location.href.split("#")[0] + oHrefForExternal, true);
			sap.m.URLHelper.redirect("#ZSM_APP-manage&/Candidate/" + "TR33273" + "/" + "A8", true);
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
			const sIDx = oStartupParameters.ID.toString();
			const sValue = oStartupParameters.Value;
		},

		patternMatched: function (oEvent) {
			const sID = oEvent.getParameter("arguments").ID;

			this.getStartupParameters();
		}

	});

});