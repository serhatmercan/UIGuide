sap.ui.define([], function () {
	"use strict";

	return {

		validField: function (sValue) {
			if (sValue.match(/[a-zA-Z&^(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\))$&\.-]/)) {
				return false;
			} else {
				return true;
			}
		},

		padLeft: function (num, digit) {
			return Array(Math.max(digit - String(num).length + 1, 0)).join(0) + num;
		}

	}

})