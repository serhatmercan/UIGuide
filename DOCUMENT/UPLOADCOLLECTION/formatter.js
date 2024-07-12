sap.ui.define([], () => {
	"use strict";

	return {

		generateFileSize(sValue) {
			return sap.ui.core.format.FileSizeFormat.getInstance({
				binaryFilesize: false,
				maxFractionDigits: 1,
				maxIntegerDigits: 3
			}).format(sValue);
		},

		generateURL(oContext) {
			const oModel = this.getModel();
			const { ID: sID, DocumentID: sDocumentID } = oContext;

			return `${oModel.sServiceUrl}${oModel.createKey("/DocumentSet", { sID, sDocumentID })}/$value`;
		}

	};
});
