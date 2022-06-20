/* Global Location */
sap.ui.define([
	"serhatmercan/controller/BaseController",
	"serhatmercan/models/formatter"
], function (BaseController, Formatter) {
	"use strict";

	return BaseController.extend("serhatmercan.FORMAT.FormatData", {

		onDateFormat: function (oEvent) {
			var sDate = new Date(),
				sTime = new Date(),
				sNo = "1",
				sData = "Serhat";

			var sLocalDate = Formatter.getLocalDate(sDate),
				sLocalTime = Formatter.getLocalTime(sTime),
				sFormattedNo = Formatter.padLeftAlphaNum(sNo, 10),
				sRemovedZeroNo = Formatter.removeLeading(sNo),
				sEnglishWords = Formatter.convertToEnglishLocalizedUpperCase(sNo),
				sUID = Formatter.createUuidX16(),
				sConvertedData = Formatter.convertToEnglishLocalizedData(sData);
		}

	});

});