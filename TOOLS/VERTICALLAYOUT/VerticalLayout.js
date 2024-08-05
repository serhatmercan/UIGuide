sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Button",
	"sap/ui/model/json/JSONModel"
], (BaseController, Button, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onAfterRendering() {
			this.generateGenericTile();
		},

		onInit() {
			this.setModel(new JSONModel({
				Items: [],
				Value: ""
			}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		/* ================ */
		/* Internal Methods */
		/* ================ */

		generateGenericTile() {
			const oService = sap.ushell.Container.getService("CrossApplicationNavigation");
			const oVL = this.byId("VL");

			aTiles.forEach(({ ApplicationName, Action, SemanticObject }) => {
				const oButton = new Button({
					text: ApplicationName,
					customData: [{
						Type: "sap.ui.core.CustomData",
						key: Action,
						value: SemanticObject
					}],
					press: (oEvent) => {
						const oCustomData = oEvent.getSource()?.getCustomData()[0];
						const { key: sAction, value: sSemanticObject } = oCustomData?.getProperty();
						const oHrefForExternal = oService?.hrefForExternal({
							target: {
								action: sAction,
								semanticObject: sSemanticObject
							}
						});

						oService?.toExternal({ target: { shellHash: oHrefForExternal } });
					}
				});

				oButton?.addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop tileLayouts");
				oVL?.addContent(oButton);
			});
		},

		patternMatched() { }

	});
});