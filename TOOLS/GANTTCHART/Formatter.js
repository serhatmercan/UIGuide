sap.ui.define([], () => {
	"use strict";

	return {

		convertTime: (sTimestamp) => Format.abapTimestampToDate(sTimestamp),

		getChartIconColor: (sType, sError) => {
			if (!sType) {
				return sError === "E" ? "red" : "blue";
			}

			return "yellow";
		},

		getMessageIcon: (sValue) => {
			if (!sValue) return "";

			const aIcons = {
				"E": "sap-icon://sys-minus",
				"S": "sap-icon://accept",
				"W": "sap-icon://status-critical"
			};

			return aIcons[sValue] || "";
		},

		getMessageColor: (sValue) => {
			if (!sValue) return "";

			const aColors = {
				"E": "red",
				"S": "green",
				"W": "yellow"
			};

			return aColors[sValue] || "";
		}

	};

});