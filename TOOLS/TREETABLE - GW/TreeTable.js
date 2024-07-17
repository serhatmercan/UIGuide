sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], (BaseController) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onConfirm() {
			const oTable = this.byId("TreeTable");
			const oSelectedIndex = oTable?.getSelectedIndex();
			const oData = oSelectedIndex !== -1 ? oTable?.getContextByIndex(oSelectedIndex)?.getObject() : null;
		}

	});

});