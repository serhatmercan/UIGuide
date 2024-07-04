sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (BaseController, MessageBox, JSONModel) {
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
			}), "model");
		},

		onACDocumentDialog: function () {
			this.oDocumentDialog.close();
			this.oDocumentDialog.destroy();
			this.oDocumentDialog = null;
			this.oAttach = null;
		},

		onSaveDocument: function () {
			MessageBox.confirm(this.getResourceBundle().getText("infoDMS"), {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				emphasizedAction: MessageBox.Action.OK,
				styleClass: this.getOwnerComponent().getContentDensityClass(),
				onClose: (sAction) => {
					if (sAction === MessageBox.Action.OK) {
						this.oAttach.save(true);
						this.onACDocumentDialog();
					}
				}
			});
		},

		onShowDocument: function (sType) {
			const oDocument = this.getModel("model").getProperty("/Document");
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
				this.oAttach = oAttachmentComponent;
				this.byId("attachmentComponentContainer").setComponent(oAttachmentComponent);
				var aAttributes = oAttachmentComponent.getAttributes();
				aAttributes._VisibleActions.ADDURL = false;
				oAttachmentComponent.setAttributes(aAttributes);
			}.bind(this));

			this.oDocumentDialog = sap.ui.xmlfragment(this.getView().getId(), "com.serhatmercan.Document", this);
			this.getView().addDependent(this.oDocumentDialog);
			this.oDocumentDialog.setTitle(oResourceBundle.getText(sTitle));
			this.oDocumentDialog.open();
		}

	});

});