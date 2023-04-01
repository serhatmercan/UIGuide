sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/format/NumberFormat"
], function (DateFormat, NumberFormat) {
	"use strict";

	return {

		calculateBetweenTwoDates: function (dBeginDate, dEndDate) {
			const iOneDay = 1000 * 60 * 60 * 24;
			const iBeginDate = Date.UTC(dBeginDate.getFullYear(), dBeginDate.getMonth(), dBeginDate.getDate());
			const iEndDate = Date.UTC(dEndDate.getFullYear(), dEndDate.getMonth(), dEndDate.getDate());

			return (iEndDate - iBeginDate) / iOneDay;
		},

		checkTwoDates: function (dOpenDate, dCloseDate) {
			if (!dOpenDate || !dCloseDate) {
				return "None";
			}

			const dCloseUTCDate = new Date(Date.UTC(dCloseDate.getFullYear(), dCloseDate.getMonth(), dCloseDate.getDate()));
			const dOpenUTCDate = new Date(Date.UTC(dOpenDate.getFullYear(), dOpenDate.getMonth(), dOpenDate.getDate()));

			return dOpenUTCDate > dCloseUTCDate ? "Error" : "None";
		},

		checkTwoDateTimes: function (dOpenDate, tOpenTime, dCloseDate, tCloseTime) {
			if (!dOpenDate || !tOpenTime || !dCloseDate || !tCloseTime) {
				return "None";
			}

			const dCloseUTCDate = new Date(Date.UTC(dCloseDate.getFullYear(), dCloseDate.getMonth(), dCloseDate.getDate()));
			const dOpenUTCDate = new Date(Date.UTC(dOpenDate.getFullYear(), dOpenDate.getMonth(), dOpenDate.getDate()));

			if (dOpenUTCDate > dCloseUTCDate) {
				return "Error";
			}

			if (dOpenUTCDate < dCloseUTCDate) {
				return "None";
			}

			return tOpenTime.ms > tCloseTime.ms ? "Error" : "None";
		},

		createUuidX16: function () {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
				const r = Math.random() * 16 | 0;
				const v = c === "x" ? r : (r & 0x3 | 0x8);

				return v.toString(16);
			});
		},

		convertToEnglishLocalizedData: function (sData) {
			sData = sData.replace(/ö/g, 'o');
			sData = sData.replace(/ç/g, 'c');
			sData = sData.replace(/ş/g, 's');
			sData = sData.replace(/ı/g, 'i');
			sData = sData.replace(/ğ/g, 'g');
			sData = sData.replace(/ü/g, 'u');
			sData = sData.replace(/Ö/g, 'O');
			sData = sData.replace(/Ç/g, 'C');
			sData = sData.replace(/Ş/g, 'S');
			sData = sData.replace(/I/g, 'I');
			sData = sData.replace(/Ğ/g, 'G');
			sData = sData.replace(/Ü/g, 'U');
			sData = sData.replace(/[^a-z0-9-.çöşüğı]/gi, "");

			return sData;
		},

		convertToEnglishLocalizedUpperCase: function (sSentence) {
			const oLetterRuleSet = {
				"ç": "c",
				"ı": "i",
				"ğ": "g",
				"ö": "o",
				"ş": "s",
				"ü": "u",
				"Ç": "c",
				"İ": "I",
				"Ğ": "G",
				"Ö": "O",
				"Ş": "S",
				"Ü": "U",
			};

			return sSentence
				.replace(/\//g, "-")
				.replace(/\\/g, "-")
				.replace(/ç|ı|ğ|ö|ş|ü|Ç|İ|Ğ|Ö|Ş|Ü/g, sLetter => oLetterRuleSet[sLetter])
				.replace(/[.,#!$%\^&\*;:{}=\\/_`~@\+\?><\[\]\+]/g, "")
				.replace(/\s{2,}/g, " ")
				.toLocaleUpperCase("en");
		},

		convertMiliSecondsToHoursMinutesSeconds: function (iMiliSeconds) {
			const iSeconds = Math.floor((iMiliSeconds / 1000) % 60);
			const iMinutes = Math.floor((iMiliSeconds / 1000 / 60) % 60);
			const iHours = Math.floor(iMiliSeconds / 1000 / 60 / 60);

			return [
				iHours.toString().padStart(2, "0"),
				iMinutes.toString().padStart(2, "0"),
				iSeconds.toString().padStart(2, "0")
			].join(":");
		},

		generateDate: function () {
			const oDateFormat = DateFormat.getDateTimeInstance({ style: "medium" });

			return oDateFormat.format(new Date());
		},

		generateDateWithFormat: function () {
			const oDateFormat = DateFormat.getDateInstance({
				pattern: "dd/MM/yyyy",
				pattern: "dd-MM-YYYY",
				pattern: "yyyy-MM-ddTKK:mm:ss"
			});

			oDateFormat.format(new Date());
		},

		generateFileSize: function (sValue) {
			return sap.ui.core.format.FileSizeFormat.getInstance({
				binaryFilesize: false,
				maxFractionDigits: 1,
				maxIntegerDigits: 3
			}).format(sValue);
		},

		generateGUID: function () {
			function getID() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}

			return getID() + getID() + '-' + getID() + '-' + getID() + '-' + getID() + '-' + getID() + getID() + getID();
		},

		generateLink: function () {
			return jQuery.sap.getModulePath("com.serhatmercan.assets") + "/xxx.png";
		},

		generateLocalDate: function (sValue) {
			if (!sValue) {
				return null;
			}

			return new Date(sValue.valueOf()).setHours((sDate.getTimezoneOffset() / 60) * -1);
		},

		generateLocalDateTime: function () {
			sap.ui.core.format.DateFormat.getDateTimeWithTimezoneInstance().format(new Date(), sap.ui.getCore().getConfiguration().getTimezone());
		},

		generateLocalTime: function (oTime) {
			if (!oTime) {
				return null;
			}

			return {
				ms: oTime.getHours() * 60 * 60 * 1000 +
					oTime.getMinutes() * 60 * 1000 +
					oTime.getSeconds() * 1000,
				__edmType: "Edm.Time"
			};
		},

		generateText: function (sID, sText, sValue) {
			return sID + " / " + sText + " / " + sValue;
		},

		generateTimestamp: function (dCreatedDate, tCreatedTime) {
			if (!dCreatedDate || !tCreatedTime) {
				return;
			}

			const dCreatedTime = new Date(tCreatedTime.ms);

			dCreatedDate.setHours(dCreatedTime.getHours());
			dCreatedDate.setMinutes(dCreatedTime.getMinutes());
			dCreatedDate.setSeconds(dCreatedTime.getSeconds());

			return dCreatedDate;
		},

		getStatuIcon: function (sStatu) {
			let sStatuIcon = "";

			switch (sStatu) {
				case "I":
					sStatuIcon = "sap-icon://accept";
					break;
				case "II":
					sStatuIcon = "sap-icon://journey-arrive";
					break;
				case "III":
					sStatuIcon = "sap-icon://measurement-document";
					break;
				case "IV":
					sStatuIcon = "sap-icon://detail-view";
					break;
				case "V":
					sStatuIcon = "sap-icon://detail-view";
					break;
				case "VI":
					sStatuIcon = "sap-icon://decline";
					break;
				case "VII":
					sStatuIcon = "sap-icon://save";
					break;
				case "VIII":
					sStatuIcon = "sap-icon://pending";
					break;
				default:
					sStatuIcon = "";
			}

			return sStatuIcon;
		},

		getStatuState: function (sStatu) {
			let sStatuState = "";

			switch (sStatu) {
				case "A":
					sStatuState = "Success";
					break;
				case "B":
					sStatuState = "Error";
					break;
				default:
					sStatuState = "Warning";
					break;
			}

			return sStatuState;
		},

		/*
		* Generate Timestamp w/ Formatted Date & Formatted Time 
		*
		* @param{String|sDate}: 09.10.2022 
		* @param{String|sTime}: 16:12:28  
		*
		* @return{Timestamp}:	Timestamp Object
		*/

		getText: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("text");
		},

		generateTimestampWithFormat: function (sDate, sTime) {
			return new Date(sDate + "T" + sTime);
		},

		generateURL: function (oContext) {
			const oModel = this.getModel();

			return oModel.sServiceUrl + oModel.createKey("/DocumentSet", {
				ID: oContext.ID,
				DocumentID: oContext.DocumentID
			}) + "/$value";
		},

		padLeftAlphaNum: function (sVal, digit) {
			if (sVal.match(/[a-zA-Z&^(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\))$&\.-]/)) {
				return sVal.toUpperCase();
			} else {
				return Array(Math.max(digit - String(sVal).length + 1, 0)).join(0) + sVal;
			}
		},

		removeLeading: function (sValue) {
			if (!sValue) {
				return;
			}
			if (sValue.match(/[a-zA-Z&^(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\))$&\.-]/)) {
				return sValue;
			} else {
				return parseInt(sValue);
			}
		},

		removeLeadingZeros: function (sValue) {
			if (!sValue) {
				return "";
			}
			return +sValue;
		},

		setDefaultFilter: function (sValue) {
			if (sValue) {
				return true;
			} else {
				return false;
			}
		},

		setIDValue: function (sNumber1, sNumber2) {
			const oFloatNumberFormat = NumberFormat.getFloatInstance({
				decimals: 3,
				decimalSeparator: ",",
				groupingSeparator: ".",
				maxFractionDigits: "3",
				groupingEnabled: true
			}, sap.ui.getCore().getConfiguration().getLocale());
			const oIntegerNumberFormat = NumberFormat.getIntegerInstance({
				groupingSeparator: ".",
				groupingEnabled: true
			}, sap.ui.getCore().getConfiguration().getLocale());

			return oFloatNumberFormat.format(sNumber1) + " - " + oFloatNumberFormat.format(sNumber2);
		},

		setRowHighlight: function (sValue) {
			if (sValue === "R") {
				return "Error";
			} else if (sValue === "Y") {
				return "Warning";
			} else if (sValue === "G") {
				return "Success";
			} else {
				return "None";
			}
		},

		validateMail: function (sValue) {
			const oRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			return oRegExp.test(sValue);
		}

	};
});