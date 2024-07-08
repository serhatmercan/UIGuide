sap.ui.define([
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/format/NumberFormat"
], (DateFormat, NumberFormat) => {

	"use strict";

	return {

		/*
		=> template("xyz")
		<= 
		*/
		template(sValue) {
			return true;
		},

		/*
		=> calculateBetweenTwoDates(new Date("2023-07-01"), new Date("2023-07-10"))
		<= 9
		*/
		calculateBetweenTwoDates(dBeginDate, dEndDate) {
			const iOneDayMS = 1000 * 60 * 60 * 24;
			const iBeginDate = Date.UTC(dBeginDate.getFullYear(), dBeginDate.getMonth(), dBeginDate.getDate());
			const iEndDate = Date.UTC(dEndDate.getFullYear(), dEndDate.getMonth(), dEndDate.getDate());

			return (iEndDate - iBeginDate) / iOneDayMS;
		},

		/*
		=> checkDateValidation(new Date("2023-07-04"))
		<= true

		=> checkDateValidation("2023-07-04")
		<= false
		*/
		checkDateValidation(xDate) {
			return xDate instanceof Date && !isNaN(xDate);
		},

		/*
		Calculate Difference Between Two Date Times w/ .. yıl .. ay .. gün
		=> @dBeginDate: Mon Dec 26 1994 00:00:00 GMT+0200 (GMT+03:00) 
		=> @dEndDate: Sun Apr 16 2023 12:34:10 GMT+0300 (GMT+03:00)
		=> calculateDifferenceBetweenTwoDateTimesWithYYMMDD(dBeginDate, dEndDate)
		<= "28 yıl 3 ay 21 gün"
		*/
		calculateDifferenceBetweenTwoDateTimesWithYYMMDD(dBeginDate, dEndDate) {
			const dDifferenceDate = new Date(dEndDate.getTime() - dBeginDate.getTime());
			const iPassedDays = Math.abs(dDifferenceDate.getDate() - 1);
			const iPassedMonths = Math.abs(dDifferenceDate.getMonth());
			const iPassedYears = Math.abs(dDifferenceDate.getFullYear() - 1970);

			return `${iPassedYears > 0 ? `${iPassedYears} yıl ` : ""}${iPassedMonths > 0 ? `${iPassedMonths} ay ` : ""}${iPassedDays > 0 ? `${iPassedDays} gün` : ""}`.trim();
		},

		/*
		Calculate Difference Between Two Date Times w/ Days + .. year(s) .. month(s) .. day(s)
		=> @dFirstDate: First Date in the format MM-DD-YYYY / new Date()
		=> @dSecondDate: Second Date in the format MM-DD-YYYY / new Date("12/26/1994")
		=> calculateDifferenceBetweenTwoDateTimesWithDaysAndYYMMDD(dFirstDate, dSecondDate)
		<= {TotalDays: 10332.251, DifferenceResult: '28 years 3 months 21 days'}
		*/
		calculateDifferenceBetweenTwoDateTimesWithDaysAndYYMMDD(sFirstDate, sSecondDate) {
			const aYearsText = ["year", "years"];
			const aMonthsText = ["month", "months"];
			const aDaysText = ["day", "days"];
			const dFirstDateTime = new Date(sFirstDate).getTime();
			const dSecondDateTime = new Date(sSecondDate).getTime();
			const dDifferenceDate = dFirstDateTime > dSecondDateTime ? new Date(dFirstDateTime - dSecondDateTime) : new Date(dSecondDateTime - dFirstDateTime);
			const iPassedDays = Math.abs(dDifferenceDate.getDate()) - 1;
			const iPassedMonths = Math.abs(dDifferenceDate.getMonth() + 1) - 1;
			const iPassedYears = Math.abs(dDifferenceDate.getFullYear()) - 1970;
			const iTotalDays = (iPassedYears * 365) + (iPassedMonths * 30.417) + iPassedDays;
			const sDifference = [
				iPassedYears > 0 ? `${iPassedYears} ${aYearsText[passedYears === 1 ? 0 : 1]}` : "",
				iPassedMonths > 0 ? `${iPassedMonths} ${aMonthsText[passedMonths === 1 ? 0 : 1]}` : "",
				iPassedDays > 0 ? `${iPassedDays} ${aDaysText[passedDays === 1 ? 0 : 1]}` : ""
			].join(" ").trim();

			return {
				"TotalDays": Math.round(iTotalDays),
				"DifferenceResult": sDifference.trim()
			};
		},

		/*
		Compare Open Date & Close Date -> If Open Date > Close Date ? "Error" : "None" (For Date Picker's Value State)
		=> @dOpenDate: Type: sap.ui.model.type.Date / new Date()
		=> @dCloseDate: Type: sap.ui.model.type.Date / new Date()
		=> checkTwoDates(dOpenDate, dCloseDate)
		<= "Error" || "None"
		*/
		checkTwoDates(dOpenDate, dCloseDate) {
			if (!dOpenDate || !dCloseDate) {
				return "None";
			}

			const dCloseUTCDate = Date.UTC(dCloseDate.getFullYear(), dCloseDate.getMonth(), dCloseDate.getDate());
			const dOpenUTCDate = Date.UTC(dOpenDate.getFullYear(), dOpenDate.getMonth(), dOpenDate.getDate());

			return dOpenUTCDate > dCloseUTCDate ? "Error" : "None";
		},

		/*
		Compare Open Date Time & Close Date Time -> If Open Date Time > Close Date Time ? "Error" : "None" (For Time Picker's Value State)
		=> @dOpenDate:  Type: sap.ui.model.type.Date / new Date()
		=> @tOpenTime:  Type: sap.ui.model.type.Time / new Date()
		=> @dCloseDate: Type: sap.ui.model.type.Date / new Date()
		=> @tCloseTime: Type: sap.ui.model.type.Time / new Date()
		=> checkTwoDateTimes(dOpenDate, tOpenTime, dCloseDate, tCloseTime)
		<= "Error" || "None"
		*/
		checkTwoDateTimes(dOpenDate, tOpenTime, dCloseDate, tCloseTime) {
			if (!dOpenDate || !tOpenTime || !dCloseDate || !tCloseTime) {
				return "None";
			}

			const dCloseUTCDate = Date.UTC(dCloseDate.getFullYear(), dCloseDate.getMonth(), dCloseDate.getDate());
			const dOpenUTCDate = Date.UTC(dOpenDate.getFullYear(), dOpenDate.getMonth(), dOpenDate.getDate());

			if (dOpenUTCDate > dCloseUTCDate) {
				return "Error";
			}

			if (dOpenUTCDate < dCloseUTCDate) {
				return "None";
			}

			return tOpenTime.ms > tCloseTime.ms ? "Error" : "None";
		},

		/*
		=> createUuidX16()
		<= "9f1b5e97-d5a6-4c2b-8a8e-2b7bcb45fdf1"
		*/
		createUuidX16() {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
				const r = Math.random() * 16 | 0;
				const v = c === "x" ? r : (r & 0x3 | 0x8);

				return v.toString(16);
			});
		},

		/*
		=> convertToEnglishLocalizedData("diloş")
		<= dilos
		*/
		convertToEnglishLocalizedData(sData) {
			const aReplacements = {
				'ö': 'o', 'ç': 'c', 'ş': 's', 'ı': 'i', 'ğ': 'g', 'ü': 'u',
				'Ö': 'O', 'Ç': 'C', 'Ş': 'S', 'I': 'I', 'Ğ': 'G', 'Ü': 'U'
			};

			return sData.replace(/[öçşığüÖÇŞIĞÜ]/g, sMatch => aReplacements[sMatch]).replace(/[^a-z0-9-.]/gi, "");
		},

		/*
		=> convertToEnglishLocalizedUpperCase("diloş")
		<= DILOS
		*/
		convertToEnglishLocalizedUpperCase(sSentence) {
			const aLetterRuleSet = {
				"ç": "c", "ı": "i", "ğ": "g", "ö": "o", "ş": "s", "ü": "u",
				"Ç": "c", "İ": "I", "Ğ": "G", "Ö": "O", "Ş": "S", "Ü": "U"
			};

			return sSentence
				.replace(/[çğıöşüÇİĞÖŞÜ\/\\]/g, sLetter => aLetterRuleSet[sLetter] || "-")
				.replace(/[.,#!$%\^&\*;:{}=\\/_`~@\+\?><\[\]\+]/g, "")
				.replace(/\s{2,}/g, " ")
				.toLocaleUpperCase("en");
		},

		/*
		=> convertMiliSecondsToHoursMinutesSeconds(9876543)
		<= "02:44:36"
		*/
		convertMiliSecondsToHoursMinutesSeconds(iMiliSeconds) {
			const iSeconds = Math.floor((iMiliSeconds / 1000) % 60);
			const iMinutes = Math.floor((iMiliSeconds / 1000 / 60) % 60);
			const iHours = Math.floor(iMiliSeconds / 1000 / 60 / 60);

			return [
				String(iHours).padStart(2, "0"),
				String(iMinutes).padStart(2, "0"),
				String(iSeconds).padStart(2, "0")
			].join(":");
		},

		generateDate() {
			const oDateFormat = DateFormat.getDateTimeInstance({ style: "medium" });

			return oDateFormat.format(new Date());
		},

		/*
		=> @oDate: Type: sap.ui.model.type.Date / Sun May 14 2023 15:12:49 GMT+0300 (GMT+03:00)
		=> @oTime: Type: sap.ui.model.type.Time / {ms: 63549000, __edmType: 'Edm.Time'}
		=> generateDateTime(oDate, oTime)
		<= DateTime
		*/
		generateDateTime(oDate, oTime) {
			oDate.setHours(0, 0, 0, 0);

			const oDateTime = new Date(oDate.valueOf());

			oDateTime.setTime(oDateTime.getTime() + oTime.ms);

			return oDateTime;
		},

		/*
		=> oFormattedDates = generateDateWithFormat();
		<= oFormattedDates.Format1 // "dd/MM/yyyy" 
		<= oFormattedDates.Format2 // "dd-MM-YYYY" 
		<= oFormattedDates.Format3 // "yyyy-MM-ddTKK:mm:ss"
		*/
		generateDateWithFormat() {
			const oDate = new Date();
			const oDateFormat1 = DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });
			const oDateFormat2 = DateFormat.getDateInstance({ pattern: "dd-MM-YYYY" });
			const oDateFormat3 = DateFormat.getDateInstance({ pattern: "yyyy-MM-ddTKK:mm:ss" });

			return {
				Format1: oDateFormat1.format(oDate),
				Format2: oDateFormat2.format(oDate),
				Format3: oDateFormat3.format(oDate)
			};
		},

		/*
		=> oDate = generateDateWithOData()
		<= oDate.oDateI  // "datetime'1995-02-28T00:00:00'"
		<= oDate.oDateII // "1995-02-28T00%3A00%3A00"
		*/
		generateDateWithOData() {
			const oDateI = "datetime'1995-02-28T00:00:00'";
			const oDateII = encodeURIComponent("1995-02-28T00:00:00");

			return { oDateI, oDateII };
		},

		/*
		=> generateFileSize(1234567)
		<= "1.2 MB"
		*/
		generateFileSize(sValue) {
			return sap.ui.core.format.FileSizeFormat.getInstance({
				binaryFilesize: false,
				maxFractionDigits: 1,
				maxIntegerDigits: 3
			}).format(sValue);
		},

		/*
		=> generateGUID()
		<= "3e6f2a79-3e6f-2a79-3e6f-2a793e6f2a79"
		*/
		generateGUID() {
			const getID = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

			return `${getID()}${getID()}-${getID()}-${getID()}-${getID()}-${getID()}${getID()}${getID()}`;
		},

		/*
		=> generateLink()
		<= "path/to/com/serhatmercan/assets/xxx.png"
		*/
		generateLink() {
			return `${jQuery.sap.getModulePath("com.serhatmercan.assets")}/xxx.png`;
		},

		/*
		=> generateLocalDate(new Date())
		<= TimeStamp -> 1683938246024
		*/
		generateLocalDate(oDate) {
			if (!oDate) {
				return null;
			}

			const dLocalDate = new Date(oDate.valueOf());

			dLocalDate.setHours(dLocalDate.getHours() - dLocalDate.getTimezoneOffset() / 60);

			return dLocalDate;
		},

		generateLocalDateTime() {
			sap.ui.core.format.DateFormat.getDateTimeWithTimezoneInstance().format(new Date(), sap.ui.getCore().getConfiguration().getTimezone());
		},

		/*
		=> generateLocalTime(new Date())
		<= {ms: 63549000, __edmType: 'Edm.Time'}
		*/
		generateLocalTime(oDate) {
			if (!oDate) {
				return null;
			}

			const iMilliseconds = oDate.getHours() * 3600000 + oDate.getMinutes() * 60000 + oDate.getSeconds() * 1000;

			return {
				ms: iMilliseconds,
				__edmType: "Edm.Time"
			};
		},

		/*
		=> generateText("ABC", "Text", "777")
		<= // ABC / Text / 777
		*/
		generateText(sID, sText, sValue) {
			return `${sID} / ${sText} / ${sValue}`;
		},

		/*
		=> @oCreatedDate: Type: sap.ui.model.type.Date / Sun May 14 2023 15:12:49 GMT+0300 (GMT+03:00)
		=> @oCreatedTime: Type: sap.ui.model.type.Time / {ms: 63549000, __edmType: 'Edm.Time'}
		<= DateTime
		*/
		generateTimestamp(oCreatedDate, oCreatedTime) {
			if (!oCreatedDate || !oCreatedTime) {
				return;
			}

			const dCreatedTime = new Date(oCreatedTime.ms);

			oCreatedDate.setHours(dCreatedTime.getHours());
			oCreatedDate.setMinutes(dCreatedTime.getMinutes());
			oCreatedDate.setSeconds(dCreatedTime.getSeconds());

			return oCreatedDate;
		},

		/*
		=> getStatuIcon("I")
		<= "sap-icon://accept"
		*/
		getStatuIcon(sStatu) {
			const aStatuIcons = {
				"I": "sap-icon://accept",
				"II": "sap-icon://journey-arrive",
				"III": "sap-icon://measurement-document"
			};

			return aStatuIcons[sStatu] || "";
		},

		/*
		=> getStatuState("C")
		<= "Warning"
		*/
		getStatuState(sStatu) {
			const aStatuStates = {
				"A": "Success",
				"B": "Error",
				"C": "Warning"
			};

			return aStatuStates[sStatu] || "";
		},

		getText() {
			return this.getOwnerComponent()?.getModel("i18n")?.getResourceBundle()?.getText("text");
		},

		/*
		Generate Timestamp w/ Formatted Date & Formatted Time 
		=> @param{String|sDate}: 09.10.2022 
		=> @param{String|sTime}: 16:12:28  
		<= @return{Timestamp}:	 Timestamp Object
		*/
		generateTimestampWithFormat(sDate, sTime) {
			return new Date(sDate + "T" + sTime);
		},

		/*
		=> oContext = { ID: "123", DocumentID: "456" }
		=> generateURL(oContext)
		<= URL
		*/
		generateURL(oContext) {
			const oModel = this.getModel();
			const { sServiceUrl, createKey } = oModel;
			const key = createKey("/DocumentSet", {
				ID: oContext.ID,
				DocumentID: oContext.DocumentID
			});

			return `${sServiceUrl}${key}/$value`;
		},

		/*
		=> padLeftAlphaNum("abc", 5)
		<= "ABC"

		=> padLeftAlphaNum("123", 5)
		<= '00123'
		*/
		padLeftAlphaNum(xValue, iDigit) {
			const bAlpha = /[a-zA-Z&^(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\))$&\.-]/.test(xValue);

			return bAlpha ? xValue.toUpperCase() : xValue.padStart(iDigit, "0");
		},

		/*
		=> removeLeading("abc")
		<= "abc"

		=> removeLeading("00123")
		<= 123
		*/
		removeLeading(sValue) {
			if (!sValue) return;

			const bAlpha = /[a-zA-Z&^(\+|-|\*|\/|=|>|<|>=|<=|&|\||%|!|\^|\(|\))$&\.-]/.test(sValue);

			return bAlpha ? sValue : parseInt(sValue, 10);
		},

		/*
		=> removeLeadingZeros("00123")
		<= "123"
		*/
		removeLeadingZeros(sValue) {
			if (!sValue) return "";

			return +sValue;
		},

		/*
		=> setIDValue(1234.567, 8910.1112)
		<= "1.234,567 - 8.910,111"
		*/
		setFloatValue(sNumber1, sNumber2) {
			const oLocale = sap.ui.getCore().getConfiguration().getLocale();
			const oFloatNumberFormat = NumberFormat.getFloatInstance({
				decimals: 3,
				decimalSeparator: ",",
				groupingSeparator: ".",
				maxFractionDigits: 3,
				groupingEnabled: true
			}, oLocale);

			return `${oFloatNumberFormat.format(sNumber1)} - ${oFloatNumberFormat.format(sNumber2)}`;
		},

		/*
		=> setRowHighlight("Y")
		<= "Warning"
		*/
		setRowHighlight(sValue) {
			const aHighlights = {
				"R": "Error",
				"Y": "Warning",
				"G": "Success"
			};

			return aHighlights[sValue] || "None";
		},

		/*
		=> validateMail("example@example.com")
		<= true

		=> validateMail("invalid-email") 		
		<= false
		*/
		validateMail(sValue) {
			const oEmailRegex = new RegExp(
				'^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@' +
				'((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|' +
				'(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
			);

			return oEmailRegex.test(sValue);
		}

	};
});