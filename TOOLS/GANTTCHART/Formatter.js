sap.ui.define([], function () {
	"use strict";

	return {

		convertTime: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
		},

		getChartIconColor: function (sType, sError) {
			if (sType.toString() === "") {
				if (sError === "E") {
					return "red";
				} else {
					return "blue";
				}
			} else {
				return "yellow";
			}
		},

		getMessageIcon: function (sValue) {
			if (!sValue) {
				return "";
			}

			let sIcon = "";

			switch (sValue.toString()) {
			case "E":
				sIcon = "sap-icon://sys-minus";
				break;
			case "S":
				sIcon = "sap-icon://accept";
				break;
			case "W":
				sIcon = "sap-icon://status-critical";
				break;
			default:
				sIcon = "";
				break;
			}

			return sIcon;
		},

		getMessageColor: function (sValue) {
			if (!sValue) {
				return "";
			}

			let sIcon = "";

			switch (sValue.toString()) {
			case "E":
				sIcon = "red";
				break;
			case "S":
				sIcon = "green";
				break;
			case "W":
				sIcon = "yellow";
				break;
			default:
				sIcon = "";
				break;
			}

			return sIcon;
		}

	}

})