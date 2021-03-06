sap.ui.define([], function () {
	"use strict";

	return {

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
		}

	}

})