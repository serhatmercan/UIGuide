_showServiceError: function (sDetails) {
	var jsonError, errorDetails, errorMessage = "",
		msg = "";

	try {
		jsonError = JSON.parse(sDetails.responseText);
		errorDetails = jsonError.error.innererror.errordetails;
		if (errorDetails && errorDetails.length > 0) {
			errorDetails.sort(function (a, b) {
				return a.message === b.message ? 0 : +(a.message > b.message) || -1;
			});

			for (var i in errorDetails) {
				if (msg !== errorDetails[i].message) {
					msg = errorDetails[i].message;
					errorMessage += "\u2022 " + msg + "\n";
				}
			}
		} else {
			errorMessage += "\u2022 " + jsonError.error.message.value + "\n";
		}
	} catch (exception) {
		errorMessage = this._sErrorText;
	}

	if (this._bMessageOpen) {
		return;
	}
	this._bMessageOpen = true;
	MessageBox.error(
		errorMessage, {
			id: "serviceErrorMessageBox",
			details: errorDetails,
			styleClass: this._oComponent.getContentDensityClass(),
			actions: [MessageBox.Action.CLOSE],
			onClose: function () {
				this._bMessageOpen = false;
			}.bind(this)
		}
	);
}