sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/PDFViewer"
], function (BaseController, JSONModel, PDFViewer) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				Value: "",
				DocumentUrl: ""
			});
			this.setModel(oModel, "model");
		},

		onShowDocument: function () {
			if (!this._oDocument) {
				this._oDocument = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.Document", this);
				this._oDocument.setModel(this.getModel("i18n"), "i18n");
				this._oDocument.setModel(this.getModel());
				this._getFiles();
			}

			// Upload Button Visibility
			this.byId('idDocumentUC').setUploadButtonInvisible(false);

			this._oDocument.open();
		},

		onCloseDocument: function () {
			this._oDocument.close();
		},

		onBUSDocument: function (oEvent) {
			const oUploadParameter = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: encodeURIComponent(oEvent.getParameter("fileName"))
			});

			oEvent.getParameters().addHeaderParameter(oUploadParameter);
		},

		onUCDocument: function (oEvent) {
			const oUploadCollection = oEvent.getSource();
			const oModel = this.getModel();
			let sCSRF;

			oModel.refreshSecurityToken();
			sCSRF = oModel.getHeaders()["x-csrf-token"];
			this._addParameter(oUploadCollection, "x-csrf-token", sCSRF);
		},

		onFDDocument: function (oEvent) {
			const aOriginDocuments = oEvent.getSource().getBinding("items").getCurrentContexts();
			const aNewDocuments = sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC").getItems();
			let aOriginGuid = [];
			let aNewGuid = [];
			let aGuid = [];

			aOriginGuid = aOriginDocuments.map(item => {
				return {
					Guid: item.getObject("Guid")
				};
			});

			aNewGuid = aNewDocuments.map(item => {
				return {
					Guid: item.getBindingContext().getProperty("Guid")
				};
			});

			aOriginGuid.forEach((OriginGuid) => {
				if (aNewGuid.findIndex(x => x.Guid === OriginGuid.Guid) === -1) {
					aGuid.push(OriginGuid.Guid);
				}
			});

			this._deleteDocuments(aGuid);
		},

		onCUDocument: function (oEvent) {
			if (this.getModel("model").getProperty("/Value") !== "") {
				sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC").fireFileDeleted(oEvent);
			}

			this.onCloseDocument();
		},

		onPrintout: function () {
			this._getPrintout();
		},

		_addParameter: function (oCollection, sName, sValue) {
			const oUploadParameter = new sap.m.UploadCollectionParameter({
				name: sName,
				value: sValue
			});

			oCollection.addHeaderParameter(oUploadParameter);
		},

		_getFiles: function () {
			const aFilters = [];
			const aItems = sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC").getBinding("items");
			const sValue = this.getModel("model").getProperty("/Value");

			aFilters.push(new Filter("X", FilterOperator.EQ, sValue));

			aItems.filter(aFilters);
		},

		_uploadDocument: function () {
			const oUploadCollection = sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC");

			if (oUploadCollection && oUploadCollection._aFileUploadersForPendingUpload.length > 0) {
				this._updateUploadUrl();
				oUploadCollection.upload();
			}
		},

		_updateUploadUrl: function () {
			const oUploadCollection = sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC");
			const sServiceUrl = this._getUploadUrl();

			oUploadCollection._aFileUploadersForPendingUpload.forEach(function (oPendingUploads) {
				oPendingUploads.setUploadUrl(sServiceUrl);
			});
		},

		_getUploadUrl: function () {
			const sValue = this.getModel("model").getProperty("/Value");
			const sPath = this.getModel().createKey("/MainEntitySet", {
				ID: sValue
			});
			let sDocumentPath = "";

			sDocumentPath = this.getModel().sServiceUrl + sPath + "/Documents";

			return sDocumentPath;
		},

		_deleteDocuments: function (aData) {
			let oViewModel = this.getModel("viewModel"),
				oData = {};

			oData.ID = "Documents";
			oData.Documents = [];

			aData.forEach((Data) => {
				oData.Documents.push({
					Guid: Data
				});
			});

			oViewModel.setProperty("/Busy", true);

			this._sendMultiData("/DeepIDSet", oData, this.getModel())
				.then((oData) => {
					this._uploadDocument();
				})
				.catch((err) => {})
				.finally(() => {
					oViewModel.setProperty("/Busy", false);
				});
		},

		_getPrintout: function () {
			const aContexts = this.byId("idTable").getTable().getSelectedContexts();
			let sID = "";

			if (aContexts.length === 0) {
				MessageToast.show(this.getResourceBundle().getText("infoChooseRow"));
				return;
			}

			sID = aContexts.map(oContext => this.getModel().getProperty(oContext.getPath() + "/ID")).join("-");

			this._openPdfViewer(sID);
		},

		_openPdfViewer: function (sID) {
			const sServiceURL = this.getModel().sServiceUrl;
			const oPDFViewer = new PDFViewer();
			let sPath = "",
				sDocumentPath = "";

			sPath = this.getModel().createKey("/PrintoutSet", {
				ID: sID
			});

			sDocumentPath = sServiceURL + sPath + "/$value";

			oPDFViewer.setSource(sDocumentPath);
			oPDFViewer.setTitle(this.getResourceBundle().getText("preview"));
			oPDFViewer.open();
		},

		_sendMultiData: function (sSet, oData, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				let oParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.create(sSet, oData, oParameters);
			});
		},

	});

});