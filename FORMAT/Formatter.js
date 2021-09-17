sap.ui.define([], function () {
	"use strict";

	return {

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

		setDefaultFilter: function (sValue) {
			if (sValue) {
				return true;
			} else {
				return false;
			}
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
		}

	}

})