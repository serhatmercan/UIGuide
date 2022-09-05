sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/format/NumberFormat"
], function (DateFormat, NumberFormat) {
	"use strict";

	return {

		createUuidX16: function () {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				let r = Math.random() * 16 | 0,
					v = c === "x" ? r : (r & 0x3 | 0x8);
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

		generateDate: function () {
			const oDateFormat = DateFormat.getDateTimeInstance({ style: "medium" });

			return oDateFormat.format(new Date());
		},

		generateDateWithFormat: function () {
			const oDateFormat = DateFormat.getDateInstance({
				pattern: "dd/MM/yyyy",
				pattern: "dd-MM-YYYY"
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

		generateGUID: function(){
			function getID() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			
			return getID() + getID() + '-' + getID() + '-' + getID() + '-' + getID() + '-' + getID() + getID() + getID();
		},

		generateLink: function () {
			return jQuery.sap.getModulePath("com.serhatmercan.assets") + "/xxx.png";
		},

		generateLocalDateTime: function () {
			sap.ui.core.format.DateFormat.getDateTimeWithTimezoneInstance().format(new Date(), sap.ui.getCore().getConfiguration().getTimezone());
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

		generateURL: function (oContext) {
			const oModel = this.getModel();

			return oModel.sServiceUrl + oModel.createKey("/DocumentSet", {
				ID: oContext.ID,
				DocumentID: oContext.DocumentID
			}) + "/$value";
		},

		getLocalDate: function (sValue) {
			if (!sValue) {
				return null;
			}
			var sDate = new Date(sValue.valueOf());
			sDate.setHours((sDate.getTimezoneOffset() / 60) * -1);
			return sDate;
		},

		getLocalTime: function (oTime) {
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

		getText: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("text");
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