sap.ui.define([], () => {
    "use strict";

    const aStatusIcons = {
        "APP": "sap-icon://accept",
        "ARR": "sap-icon://journey-arrive",
        "DEL": "sap-icon://measurement-document",
        "POS": "sap-icon://detail-view",
        "REJ": "sap-icon://decline",
        "SAV": "sap-icon://save",
        "WAI": "sap-icon://pending"
    };

    const aStatusStates = {
        "APP": "Success",
        "REJ": "Error",
        "SAV": "Warning"
    };

    return {
        getValueIcon: (sStatuNumber) => aStatusIcons[sStatuNumber] || "",
        getValueState: (sStatuNumber) => aStatusStates[sStatuNumber] || "None"
    };
});