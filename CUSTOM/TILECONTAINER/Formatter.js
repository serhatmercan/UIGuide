sap.ui.define([], function() {
	"use strict";

	return {

		getActionText: function(sText) {
			return this.getResourceBundle().getText(sText);
		}

	};

});