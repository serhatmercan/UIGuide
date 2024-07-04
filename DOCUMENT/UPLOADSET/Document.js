sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/PDFViewer",
	"sap/ui/core/Item",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageToast, PDFViewer, Item, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
<<<<<<< HEAD
			this.setModel(
				new JSONModel({
					DeletedDocuments: [],
					DocumentUrl: "",
					Documents: []
				}), "model"
			);
=======
			this.setModel(new JSONModel({
				DeletedDocuments: [],
				DocumentUrl: "",
				Documents: []
			}), "model");
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2

			this.getRouter().getRoute("Document").attachPatternMatched(this.viewMatched, this);
		},

		onExit: function () {
			if (this.oDocument) {
				this.oDocument.destroy();
				this.oDocument = null;
			}
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAIR: function (oEvent) { },

		onBUSDocument: function (oEvent) {
			const oModel = this.getModel();
			const oItem = oEvent.getParameter("item");

			oModel.refreshSecurityToken();
			oItem.removeAllHeaderFields();

			oItem.addHeaderField(new Item({
				key: "x-csrf-token",
				text: oModel.getSecurityToken()
			}));

			oItem.addHeaderField(new Item({
				key: "slug",
				text: encodeURIComponent(oItem.getFileName())
			}));
		},

		onCloseDocument: function () {
			this.oDocument.close();
		},

		onPrintout: function () {
			const aContexts = this.byId("Table").getTable().getSelectedContexts();
			let sID = "";

			if (aContexts.length === 0) {
				MessageToast.show(this.getText("infoChooseRow"));
				return;
			}

			sID = aContexts.map(oContext => this.getModel().getProperty(oContext.getPath() + "/ID")).join("-");

			this.openPdfViewer(sID);
		},

		onSendDocuments: async function () {
			const oDocumentUS = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUS");
			const oViewModel = this.getModel("model");
			const aDeletedDocuments = oViewModel.getProperty("/DeletedDocuments");
			let oData = {};

			if (oDocumentUS) {
				this.addDeletedDocuments();
			}

			oData.Documents = aDeletedDocuments.length ? aDeletedDocuments : [];

			await this.uploadDocument();

			if (oUploadCollection) {
				this.oDocument.destroy();
				this.oDocument = null;
				oViewModel.setProperty("/Documents", []);
			}
		},

		onShowDocument: function () {
			if (!this.oDocument) {
				this.oDocument = sap.ui.xmlfragment(this.getView().getId(), "com.sm.application.fragments.dialog.Document", this);
				this.oDocument.setModel(this.getModel("i18n"), "i18n");
				this.oDocument.setModel(this.getModel("model"), "model");
			}

			this.oDocument.open();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addDeletedDocuments: function () {
			const oDocumentUS = this.byId("DocumentUS");
			const oViewModel = this.getModel("model");
			const aDeletedDocuments = oViewModel.getProperty("/DeletedDocuments");
			const aOriginDocuments = oDocumentUS.getBinding("items").getCurrentContexts();
			const aNewDocuments = oDocumentUS.getItems();
			const sID = oViewModel.getProperty("/ID");
			let aOriginDocumentID = [];
			let aNewDocumentID = [];

			aOriginDocumentID = aOriginDocuments.map(oOriginDocument => {
				return {
					DocumentID: oOriginDocument.getObject("DocumentID")
				};
			});

			aNewDocumentID = aNewDocuments.map(oNewDocument => {
				return {
					DocumentID: oViewModel.getProperty(oNewDocument.getBindingContext("model").getPath() + "/DocumentID")
				};
			});

			aOriginDocumentID.forEach((oOriginDocumentID) => {
				if (aNewDocumentID.findIndex(oNewDocumentID => oNewDocumentID.DocumentID === oOriginDocumentID.DocumentID) === -1) {
					aDeletedDocuments.push({
						ID: sID,
						DocumentID: oOriginDocumentID.DocumentID
					});
				}
			});

			oViewModel.setProperty("/DeletedDocuments", aDeletedDocuments);
		},

		getDocuments: async function (sID) {
			const oViewModel = this.getModel("model");
			const aFilters = [
				new Filter("ID", FilterOperator.EQ, oViewModel.getProperty("/ID"))
			];

			await this.onReadQuery("/DocumentSet", aFilters, this.getModel())
				.then((oData) => {
					oViewModel.setProperty("/Documents", oData.results);
				})
				.catch(() => { })
				.finally(() => { });
		},

		getUploadUrl: function () {
			const oModel = this.getModel();
			const sPath = oModel.createKey("/...Set", {
				ID: this.getModel("model").getProperty("/ID")
			});
			let sDocumentPath = "";

			sDocumentPath = oModel.sServiceUrl + sPath + "/Documents";

			return sDocumentPath;
		},

		openPdfViewer: function (sID) {
			const oModel = this.getModel();
			const oPDFViewer = new PDFViewer();
			const sServiceURL = oModel.sServiceUrl;
			let sDocumentPath = "";
			let sPath = "";

			sPath = oModel.createKey("/...Set", {
				ID: sID
			});

			sDocumentPath = sServiceURL + sPath + "/$value";

<<<<<<< HEAD
			oPDFViewer.attachEventOnce("sourceValidationFailed", (oEvent) => {
				oEvent.preventDefault();
			});
			oPDFViewer.setShowDownloadButton(false);
=======
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			oPDFViewer.setSource(sDocumentPath);
			oPDFViewer.setTitle(this.getText("preview"));
			oPDFViewer.open();
		},

		uploadDocument: async function () {
			const oDocumentUS = this.byId("DocumentUS");
			let iDocumentItemsCount = 0;
			let sServiceUrl = "";

			if (!oDocumentUS) {
				return;
			}

			iDocumentItemsCount = oDocumentUS.getIncompleteItems().length;
			sServiceUrl = this.getUploadUrl();

			oDocumentUS.getIncompleteItems().forEach(oItem => {
				oItem.setUploadUrl(sServiceUrl);
			});

			if (iDocumentItemsCount > 0) {
				await oDocumentUS.upload();
			}
		},

		viewMatched: function () {
			this.getOwnerComponent().getModel().metadataLoaded().then(async () => {
				await this.getDocuments();
			});
		}

	});

});