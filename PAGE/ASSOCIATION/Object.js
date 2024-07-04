<<<<<<< HEAD
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

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {
			const sPath = this.getModel().createKey("/MainSet", {
				ID: oEvent.getParameter("arguments").ID
			});

			this.getView().bindElement({
				path: sPath
			});
		}

	});

=======
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

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {
			const sPath = this.getModel().createKey("/MainSet", {
				ID: oEvent.getParameter("arguments").ID
			});

			this.getView().bindElement({
				path: sPath
			});
		}

	});

>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
});