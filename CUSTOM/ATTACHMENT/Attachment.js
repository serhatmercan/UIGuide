sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter"
], function (BaseController, JSONModel, MessageToast, UploadCollectionParameter) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onPDFDownload: function (oEvent) {

			var oTable = this.getView().byId("idTable"),
				oPerson = oTable.getSelectedItem();

			if (!oPerson) {
				MessageToast.show(this.getResourceBundle().getText("chooseRow"));
				return;
			}

			var id = oPerson.getBindingContext().getObject("Id"),
				sUrl = this.getModel().sServiceUrl + "/PDFSet('" + id + "')/$value";

			window.open(sUrl, "_blank");

		},

		onExcelDownload: function (oEvent) {

			var oTable = this.byId("idTable"),
				sUrl = oTable.getBinding("items").getDownloadUrl(),
				aItems = oTable.getItems(),
				aCells = aItems[0].getCells(),
				sFields = "",
				sUrlParameters = "&$format=xlsx&$select=";

			for (var i in aCells) {
				if (sFields) {
					sFields += ",";
				}
				sFields += this.getPaths(aCells[i]);
			}

			window.open(sUrl + sUrlParameters + sFields, "_blank");

		},

		getPaths: function (oTemplate) {
			var aFieldTag = ["text", "title", "number", "unit", "state"],
				sFields = "";

			function concatParts(aPart) {
				for (var j in aPart) {
					if (sFields) {
						sFields += ",";
					}
					sFields += aPart[j].path;
				}
			}

			for (var i in aFieldTag) {
				if (oTemplate.getBindingInfo(aFieldTag[i])) {
					concatParts(oTemplate.getBindingInfo(aFieldTag[i]).parts);
				}
			}
			return sFields;
		},

		onUploadAttachment: function (oEvent) {

			var oTable = this.getView().byId("table"),
				oPerson = oTable.getSelectedItem();

			if (!oPerson) {
				MessageToast.show(this.getResourceBundle().getText("chooseRow"));
				return;
			}

			if (!this._oUploadAttachment) {
				this._oUploadAttachment = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.UploadAttachment", this);
				this._oUploadAttachment._oUploadCollection = this.byId("idUploadCollection");
				this.getView().addDependent(this._oUploadAttachment);
			}

			this._oUploadAttachment.open();

		},

		onCancelUpload: function () {
			this._oUploadAttachment.close();
		},

		onAfterCloseUpload: function () {
			this._oUploadAttachment.destroy();
			this._oUploadAttachment = null;
		},

		onChangeUpload: function (oEvent) {

			var sToken = this.getModel().getSecurityToken(),
				oTable = this.getView().byId("table"),
				oPerson = oTable.getSelectedItem(),
				sId = oPerson.getBindingContext().getObject("Id");

			oEvent.getSource().addHeaderParameter(new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			}));

			oEvent.getSource().addHeaderParameter(new sap.m.UploadCollectionParameter({
				name: "Id",
				value: sId
			}));

		},

		onUpload: function (oEvent) {

			var aItems = this._oUploadAttachment._oUploadCollection.getItems();

			if (aItems.length === 0) {
				MessageToast.show(this.getResourceBundle().getText("AddFile"));
				return;
			}

			this._oUploadAttachment._oUploadCollection._iFileLength = aItems.length;
			this._oUploadAttachment._oUploadCollection.upload();

		},

		onBeforeUploadStarts: function (oEvent) {

			var fnAddHeaderParameter = oEvent.getParameter("addHeaderParameter");

			fnAddHeaderParameter(new sap.m.UploadCollectionParameter({
				name: "Filename",
				value: encodeURIComponent(oEvent.getParameter("fileName"))
			}));

		},

		onDownloadAttachment: function (oEvent) {

			var oTable = this.getView().byId("table"),
				oPerson = oTable.getSelectedItem(),
				sId = oPerson.getBindingContext().getObject("Id");

			if (!oPerson) {
				MessageToast.show(this.getResourceBundle().getText("chooseRow"));
				return;
			}

			if (!this._oDownloadAttachment) {
				this._oDownloadAttachment = sap.ui.xmlfragment(this.getView().getId(), "com.sm.attachment.fragment.DownloadAttachment", this);

				this._oDownloadAttachment.attachBeforeOpen(function (oEvent) {
					var oCollection = this.byId("idDownloadCollection"),
						aFilters = [];
					aFilters.push(new Filter("Id", FilterOperator.EQ, sId));
					oCollection.getBinding("items").filter(aFilters);
				}.bind(this));

				this.getView().addDependent(this._oDownloadAttachment);
			}

			this._oDownloadAttachment.open();

		},

		onCancelDownload: function () {
			this._oDownloadAttachment.close();
		},

		onAfterCloseDownload: function () {
			this._oDownloadAttachment.destroy();
			this._oDownloadAttachment = null;
		},

		onDownload: function (oEvent) {

			var oDownloadCollection = this.byId("idDownloadCollection"),
				oItem = oDownloadCollection.getSelectedItem();

			if (!oItem) {
				MessageToast.show(this.getResourceBundle().getText("ChooseFile"));
				return;
			}

			var oObject = oItem.getBindingContext().getObject(),
				sUrl = this.getModel().sServiceUrl + this.getModel().createKey("/DownloadAttachmentSet", {
					Id: oObject.Id,
					Guid: oObject.Guid
				}) + "/$value";

			window.open(sUrl, "_blank");

		},

		onFileDeletedDownload: function (oEvent) {

			var oItem = oEvent.getParameter("item").getBindingContext().getObject();

			if (!oItem) {
				MessageToast.show(this.getResourceBundle().getText("ChooseFile"));
				return;
			}

			var oParams = {};

			oParams.error = function (oError) {

			}.bind(this);

			oParams.success = function (oSuccess) {

			}.bind(this);

			var obj = this.getModel().createKey("AttachmentsSet", {
				Id: oItem.Id,
				Guid: oItem.Guid
			});

			this.getView().getModel().remove("/" + obj, oParams);

		},

		onUploadDownload: function (oEvent) {

			var oTable = this.getView().byId("table"),
				oPerson = oTable.getSelectedItem();

			if (!oPerson) {
				MessageToast.show(this.getResourceBundle().getText("chooseRow"));
				return;
			}

			if (!this._oUploadDownload) {

				this._oUploadDownload = sap.ui.xmlfragment(this.getView().getId(), "com.sm.attachment.fragment.UploadDownload", this);

				this._oUploadDownload.attachBeforeOpen(function () {

					var oCollection = this.byId("UploadDownloadCollection"),
						sId = oPerson.getBindingContext().getObject("Id"),
						aFilters = [];

					aFilters.push(new Filter("Id", FilterOperator.EQ, sId));
					oCollection.getBinding("items").filter(aFilters);

				}.bind(this));

				this.getView().addDependent(this._oUploadDownload);
			}

			this._oUploadDownload.open();

		},

		onSelectionChange: function () {

			var oUploadDownloadCollection = this.byId("UploadDownloadCollection");

			if (oUploadDownloadCollection.getSelectedItems().length > 0) {
				this.byId("ButtonDownload").setEnabled(true);
			} else {
				this.byId("ButtonDownload").setEnabled(false);
			}
		},

		onAfterCloseUploadDownload: function () {
			this._oUploadDownload.destroy();
			this._oUploadDownload = null;
		},

		onCancelUploadDownload: function () {
			this._oUploadDownload.close();
		},

		onCUD: function (oEvent) {

		},
		// Before Update Starts
		onBUS: function (oEvent) {

			var sToken = this.getModel().getSecurityToken(),
				sFilename = oEvent.getParameter("fileName"),
				oTable = this.getView().byId("table"),
				oPerson = oTable.getSelectedItem(),
				sId = oPerson.getBindingContext().getObject("Id");

			oEvent.getParameters().addHeaderParameter(new UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			}));

			oEvent.getParameters().addHeaderParameter(new UploadCollectionParameter({
				name: "filename",
				value: sFilename
			}));

			oEvent.getParameters().addHeaderParameter(new UploadCollectionParameter({
				name: "Id",
				value: sId
			}));

		},
		// Update Complete
		onUC: function (oEvent) {
			this.getView().byId("UploadDownloadCollection").getBinding("items").refresh(true);
		},
		// File Deleted
		onFD: function (oEvent) {

			var oItem = oEvent.getParameter("item").getBindingContext().getObject();

			if (!oItem) {
				MessageToast.show(this.getResourceBundle().getText("ChooseFile"));
				return;
			}

			var oParams = {};

			oParams.error = function (oError) {

			}.bind(this);

			oParams.success = function (oSuccess) {

			}.bind(this);

			var obj = this.getModel().createKey("AttachmentsSet", {
				Id: oItem.Id,
				Guid: oItem.Guid
			});

			this.getView().getModel().remove("/" + obj, oParams);

		},
		// Download
		onDownloadItem: function () {

			var oUploadCollection = this.byId("UploadDownloadCollection"),
				aSelectedItems = oUploadCollection.getSelectedItems();

			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					// oUploadCollection.downloadItem(aSelectedItems[i], true);
					var oObject = aSelectedItems[i].getBindingContext().getObject(),
						sUrl = this.getModel().sServiceUrl + this.getModel().createKey("/DownloadAttachmentSet", {
							Id: oObject.Id,
							Guid: oObject.Guid
						}) + "/$value";

					window.open(sUrl, "_blank");
				}
			} else {
				MessageToast.show(this.getResourceBundle().getText("ChooseFile"));
			}

		}

	});

});