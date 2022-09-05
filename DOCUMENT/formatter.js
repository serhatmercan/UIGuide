sap.ui.define([], function () {
	"use strict";

	return {

		generateFileSize: function (sValue) {
			return sap.ui.core.format.FileSizeFormat.getInstance({
				binaryFilesize: false,
				maxFractionDigits: 1,
				maxIntegerDigits: 3
			}).format(sValue);
		},

		generateURL: function (oContext) {
			const oModel = this.getModel();

			return oModel.sServiceUrl + oModel.createKey("/DocumentSet", {
				ID: oContext.ID,
				DocumentID: oContext.DocumentID
			}) + "/$value";
		}

	};
});