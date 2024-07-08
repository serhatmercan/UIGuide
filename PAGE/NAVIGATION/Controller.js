sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], (BaseController) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGoToExternalApplication() {
			const oService = sap.ushell.Container.getService("CrossApplicationNavigation");
			const oParams = {
				ID: ["X"],
				Value: ["ABC"]
			};

			// Parameter Contains / Character
			oParams.Value = oParams.Value.map(sValue => sValue.replace("/", "%%"));

			const oTarget = {
				action: "manage",
				semanticObject: "ZApplication"
			};

			const oProperties = {
				params: oParams,
				target: oTarget
			};

			oTarget.action = `manage&/ZApplication/ABC/9999999999`;

			oService.toExternal(oProperties);
		},

		onGoToExternalApplicationInNewTab() {
			const oService = sap.ushell.Container.getService("CrossApplicationNavigation");
			const oHrefForExternal = oService.hrefForExternal({
				target: {
					action: "display",
					semanticObject: "ZSM_APP"
				},
				params: {}
			});
			const oURLHelper = sap.m.URLHelper;
			const sBaseUrl = window.location.href.split("#")[0];

			oURLHelper.redirect(`${sBaseUrl}${oHrefForExternal}`, true);
			oURLHelper.redirect(`#ZSM_APP-manage&/Candidate/TR33273/A8`, true);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		getMyComponent() {
			return sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
		},

		getStartupParameters() {
			const { ID, Value } = this.getMyComponent().getComponentData().startupParameters;
			const sID = ID.toString();
		},

		patternMatched(oEvent) {
			const { ID } = oEvent.getParameter("arguments");

			this.getStartupParameters();
		}

	});
});