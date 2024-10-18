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
			const oViewModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");

			sap.ui.getCore().getEventBus().subscribe("com.serhatmercan", "PDFLoaded", this.pdfLoaded, this);

			this.setDefaultZoomLevel();
		},

		onExit() {
			sap.ui.getCore().getEventBus().unsubscribe("com.serhatmercan", "PDFLoaded", this.pdfLoaded);

			if (this.oPDFViewer) {
				this.oPDFViewer.destroy();
				this.oPDFViewer = null;
			}
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		async onShowIFrame() {
			const oModel = this.getModel();

			if (!this.oPDFViewer) {
				this.oPDFViewer = await this.loadFragment({
					id: this.getView().getId(),
					name: "com.serhatmercan.Dialog.Html",
					controller: this
				});
				this.oPDFViewer.setModel(this.getModel("i18n"), "i18n");
				this.oPDFViewer.setModel(oModel);
			}

			const sPath = oModel.createKey("/IDSet", {
				ID: "X"
			});
			const sURL = `${oModel.sServiceUrl}${sPath}`;
			const oLoadEvent = "sap.ui.getCore().getEventBus().publish('com.serhatmercan', 'PDFLoaded')";
			const sEncodedURL = jQuery.sap.encodeHTML(sURL + "/$value");
			const sEncodedLoadEvent = jQuery.sap.encodeHTML(oLoadEvent);
			const sSource = `<iframe name='PDF' src='${sEncodedURL}' onLoad='${sEncodedLoadEvent}' width='100%' height='99%' type='application/pdf'/>`;

			sap.ui.core.Fragment.byId("Dialog", "idIFrame").setContent(sSource);

			this.oPDFViewer.open();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		pdfLoaded() {
			const oFrame = window.frames.pastelLabelPdf;

			try {
				oFrame.focus();
				oFrame.print();
				this.oPDFViewer.close();
			} catch (oError) {
				MessageToast.show(this.getText("autoPrintNotSupported"));
			}
		},

		setDefaultZoomLevel() {
			const iCurrentBrowserZoomLevel = Math.round(window.devicePixelRatio * 100);

			try {
				if (window.screen.width < 1920 && iCurrentBrowserZoomLevel > 95) {
					document.body.style.zoom = "75%";
				}
			} catch (oError) { }
		}

	});

});