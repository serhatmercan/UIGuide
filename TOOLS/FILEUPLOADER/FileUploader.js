sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/unified/FileUploaderParameter"
], (BaseController, MessageToast, JSONModel, FileUploaderParameter) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(
				new JSONModel({
					Items: [],
					Value: ""
				}), "model"
			);

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onUCFileUploader(oEvent) {
			const oFileUploader = this.byId("FileUploader");
			const oHeaders = oEvent.getParameter("headers");
			const sResponse = oEvent.getParameter("response");
			const oResponseRaw = oEvent.getParameter("responseRaw");
			const iHttpStatusCode = oEvent.getParameter("status");
			const iHttpStatusCodeII = +sResponse.match(/\d{3}/)[0];

			oFileUploader.clear();
			oFileUploader.destroyHeaderParameters();
			oFileUploader.setValue("");

			if (sResponse) {
				const sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
				MessageToast.show(sMessage);
			}

			// Custom Return Message
			if (oHeaders.Type === "E") {
				// oHeaders.Type || oHeaders.ID || oHeaders.Number || oHeaders.Message  
			}

			// System Return Message
			const sMessage = new DOMParser()?.parseFromString(oResponseRaw, "text/xml")?.querySelector("message")?.textContent;
		},

		onUpload() {
			const oFileUploader = this.byId("FileUploader");
			const oModel = this.getModel();

			if (oFileUploader.getValue() === "") {
				MessageToast.show("Choose a File!");
			} else {
				const aHeaderParameters = [
					{ name: "SLUG", value: oFileUploader.getValue() + "~" + "XYZ" },
					{ name: "Key", value: "123" },
					{ name: "x-csrf-token", value: oModel.getSecurityToken() }
				];

				aHeaderParameters.forEach(oParameter => {
					oFileUploader.addHeaderParameter(new FileUploaderParameter(oParameter));
				});

				oFileUploader.setSendXHR(true);
				oFileUploader.upload();
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched() { }

	});

});