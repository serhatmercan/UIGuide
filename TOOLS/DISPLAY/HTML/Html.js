sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oModel, "model");

			sap.ui.getCore().getEventBus().subscribe("com.serhatmercan", "PDFLoaded", this._onPDFLoaded, this);

			this._setDefaultZoomLevel();
		},

		onExit: function () {
			sap.ui.getCore().getEventBus().unsubscribe("com.serhatmercan", "PDFLoaded", this._onPDFLoaded);
		},

		onShowIFrame: function () {
			const oModel = this.getModel();
			let sPath;

			if (!this._oPDFViewer) {
				this._oPDFViewer = sap.ui.xmlfragment("Dialog", "com.serhatmercan.Dialog.Html", this);
				this._oPDFViewer.setModel(this.getModel("i18n"), "i18n");
				this._oPDFViewer.setModel(oModel);
			}

			sPath = oModel.createKey("/IDSet", {
				ID: "X"
			});

			const sURL = oModel.sServiceUrl + sDocPath;
			const oLoadEvent = "sap.ui.getCore().getEventBus().publish('com.serhatmercan', 'PDFLoaded')";
			const sSource = "<iframe name='PDF' src='" + jQuery.sap.encodeHTML(sURL + "/$value") + "' onLoad='" +
				jQuery.sap.encodeHTML(oLoadEvent) + "' width='100%' height='99%' type='application/pdf'/>";

			sap.ui.core.Fragment.byId("Dialog", "idIFrame").setContent(sSource);

			this._oPDFViewer.open();
		},

		_setDefaultZoomLevel: function () {
			const iCurrentBrowserZoomLevel = Math.round(window.devicePixelRatio * 100);
			try {
				if (window.screen.width < 1920 && iCurrentBrowserZoomLevel > 95) {
					document.body.style.zoom = "75%";
				}
			} catch (oError) {
				//
			}
		},

		_onPDFLoaded: function () {
			const oFrame = window.frames.pastelLabelPdf;

			try {
				oFrame.focus();
				oFrame.print();
				this._oPDFViewer.close();
			} catch (e) {
				MessageToast.show(this.getResourceBundle().getText("autoPrintNotSupported"));
			}
		},

	});

});