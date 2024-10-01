sap.ui.define([
    "com/serhatmercan/controller/BaseController",
    "com/serhatmercan/utils/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/Text",
    "sap/ui/model/json/JSONModel"
], (BaseController, Column, ColumnListItem, Input, Text, Table, JSONModel) => {
    "use strict";

    return BaseController.extend("com.serhatmercan.Controller", {

        /* ================= */
        /* Lifecycle Methods */
        /* ================= */

        onInit() {
            this.setModel(new JSONModel({
                Items: [],
                Value: ""
            }), "model");

            this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
        },

        /* ============== */
        /* Event Handlers */
        /* ============== */

        /* ================ */
        /* Internal Methods */
        /* ================ */

        createTable() {
            var oTable = new Table();

            oTable.setModel(this.getModel("model"));
            oTable.addColumn(new Column({
                header: new Text({
                    text: "Key"
                })
            }));
            oTable.addColumn(new Column({
                header: new Text({
                    text: "Value"
                })
            }));

            oTable.bindItems("/", (sID, oContext) => {
                const oListItem = new ColumnListItem({
                    vAlign: sap.ui.core.VerticalAlign.Middle
                });

                oListItem.addCell(new Text({
                    text: {
                        path: "Key"
                    }
                }));

                const oInput = new Input({
                    value: {
                        path: "Value"
                    },
                    submit: () => {
                        that.onChangeValue();
                        oTable.tabForward();
                    }
                });

                oListItem.addCell(oInput);

                return oListItem;
            });
        },

        patternMatched() { }

    });
});