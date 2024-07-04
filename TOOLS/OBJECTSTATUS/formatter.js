sap.ui.define([], function () {
    "use strict";

    return {

        getValueIcon: function (sStatuNumber) {
            let sStatuIcon = "";

            switch (sStatuNumber) {
                case "APP":
                    sStatuIcon = "sap-icon://accept";
                    break;
                case "ARR":
                    sStatuIcon = "sap-icon://journey-arrive";
                    break;
                case "DEL":
                    sStatuIcon = "sap-icon://measurement-document";
                    break;
                case "POS":
                    sStatuIcon = "sap-icon://detail-view";
                    break;
                case "REJ":
                    sStatuIcon = "sap-icon://decline";
                    break;
                case "SAV":
                    sStatuIcon = "sap-icon://save";
                    break;
                case "WAI":
                    sStatuIcon = "sap-icon://pending";
                    break;
                default:
                    sStatuIcon = "";
            }

            return sStatuIcon;
        },

        getValueState: function (sStatuNumber) {
            let sStatuState = "";

            switch (sStatuNumber) {
                case "APP":
                    sStatuState = "Success";
                    break;
                case "REJ":
                    sStatuState = "Error";
                    break;
                case "SAV":
                    sStatuState = "Warning";
                    break;
                default:
                    sStatuState = "None";
            }

            return sStatuState;
        }

    };
});
