sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
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

			this._oDocument.open();
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

			for (let i = 0; i < aOriginGuid.length; i++) {
				if (aNewGuid.findIndex(x => x.Guid === aOriginGuid[i].Guid) === -1) {
					aGuid.push(aOriginGuid[i].Guid);
				}
			}

			this._deleteDocuments(aGuid);
		},

		onCUDocument: function (oEvent) {
			if (this.getModel("model").getProperty("/Value") !== "") {
				sap.ui.core.Fragment.byId(this.getView().getId(), "idDocumentUC").fireFileDeleted(oEvent);
			}

			this.onCloseDocument();
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

			for (let i = 0; i < aData.length; i++) {
				oData.Documents.push({
					Guid: aData[i]
				});
			}

			oViewModel.setProperty("/Busy", true);

			let fnSuccess = function () {
				this._uploadDocument();
			}.bind(this);

			let fnReject = function () {};

			let fnFinally = function () {
				oViewModel.setProperty("/Busy", false);
			};

			this._sendMultiData("/DeepIDSet", oData, this.getModel())
				.then(fnSuccess)
				.catch(fnReject)
				.finally(fnFinally);
		},

	});

});