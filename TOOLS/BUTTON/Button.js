sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Button"
], (BaseController, Button) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onPress(oEvent) {
			const oContext = oEvent.getSource().getBindingContext().getObject();
		},

		onSendParameter(sType, oEvent) { },

		/* ================ */
		/* Internal Methods */
		/* ================ */

		generateButton() {
			return new Button({
				icon: "sap-icon://add",
				text: "Add Button",
				press: (oEvent) => { }
			}).addStyleClass("sapUiSmallMarginBegin");
		},

		generateButtonCD() {
			return new Button({
				text: "Button",
				customData: [{
					Type: "sap.ui.core.CustomData",
					key: "Key",
					value: "Value"
				}],
				press: (oEvent) => {
					const { key: sKey, value: sValue } = oEvent.getSource()?.getCustomData()[0];
				}
			}).addStyleClass("sapUiSmallMarginBegin");
		}


	});
});
