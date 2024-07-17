sap.ui.define([
    "./BaseController",
    "sap/m/StandardTile",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], (BaseController, StandardTile, History, JSONModel) => {
    "use strict";

    return BaseController.extend("xxx.controller.TileContainer", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit() {
            this.setModel(new JSONModel({
                Title: "Main Screen",
                Type: "Menu",
                Screens: [
                    {
                        Icon: "sap-icon://laptop", Info: "", Number: 10, Title: "STI", Type: "Menu",
                        Screens: [
                            { Icon: "sap-icon://suitcase", Info: "", Number: "", Title: "STIA", Type: "View", View: "SVIA" },
                            { Icon: "sap-icon://private", Info: "", Number: "", Title: "STIB", Type: "View", View: "SVIB" }
                        ]
                    },
                    {
                        Icon: "sap-icon://shipping-status", Info: "", Number: 20, Title: "STII", Type: "Menu",
                        Screens: [{
                            Icon: "sap-icon://payment-approval", Info: "", Number: "", Title: "STIIA", Type: "View", View: "SVIIA"
                        }]
                    }
                ]
            }), "model");

            this.aPaths = [];
            this.getRouter().getRoute("TileContainer").attachPatternMatched(this.patternMatched, this);
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        onNavBack() {
            const sPreviousHash = History?.getInstance()?.getPreviousHash();
            const oCrossAppNavigator = sap.ushell.Container?.getService("CrossApplicationNavigation");

            if (sPreviousHash || !oCrossAppNavigator?.isInitialNavigation()) {
                history.go(-1);
            } else {
                oCrossAppNavigator?.toExternal({
                    target: {
                        shellHash: "#Shell-home"
                    }
                });
            }
        },

        onPressTile(oEvent) {
            const oModel = oEvent?.getSource()?.getBindingContext("model");
            const oModelData = oModel?.getObject();

            if (oModelData?.Type === "Menu") {
                const sPath = oModel?.getPath();
                const aSplits = sPath?.split("/")?.slice(0, -1);

                if (oModelData?.Screens) {
                    this.aPaths?.push(aSplits.join("/"));
                    this.createTile(`${sPath}/Screens`);
                }
            } else if (oModelData?.Type === "View") {
                this.getRouter()?.navTo(oModelData?.View);
            }
        },

        /* ================ */
        /* Internal Methods */
        /* ================ */

        createTile(sPath) {
            const oTileContainer = this.byId("TileContainer");
            const oStandardTile = new StandardTile({
                icon: "{model>Icon}",
                info: {
                    path: "model>Info",
                    formatter: this.formatter.getActionText.bind(this)
                },
                infoState: "Error",
                number: "{model>Number}",
                title: {
                    path: "model>Title",
                    formatter: this.getActionText.bind(this)
                },
                press: this.onPressTile.bind(this)
            });

            oTileContainer?.unbindAggregation();
            oTileContainer?.bindAggregation("tiles", `model>${sPath}`, oStandardTile);
        },

        getActionText(sText) {
            return this.getText(sText);
        },

        patternMatched() {
            this.createTile("/Screens");
        }

    });
});