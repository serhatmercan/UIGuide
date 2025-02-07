sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/core/HTML",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/PDFViewer"
], (BaseController, Filter, FilterOperator, JSONModel, MessageToast, Button, Dialog, UploadCollectionParameter, PDFViewer) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			this.setModel(new JSONModel({
				DocumentUrl: "",
				Documents: [],
				Value: ""
			}), "model");

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

		onACFrame() {
			if (this.oFrame) {
				this.oFrame.close();
				this.oFrame.destroy();
				this.oFrame = null;
			}
		},

		onBUSDocument(oEvent) {
			const { addHeaderParameter: oAddHeaderParameter, fileName: sFileName } = oEvent.getParameter();

			oAddHeaderParameter(new UploadCollectionParameter({
				name: "slug",
				value: `${encodeURIComponent(sFileName)}&&X`
			}));

			oAddHeaderParameter(new UploadCollectionParameter({
				name: "X-Requested-With",
				value: "XMLHttpRequest"
			}));
		},

		onCloseDocument() {
			this.oDocument.close();
		},

		onCUDocument(oEvent) {
			const oViewModel = this.getModel("model");

			if (oViewModel.getProperty("/Value") !== "") {
				sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC").fireFileDeleted(oEvent);
				this.uploadDocument();
			}

			this.onCloseDocument();
		},

		onDownloadItem() {
			const oViewModel = this.getModel();

			this.byId("DocumentUC").getSelectedItems().forEach(oItem => {
				const sDocumentID = oItem.getBindingContext().getObject("DocumentID");
				window.open(`${oViewModel.sServiceUrl}${oViewModel.createKey("/DocumentSet", { DocumentID: sDocumentID })}/$value`, "_blank");
			});
		},

		onFDDocument(oEvent) {
			const oDocumentUC = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC");
			const aOriginDocuments = oDocumentUC.getBinding("items").getCurrentContexts();
			const aNewDocuments = oDocumentUC.getItems();
			const aOriginDocumentIDs = aOriginDocuments.map(({ getObject }) => ({ DocumentID: getObject("DocumentID") }));
			const aNewDocumentIDs = aNewDocuments.map(({ getBindingContext, getDocumentId }) => ({
				DocumentID: getBindingContext().getProperty("DocumentID"),
				DocumentId: getDocumentId()
			}));
			const aDeletedDocumentIDs = aOriginDocumentIDs.filter(({ DocumentID }) =>
				!aNewDocumentIDs.some(oNewDoc => oNewDoc.DocumentID === DocumentID)
			).map(oDeletedDocumentID => oDeletedDocumentID.DocumentID);

			this.deleteDocuments(aDeletedDocumentIDs);
			this.getModel("model").setProperty("/DeletedDocuments", aDeletedDocumentIDs);
		},

		onFDSingleDocument() {
			const oModel = this.getModel();
			const sDocumentKey = oModel.createKey("/DocumentSet", { DocumentID: "X" });

			this.onDelete(sDocumentKey, oModel)
				.then(() => {
					this.getModel("model").setProperty("/Documents", []);
				})
				.catch(() => { })
				.finally(() => { });
		},

		onPressUCI(oEvent) {
			const oModel = this.getModel();
			const sServiceURL = oModel.sServiceUrl;
			const sBindingPath = oEvent.getSource().getBindingContext().getPath();
			const sDocumentID = oModel.getProperty(`${sBindingPath}/DocumentID`);
			const sDocumentPath = `${sServiceURL}${oModel.createKey("/DocumentSet", { sDocumentID })}/$value`;

			window.open(sDocumentPath, "_blank");
		},

		onSCDocument() {
			const aSelectedItems = this.byId("DocumentUC").getSelectedItems();
			this.byId("DownloadButton").setEnabled(aSelectedItems.length > 0);
		},

		async onSendDocuments() {
			const oUploadCollection = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC");
			const oViewModel = this.getModel("model");
			const aDeletedDocuments = oViewModel.getProperty("/DeletedDocuments");

			if (oUploadCollection) {
				await oUploadCollection.fireFileDeleted();
			}

			const aData = { Documents: aDeletedDocuments.length ? aDeletedDocuments : [] };

			await this.uploadDocument();

			if (oUploadCollection) {
				this.oDocument.destroy();
				this.oDocument = null;
				oViewModel.setProperty("/Documents", []);
			}
		},

		onShowIFrame(oEvent) {
			const oModel = this.getModel();
			const sServiceURL = oModel.sServiceUrl;
			const sBindingPath = oEvent.getSource().getBindingContext().getPath();
			const sFileName = oModel.getProperty(`${sBindingPath}/Filename`);
			const sDocumentID = oModel.getProperty(`${sBindingPath}/DocumentID`);
			const sDocumentPath = `${sServiceURL}${oModel.createKey("/DocumentSet", { sDocumentID })}/$value`;
			const sLoadEvent = "sap.ui.getCore().getEventBus().publish('com.sm.serhatmercan', 'PDFLoaded')";
			const sSource = `<iframe name='PDF' src='${jQuery.sap.encodeHTML(sDocumentPath)}' onLoad='${jQuery.sap.encodeHTML(sLoadEvent)}' height='100%' width='100%'/>`;

			this.oFrame = new Dialog({
				title: sFileName,
				afterClose: this.onACFrame.bind(this),
				content: [new HTML({ content: sSource })],
				contentHeight: "250rem",
				contentWidth: "250rem",
				horizontalScrolling: false,
				stretch: true,
				verticalScrolling: false,
				endButton: new Button({
					text: this.getText("close"),
					press: this.onACFrame.bind(this)
				})
			});

			this.oFrame.open();
		},

		onShowDocument(oEvent) {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const sBindingPath = oEvent.getSource().getBindingContext("model").getPath();
			const sServiceURL = oModel.sServiceUrl;
			const sViewPath = this.getView().getBindingContext().getPath();
			const sPath = oModel.createKey("/...Set", {
				Doknr: oViewModel.getProperty(sBindingPath + "/Doknr"),
				Matnr: oModel.getProperty(sViewPath + "/Matnr")
			});
			const sDocumentPath = `${sServiceURL}${sPath}/$value`;

			window.open(sDocumentPath, "_blank");
		},

		async onShowDocument() {
			if (!this.oDocument) {
				this.oDocument = await this.loadFragment({
					name: "com.serhatmercan.Document",
					controller: this
				});
				await this.getFiles();
			}

			this.oDocument.attachBeforeOpen(() => {
				this.byId("DocumentUC").getBinding("items").filter([new Filter("X", FilterOperator.EQ, "X")]);
			});

			this.byId("DocumentUC").setUploadButtonInvisible(false);
			this.oDocument.open();
		},

		onUCDocument(oEvent) {
			const oUploadCollection = oEvent.getSource();
			const oModel = this.getModel();

			oModel.refreshSecurityToken();

			this.addParameter(oUploadCollection, "x-csrf-token", oModel.getHeaders()["x-csrf-token"]);
			this.addParameter(oUploadCollection, "ID", "X");
		},

		onUpdCmpDocument() {
			this.getDocument();
		},

		onPrintout() {
			const aSelectedContexts = this.byId("Table").getTable().getSelectedContexts();
			const oModel = this.getModel();

			if (!aSelectedContexts.length) {
				MessageToast.show(this.getText("infoChooseRow"));
				return;
			}

			const sID = aSelectedContexts.map(oContext => oModel.getProperty(`${oContext.getPath()}/ID`)).join("-");

			this.openPdfViewer(sID);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addParameter(oCollection, sName, sValue) {
			oCollection.addHeaderParameter(new UploadCollectionParameter({
				name: sName,
				value: sValue
			}));
		},

		deleteDocuments(aDocumentIDs) {
			const oDocument = {
				ID: "Documents",
				Documents: aDocumentIDs.map(DocumentID => ({ DocumentID }))
			};

			this.onCreate("/DeepIDSet", oDocument, this.getModel())
				.then(() => this.uploadDocument())
				.catch(() => { })
				.finally(() => { });
		},

		getDocument() {
			const oModel = this.getModel();
			const sID = oModel.getProperty(`${this.getView().getBindingContext().getPath()}/ID`);
			const oKey = oModel.createKey("/DocumentSet", { ID: "X" });

			this._getSingleData(oKey, oModel)
				.then((oData) => {
					this.getModel("viewModel").setProperty("/Documents", oData.DocNumber !== "" ? [oData] : []);
				})
				.catch(() => { })
				.finally(() => { });
		},

		getFiles() {
			const aFilters = [];
			const aItems = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC").getBinding("items");
			const sValue = this.getModel("model").getProperty("/Value");

			aFilters.push(new Filter("X", FilterOperator.EQ, sValue));

			aItems.filter(aFilters);
		},

		getUploadUrl() {
			const oModel = this.getModel();
			const sValue = this.getModel("model").getProperty("/Value");
			const sPath = oModel.createKey("/MainEntitySet", { ID: sValue });

			return `${oModel.sServiceUrl}${sPath}/Documents`;
		},

		openPdfViewer(sID) {
			const oModel = this.getModel();
			const oPDFViewer = new PDFViewer();
			const sServiceURL = oModel.sServiceUrl;
			const sDocumentPath = `${sServiceURL}${oModel.createKey("/...Set", { ID: sID })}/$value`;

			oPDFViewer.setSource(sDocumentPath);
			oPDFViewer.setTitle(this.getText("preview"));
			oPDFViewer.open();
		},

		uploadDocument() {
			const oUploadCollection = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC");

			if (oUploadCollection && oUploadCollection._aFileUploadersForPendingUpload.length) {
				this.updateUploadUrl();
				oUploadCollection.upload();
			}
		},

		updateUploadUrl() {
			const oUploadCollection = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC");
			const sServiceUrl = this.getUploadUrl();

			oUploadCollection._aFileUploadersForPendingUpload.forEach(oPendingUploads => {
				oPendingUploads.setUploadUrl(sServiceUrl);
			});
		},

		viewMatched() {
			if (this.oDocument) {
				this.oDocument.destroy();
				this.oDocument = null;
			}
		}

	});
});