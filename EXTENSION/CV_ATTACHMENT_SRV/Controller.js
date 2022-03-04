sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"serhatmercan/Util"
], function (BaseController, MessageBox, JSONModel, Util) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		onInit: function () {
			this.getView().setModel(new JSONModel({
				Document: {
					FunctionalLocation: "",
					EquipmentNo: "",
					NotificationNo: "",
					OrderNo: ""
				}
			}), "viewModel");
		},

		onACDocumentDialog: function () {
			this._oDocumentDialog.close();
			this._oDocumentDialog.destroy();
			this._oDocumentDialog = null;
			this._oAttach = null;
		},

		onSaveDocument: function () {
			MessageBox.confirm(this.getResourceBundle().getText("infoDMS"), {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				styleClass: this.getOwnerComponent().getContentDensityClass(),
				onClose: (sAction) => {
					if (sAction === MessageBox.Action.OK) {
						this._oAttach.save(true);
						this.onACDocumentDialog();
					}
				}
			});
		},

		onShowDocument: function (sType) {
			const oDocument = this.getModel("viewModel").getProperty("/Document");
			const oResourceBundle = this.getResourceBundle();
			let sObjectKey = "";
			let sObjectType = "";
			let sTitle = "";

			if (!oDocument) {
				MessageToast.show(oResourceBundle.getText("infoChooseRow"));
				return;
			}

			switch (sType) {
			case "E":
				sObjectKey = oDocument.EquipmentNo;
				sObjectType = "EQUI";
				sTitle = "equipmentDMS";
				break;
			case "F":
				sObjectKey = oDocument.FunctionalLocation;
				sObjectType = "IFLOT";
				sTitle = "functLocDMS";
				break;
			case "N":
				sObjectKey = oDocument.NotificationNo;
				sObjectType = "PMQMEL";
				sTitle = "notificationDMS";
				break;
			case "O":
				sObjectKey = oDocument.OrderNo;
				sObjectType = "PMAUFK";
				sTitle = "orderDMS";
				break;
			}

			if (!sObjectKey || sObjectKey === "") {
				MessageToast.show(oResourceBundle.getText("errorDMSProcess"));
				return;
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();

			this.getOwnerComponent().createComponent({
				usage: "attachmentReuseComponent",
				settings: {
					mode: "C",
					documentType: "YP1",
					objectKey: sObjectKey,
					objectType: sObjectType
				}
			}).then(function (oAttachmentComponent) {
				this._oAttach = oAttachmentComponent;
				this.byId("attachmentComponentContainer").setComponent(oAttachmentComponent);
				var aAttributes = oAttachmentComponent.getAttributes();
				aAttributes._VisibleActions.ADDURL = false;
				oAttachmentComponent.setAttributes(aAttributes);
			}.bind(this));

			this._oDocumentDialog = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.Document", this);
			this.getView().addDependent(this._oDocumentDialog);
			this._oDocumentDialog.setTitle(oResourceBundle.getText(sTitle));
			this._oDocumentDialog.open();
		}

	});

});