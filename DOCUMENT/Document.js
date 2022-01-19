sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/UploadCollectionParameter",
	"sap/m/PDFViewer"
], function (BaseController, JSONModel, UploadCollectionParameter, PDFViewer) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			const oModel = new JSONModel({
				DocumentUrl: "",
				Documents: [],
				Value: "",
			});
			this.setModel(oModel, "model");
		},

		onBUSDocument: function (oEvent) {
			const oUploadParameter = new UploadCollectionParameter({
				name: "slug",
				value: encodeURIComponent(oEvent.getParameter("fileName")) + "&&" + "X"
			});

			oEvent.getParameters().addHeaderParameter(oUploadParameter);
		},

		onCloseDocument: function () {
			this._oDocument.close();
			this._oDocument.destroy();
			this._oDocument = null;
		},

		onCUDocument: function (oEvent) {
			if (this.getModel("model").getProperty("/Value") !== "") {
				sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC").fireFileDeleted(oEvent);
				this._uploadDocument();
			}

			this.onCloseDocument();
		},

		onFDDocument: function (oEvent) {
			const aOriginDocuments = oEvent.getSource().getBinding("items").getCurrentContexts();
			const aNewDocuments = sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC").getItems();
			let aOriginDocumentID = [];
			let aNewDocumentID = [];
			let aDocumentsIDs = [];

			aOriginDocumentID = aOriginDocuments.map(item => {
				return {
					DocumentID: item.getObject("DocumentID")
				};
			});

			aNewDocumentID = aNewDocuments.map(item => {
				return {
					DocumentID: item.getBindingContext().getProperty("DocumentID")
				};
			});

			aOriginDocumentID.forEach((oOriginDocumentID) => {
				if (aNewDocumentID.findIndex(x => x.DocumentID === oOriginDocumentID.DocumentID) === -1) {
					aDocumentsIDs.push(oOriginDocumentID.DocumentID);
				}
			});

			this._deleteDocuments(aDocumentsIDs);
		},

		onFDSingleDocument: function () {
			const oModel = this.getModel();
			const oDocumentKey = oModel.createKey("/DocumentSet", {
				DocumentID: "X"
			});

			this._deleteSingleData(oDocumentKey, oModel)
				.then(() => {
					this.getModel("viewModel").setProperty("/Documents", []);
				})
				.catch(() => {})
				.finally(() => {});
		},

		onPressUCI: function () {
			const oContext = this.getView().getBindingContext();
			const oModel = this.getModel();
			const sServiceURL = this.getModel().sServiceUrl;
			const sBindingPath = oEvent.getSource().getBindingContext().getPath();
			const sPath = oModel.createKey("/DocumentSet", {
				DocumentID: oModel.getProperty(sBindingPath + "/DocumentID")
			});
			const sDocumentPath = sServiceURL + sPath + "/$value";

			window.open(sDocumentPath, "_blank");
		},

		onShowIFrame: function (oEvent) {
			const oContext = this.getView().getBindingContext();
			const oModel = this.getModel();
			const oResourceBundle = this.getResourceBundle();
			const sServiceURL = this.getModel().sServiceUrl;
			const sBindingPath = oEvent.getSource().getBindingContext().getPath();
			const sFileName = oModel.getProperty(sBindingPath + "/Filename");
			const sPath = oModel.createKey("/DocumentSet", {
				DocumentID: oModel.getProperty(sBindingPath + "/DocumentID")
			});
			const sDocumentPath = sServiceURL + sPath + "/$value";
			const oLoadEvent = "sap.ui.getCore().getEventBus().publish('com.sm.serhatmercan', 'PDFLoaded')";
			const sSource = "<iframe name='PDF' src='" + jQuery.sap.encodeHTML(sDocumentPath) + "' onLoad='" +
				jQuery.sap.encodeHTML(oLoadEvent) +
				"' height='100%' width='100%'/>";

			if (!this._oFrame) {
				this._oFrame = new Dialog({
					title: sFileName,
					afterClose: this.onCloseFrame.bind(this),
					content: [
						new sap.ui.core.HTML({
							content: sSource
						})
					],
					contentHeight: "250rem",
					contentWidth: "250rem",
					horizontalScrolling: false,
					stretch: true,
					verticalScrolling: false,
					endButton: new Button({
						text: oResourceBundle.getText("close"),
						press: function () {
							this.onCloseFrame();
						}.bind(this)
					})
				});
			}

			this._oFrame.open();
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

		onUCDocument: function (oEvent) {
			const oUploadCollection = oEvent.getSource();
			const oModel = this.getModel();
			let sCSRF;

			oModel.refreshSecurityToken();
			sCSRF = oModel.getHeaders()["x-csrf-token"];
			this._addParameter(oUploadCollection, "x-csrf-token", sCSRF);
		},

		onUpdCmpDocument: function () {
			this._getDocument();
		},

		onPrintout: function () {
			this._getPrintout();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		_addParameter: function (oCollection, sName, sValue) {
			const oUploadParameter = new UploadCollectionParameter({
				name: sName,
				value: sValue
			});

			oCollection.addHeaderParameter(oUploadParameter);
		},

		_deleteDocuments: function (aData) {
			let oData = {};

			oData.ID = "Documents";
			oData.Documents = [];

			aData.forEach((sDocumentID) => {
				oData.Documents.push({
					DocumentID: sDocumentID
				});
			});

			this._sendMultiData("/DeepIDSet", oData, this.getModel())
				.then((oData) => {
					this._uploadDocument();
				})
				.catch((err) => {})
				.finally(() => {});
		},

		_getDocument: function () {
			const oModel = this.getModel();
			const sID = oModel.getProperty(this.getView().getBindingContext().getPath() + "/ID");
			const oKey = oModel.createKey("/DocumentSet", {
				ID: "X"
			});

			this._getSingleData(oKey, oModel)
				.then((oData) => {
					this.getModel("viewModel").setProperty("/Documents", oData.DocNumber !== "" ? [oData] : []);
				})
				.catch(() => {})
				.finally(() => {});
		},

		_getFiles: function () {
			const aFilters = [];
			const aItems = sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC").getBinding("items");
			const sValue = this.getModel("model").getProperty("/Value");

			aFilters.push(new Filter("X", FilterOperator.EQ, sValue));

			aItems.filter(aFilters);
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

		_getUploadUrl: function () {
			const sValue = this.getModel("model").getProperty("/Value");
			const sPath = this.getModel().createKey("/MainEntitySet", {
				ID: sValue
			});
			let sDocumentPath = "";

			sDocumentPath = this.getModel().sServiceUrl + sPath + "/Documents";

			return sDocumentPath;
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

		/* ============ */
		/* CRUD Methods */
		/* ============ */

		_deleteSingleData: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.remove(sSet, oParameters);
			});
		},

		_getSingleData: function (sSet, oModel) {
			return new Promise(function (fnSuccess, fnReject) {
				const oParameters = {
					success: fnSuccess,
					error: fnReject
				};
				oModel.read(sSet, oParameters);
			});
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