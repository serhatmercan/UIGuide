sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/unified/FileUploaderParameter"
], function (BaseController, MessageToast, JSONModel, FileUploaderParameter) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(
				new JSONModel({
					Items: [],
					Value: ""
				}), "model");

			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onUCFileUploader: function (oEvent) {
			const oFileUploader = this.byId("FileUploader");
			const sResponse = oEvent.getParameter("response");
			const iHttpStatusCode = +/\d{3}/.exec(sResponse)[0];
			let sMessage;

			oFileUploader.clear();
			oFileUploader.destroyHeaderParameters();

			if (sResponse) {
				sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
				MessageToast.show(sMessage);
			}
		},

		onUpload: function () {
			const oFileUploader = this.byId("FileUploader");

			if (oFileUploader.getValue() === "") {
				MessageToast.show("Choose a File !");
			} else {
				oFileUploader.addHeaderParameter(
					new FileUploaderParameter({
						name: "SLUG",
						value: oFileUploader.getValue() + "~" + "XYZ"
					})
				);

				oFileUploader.addHeaderParameter(
					new FileUploaderParameter({
						name: "Key",
						value: "123"
					})
				);

				oFileUploader.addHeaderParameter(
					new FileUploaderParameter({
						name: "x-csrf-token",
						value: oModel.getSecurityToken()
					})
				);

				oFileUploader.setSendXHR(true);
				oFileUploader.upload();
			}
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		patternMatched: function (oEvent) {

		}

	});

});