sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/m/UploadCollectionParameter",
	"sap/m/PDFViewer"
], function (BaseController, Filter, FilterOperator, JSONModel, UploadCollectionParameter, PDFViewer) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			this.setModel(new JSONModel({
				DocumentUrl: "",
				Documents: [],
				Value: "",
			}), "model");

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

		onACFrame: function () {
			this.oFrame.close();
			this.oFrame.destroy();
			this.oFrame = null;
		},

		onBUSDocument: function (oEvent) {
			oEvent.getParameter("addHeaderParameter")(
				new UploadCollectionParameter({
					name: "slug",
					value: encodeURIComponent(oEvent.getParameter("fileName")) + "&&" + "X"
				}));

			oEvent.getParameter("addHeaderParameter")(
				new UploadCollectionParameter({
					name: "X-Requested-With",
					value: "XMLHttpRequest"
				}));
		},

		onCloseDocument: function () {
			this.oDocument.close();
		},

		onCUDocument: function (oEvent) {
			if (this.getModel("model").getProperty("/Value") !== "") {
				sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC").fireFileDeleted(oEvent);
				this.uploadDocument();
			}

			this.onCloseDocument();
		},

		onDownloadItem: function () {
			const oModel = this.getModel();

			this.byId("DocumentUC").getSelectedItems(oItem => {
				window.open(
					oModel.sServiceUrl +
					oModel.createKey("/DocumentSet", { DocumentID: oItem.getBindingContext().getObject("DocumentID") }) + "/$value",
					"_blank");
			});
		},

		onFDDocument: function (oEvent) {
			const aOriginDocuments = oEvent.getSource().getBinding("items").getCurrentContexts();
			const aNewDocuments = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC").getItems();
			let aOriginDocumentID = [];
			let aNewDocumentID = [];
			let aDocumentsIDs = [];

			aOriginDocumentID = aOriginDocuments.map(oOriginDocument => {
				return {
					DocumentID: oOriginDocument.getObject("DocumentID")
				};
			});

			aNewDocumentID = aNewDocuments.map(oNewDocument => {
				return {
					DocumentID: oNewDocument.getBindingContext().getProperty("DocumentID"),
					DocumentID: oNewDocument.getDocumentId()
				};
			});

			aOriginDocumentID.forEach((oOriginDocumentID) => {
				if (aNewDocumentID.findIndex(oNewDocumentID => oNewDocumentID.DocumentID === oOriginDocumentID.DocumentID) === -1) {
					aDocumentsIDs.push(oOriginDocumentID.DocumentID);
				}
			});

			this.deleteDocuments(aDocumentsIDs);
		},

		onFDSingleDocument: function () {
			const oModel = this.getModel();
			const oDocumentKey = oModel.createKey("/DocumentSet", {
				DocumentID: "X"
			});

			this.onDelete(oDocumentKey, oModel)
				.then(() => {
					this.getModel("model").setProperty("/Documents", []);
				})
				.catch(() => { })
				.finally(() => { });
		},

		onPressUCI: function (oEvent) {
			const oContext = this.getView().getBindingContext();
			const oModel = this.getModel();
			const sServiceURL = oModel.sServiceUrl;
			const sBindingPath = oEvent.getSource().getBindingContext().getPath();
			const sPath = oModel.createKey("/DocumentSet", {
				DocumentID: oModel.getProperty(sBindingPath + "/DocumentID")
			});
			const sDocumentPath = sServiceURL + sPath + "/$value";

			window.open(sDocumentPath, "_blank");
		},

		onSCDocument: function () {
			this.byId("DownloadButton").setEnabled(this.byId("DocumentUC").getSelectedItems().length > 0);
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

			this.oFrame = new Dialog({
				title: sFileName,
				afterClose: this.onACFrame.bind(this),
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
						this.onACFrame();
					}.bind(this)
				})
			});

			this.oFrame.open();
		},

		onShowDocument: function (oEvent) {
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const sBindingPath = oEvent.getSource().getBindingContext("model").getPath();
			const sServiceURL = oModel.sServiceUrl;
			const sViewPath = this.getView().getBindingContext().getPath();
			const sPath = oModel.createKey("/...Set", {
				Doknr: oViewModel.getProperty(sBindingPath + "/Doknr"),
				Matnr: oModel.getProperty(sViewPath + "/Matnr")
			});
			const sDocumentPath = sServiceURL + sPath + "/$value";

			window.open(sDocumentPath, "_blank");
		},

		onShowDocument: function () {
			if (!this.oDocument) {
				this.oDocument = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.Document", this);
				this.getFiles();
			}

			this.oDocument.attachBeforeOpen(function (oEvent) {
				this.byId("DocumentUC").getBinding("items").filter([new Filter("X", FilterOperator.EQ, "X")]);
			}.bind(this));

			this.byId("DocumentUC").setUploadButtonInvisible(false);

			this.oDocument.open();
		},

		onUCDocument: function (oEvent) {
			const oUploadCollection = oEvent.getSource();
			const oModel = this.getModel();

			oModel.refreshSecurityToken();

			this.addParameter(oUploadCollection, "x-csrf-token", oModel.getHeaders()["x-csrf-token"]);
			this.addParameter(oUploadCollection, "ID", "X");
		},

		onUpdCmpDocument: function () {
			this.getDocument();
		},

		onPrintout: function () {
			const aContexts = this.byId("Table").getTable().getSelectedContexts();
			let sID = "";

			if (aContexts.length === 0) {
				MessageToast.show(this.getResourceBundle().getText("infoChooseRow"));
				return;
			}

			sID = aContexts.map(oContext => this.getModel().getProperty(oContext.getPath() + "/ID")).join("-");

			this.openPdfViewer(sID);
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		addParameter: function (oCollection, sName, sValue) {
			oCollection.addHeaderParameter(new UploadCollectionParameter({
				name: sName,
				value: sValue
			}));
		},

		deleteDocuments: function (aData) {
			let oData = {};

			oData.ID = "Documents";
			oData.Documents = [];

			aData.forEach((sDocumentID) => {
				oData.Documents.push({
					DocumentID: sDocumentID
				});
			});

			this.onCreate("/DeepIDSet", oData, this.getModel())
				.then((oData) => {
					this.uploadDocument();
				})
				.catch(() => { })
				.finally(() => { });
		},

		getDocument: function () {
			const oModel = this.getModel();
			const sID = oModel.getProperty(this.getView().getBindingContext().getPath() + "/ID");
			const oKey = oModel.createKey("/DocumentSet", {
				ID: "X"
			});

			this._getSingleData(oKey, oModel)
				.then((oData) => {
					this.getModel("viewModel").setProperty("/Documents", oData.DocNumber !== "" ? [oData] : []);
				})
				.catch(() => { })
				.finally(() => { });
		},

		getFiles: function () {
			const aFilters = [];
			const aItems = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC").getBinding("items");
			const sValue = this.getModel("model").getProperty("/Value");

			aFilters.push(new Filter("X", FilterOperator.EQ, sValue));

			aItems.filter(aFilters);
		},

		getUploadUrl: function () {
			const sValue = this.getModel("model").getProperty("/Value");
			const sPath = this.getModel().createKey("/MainEntitySet", {
				ID: sValue
			});
			let sDocumentPath = "";

			sDocumentPath = this.getModel().sServiceUrl + sPath + "/Documents";

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

			oPDFViewer.setSource(sDocumentPath);
			oPDFViewer.setTitle(this.getResourceBundle().getText("preview"));
			oPDFViewer.open();
		},

		uploadDocument: function () {
			const oUploadCollection = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC");

			if (oUploadCollection && oUploadCollection._aFileUploadersForPendingUpload.length > 0) {
				this.updateUploadUrl();
				oUploadCollection.upload();
			}
		},

		updateUploadUrl: function () {
			const oUploadCollection = sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC");
			const sServiceUrl = this.getUploadUrl();

			oUploadCollection._aFileUploadersForPendingUpload.forEach(oPendingUploads => {
				oPendingUploads.setUploadUrl(sServiceUrl);
			});
		},

		viewMatched: function () {
			if (sap.ui.core.Fragment.byId(this.getView().getId(), "DocumentUC")) {
				this.oDocument.destroy();
				this.oDocument = null;
			}
		}

	});

});