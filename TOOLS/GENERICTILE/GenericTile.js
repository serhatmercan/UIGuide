sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Certifications: [
					{
						Certification: "Introduction To ABAP In The Cloud",
						Date: "September 2021",
						Logo: "https://www.suse.com/c/wp-content/uploads/2021/12/openSAP-logo.png",
						URL: "https://open.sap.com/verify/xilap-vilyz-tovud-zoryz-cabyt"
					}
				],
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGoToObject(oEvent) {
			const sID = oEvent.getSource().getId();
			const oRouter = this.getRouter();

			if (sID.includes("GTI")) {
				oRouter.navTo("object", { Mode: "X" });
			}
		},

		onShowCertification(oEvent) {
			const sPath = this.getModel("cv").getProperty(`${oEvent.getSource().getBindingContext("cv").getPath()}/URL`);

			if (sPath) {
				window.open(sPath, "_blank");
			}
		}

		/* ================ */
		/* Internal Methods */
		/* ================ */

	});

});