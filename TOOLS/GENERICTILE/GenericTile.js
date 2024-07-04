sap.ui.define([
	"com/serhatmercan/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Certifications: [
						{
							"Certification": "Introduction To ABAP In The Cloud",
							"Date": "September 2021",
							"Logo": "https://www.suse.com/c/wp-content/uploads/2021/12/openSAP-logo.png",
							"URL": "https://open.sap.com/verify/xilap-vilyz-tovud-zoryz-cabyt"
						}
					],
					Items: [],
					Value: ""
				}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGoToObject: function (oEvent) {
			const sID = oEvent.getSource().getId();
			const oRouter = this.getRouter();

			if (sID.includes("GTI")) {
				oRouter.navTo("object", {
					Mode: "X"
				});
			}
		},

		onShowCertification: function (oEvent) {
			const sPath = this.getModel("cv").getProperty(oEvent.getSource().getBindingContext("cv").getPath() + "/URL");

			if (sPath) {
				window.open(sPath, "_blank");
			}
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});

});