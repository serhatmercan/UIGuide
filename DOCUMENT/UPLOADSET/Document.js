sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/PDFViewer",
	"sap/ui/core/Item",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageToast, PDFViewer, Item, Filter, FilterOperator, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(
				new JSONModel({
					DeletedDocuments: [],
					DocumentUrl: "",
					Documents: []
				}), "model"
			);

			this.getRouter().getRoute("Document").attachPatternMatched(this.viewMatched, this);
		},

		onExit() {
			if (this.oDocument) {
				this.oDocument.destroy();
				this.oDocument = null;
			}
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onAIR(oEvent) { },

		onBUSDocument(oEvent) {
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

		onCloseDocument() {
			this.oDocument.close();
		},

		onPrintout() {
			const aContexts = this.byId("Table").getTable().getSelectedContexts();

			if (aContexts.length === 0) {
				MessageToast.show(this.getText("infoChooseRow"));
				return;
			}

			const sID = aContexts.map(oContext => this.getModel().getProperty(`${oContext.getPath()}/ID`)).join("-");

			this.openPdfViewer(sID);
		},

		async onSendDocuments() {
			const oDocumentUS = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUS");
			const oViewModel = this.getModel("model");
			const aDeletedDocuments = oViewModel.getProperty("/DeletedDocuments");

			if (oDocumentUS) {
				this.addDeletedDocuments();
			}

			const oData = { Documents: aDeletedDocuments.length ? aDeletedDocuments : [] };

			await this.uploadDocument();

			if (oDocumentUS) {
				this.oDocument.destroy();
				this.oDocument = null;
				oViewModel.setProperty("/Documents", []);
			}
		},

		onShowDocument() {
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

		addDeletedDocuments() {
			const oDocumentUS = this.byId("DocumentUS");
			const oViewModel = this.getModel("model");
			const aDeletedDocuments = oViewModel.getProperty("/DeletedDocuments");
			const aOriginDocuments = oDocumentUS.getBinding("items").getCurrentContexts();
			const aNewDocuments = oDocumentUS.getItems();
			const sID = oViewModel.getProperty("/ID");
			const aOriginDocumentIDs = aOriginDocuments.map(oOriginDocument => ({
				DocumentID: oOriginDocument.getObject("DocumentID")
			}));
			const aNewDocumentIDs = aNewDocuments.map(oNewDocument => ({
				DocumentID: oViewModel.getProperty(`${oNewDocument.getBindingContext("model").getPath()}/DocumentID`)
			}));
			aOriginDocumentIDs.forEach(({ DocumentID }) => {
				if (!aNewDocumentIDs.some(oNewDocumentID => oNewDocumentID.DocumentID === DocumentID)) {
					aDeletedDocuments.push({ ID: sID, DocumentID });
				}
			});

			oViewModel.setProperty("/DeletedDocuments", aDeletedDocuments);
		},

		async getDocuments() {
			const oViewModel = this.getModel("model");
			const aFilters = [new Filter("ID", FilterOperator.EQ, oViewModel.getProperty("/ID"))];

			try {
				const oData = await this.onReadQuery("/DocumentSet", aFilters, this.getModel());
				oViewModel.setProperty("/Documents", oData.results);
			} catch (oError) {
				// Handle Error
			} finally {
				// Handle Finally
			}
		},

		getUploadUrl() {
			const oModel = this.getModel();
			const sID = this.getModel("model").getProperty("/ID");
			const sPath = oModel.createKey("/...Set", { ID: sID });
			const sServiceURL = oModel.sServiceUrl;

			return `${sServiceURL}${sPath}/Documents`;
		},

		openPdfViewer(sID) {
			const oModel = this.getModel();
			const oPDFViewer = new PDFViewer();
			const sServiceURL = oModel.sServiceUrl;
			const sPath = oModel.createKey("/...Set", { ID: sID });
			const sDocumentPath = `${sServiceURL}${sPath}/$value`;

			oPDFViewer.attachEventOnce("sourceValidationFailed", oEvent => { oEvent.preventDefault(); });
			oPDFViewer.setShowDownloadButton(false);
			oPDFViewer.setSource(sDocumentPath);
			oPDFViewer.setTitle(this.getText("preview"));
			oPDFViewer.open();
		},

		async uploadDocument() {
			const oDocumentUS = this.byId("DocumentUS");

			if (!oDocumentUS) {
				return;
			}

			const iDocumentItemsCount = oDocumentUS.getIncompleteItems().length;
			const sServiceUrl = this.getUploadUrl();

			oDocumentUS.getIncompleteItems().forEach(oItem => {
				oItem.setUploadUrl(sServiceUrl);
			});

			if (iDocumentItemsCount) {
				await oDocumentUS.upload();
			}
		},

		async viewMatched() {
			try {
				await this.getOwnerComponent().getModel().metadataLoaded();
				await this.getDocuments();
			} catch (oError) {
				// Handle Error
			} finally {
				// Handle Finally
			}
		}

	});
});
