sap.ui.define([], function () {
	"use strict";

	return {

		// Despite the name, this also matches many symbol characters (+, *, =, etc.), not just letters.
		validField: function (sValue) {
			return sValue.match(/[a-zA-Z&^(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\))$&\.-]/) ? true : false;
		},

		padLeft: function (num, digit) {
			return Array(Math.max(digit - String(num).length + 1, 0)).join(0) + num;
		}

	}

});