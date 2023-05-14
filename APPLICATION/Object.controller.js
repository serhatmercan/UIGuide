sap.ui.define([
    "./BaseController",
    "xxx/formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, formatter, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("xxx.controller.Object", {

        formatter: formatter,

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit: function () {
            this.getRouter().getRoute("Object").attachPatternMatched(this.patternMatched, this);
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onACInformationItemDialog: function () {
            this.oInformationItemDialog.close();
            this.oInformationItemDialog.destroy();
            this.oInformationItemDialog = null;
        },

        onAddInformationItem: function () {
            const oInformationItemSF = this.byId("InformationItemSF");
            const oInformationItem = oInformationItemSF.getBindingContext().getProperty();
            const oResourceBundle = this.getResourceBundle();
            const oViewModel = this.getModel("model");
            const aInformationItems = oViewModel.getProperty("/InformationItems");

            if (oInformationItemSF.check().length) {
                MessageToast.show(oResourceBundle.getText("checkMandatoryFields"));
                return;
            }

            aInformationItems.push(oInformationItem);
        },

        onDeleteInformationItem: function (oEvent) {
            const sPath = oEvent.getSource().getBindingContext("model").getPath();
            const iIndex = +sPath.split("/")[sPath.split("/").length - 1];
            const oViewModel = this.getModel("model");
            const aInformationItems = oViewModel.getProperty("/InformationItems");

            MessageBox.confirm(this.getText("checkInformationItem"), {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                styleClass: this.getOwnerComponent().getContentDensityClass(),
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        aInformationItems.splice(iIndex, 1);
                        oViewModel.setProperty("/InformationItems", aInformationItems);
                    }
                }
            });
        },

        onProcess: function (sType, oEvent) {
            const oData = this.getModel().getProperty(this.getView().getBindingContext().getPath());

            if (this.byId("InformationSF").check().length) {
                MessageToast.show(this.getText("checkMandatoryFields"));
                return;
            }

            delete oData.__metadata;
            delete oData.Items;
        },

        onShowInformationItem: async function (sType, oEvent) {
            const oModel = this.getModel();
            const oViewModel = this.getModel("model");
            const sPath = oModel.createEntry("/InformationItemSet").getPath();
            let oInformationItemData = {};
            let sBindingPath = "";

            this.oInformationItemDialog = sap.ui.xmlfragment(this.getView().getId(), "com.sm.application.fragments.dialog.InformationItem", this);
            this.oInformationItemDialog.setModel(this.getModel("i18n"), "i18n");
            this.oInformationItemDialog.setModel(oViewModel, "model");

            this.getView().addDependent(this.oInformationItemDialog);

            this.oInformationItemDialog.bindElement(sPath);

            if (sType === "U") {
                sBindingPath = oEvent.getSource().getBindingContext("model").getPath();
                oInformationItemData = oViewModel.getProperty(sBindingPath);

                oModel.setProperty(sPath + "/Value", oInformationItemData.Value);
            }

            this.oInformationItemDialog.open();
        },


        /* ================ */
        /* Internal Methods */
        /* ================ */

        patternMatched: function () {
            const oModel = this.getModel();
            const oViewModel = this.getModel("model");
            const sID = oViewModel.getProperty("/ID");
            const sMode = oViewModel.getProperty("/Mode");
            let oExpand = {};
            let sPath = "";

            this.refreshView();

            this.getOwnerComponent().getModel().metadataLoaded().then(async () => {

                if (sMode === "C") {
                    sPath = oModel.createEntry("/...Set").getPath();
                    this.getView().bindElement(sPath);
                    oModel.setProperty(sPath + "/Value", "0");
                }

                if (sMode === "U") {
                    sPath = oModel.createKey("/...Set", {
                        ID: sID
                    });

                    oExpand = {
                        "$expand": "Documents,InformationItems"
                    };

                    await this.onReadAssociation(sPath, oExpand, oModel)
                        .then((oData) => {
                            this.setViewData(sPath, oData, oViewModel);
                        })
                        .catch(() => { })
                        .finally(() => { });
                }

            });
        },

        refreshView: function () {
            const oView = this.getView();
            const oBindingContext = oView.getBindingContext();
            const oModel = this.getModel();

            if (oBindingContext) {
                oView.unbindElement();
                oModel.deleteCreatedEntry(oBindingContext);
                oModel.resetChanges();
                oModel.refresh(true, true);
            }

            sap.ui.getCore().getMessageManager().removeAllMessages();
        },

        setViewData: function (sPath, oData, oViewModel) {
            this.getView().bindElement({
                path: sPath
            });

            oViewModel.setProperty("/Documents", oData.Documents.results);
            oViewModel.setProperty("/InformationItems", oData.InformationItems.results);
        }

    });
});