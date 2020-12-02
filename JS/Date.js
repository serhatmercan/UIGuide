// Date
var dBirthDay = new Date(1994, 11, 26, 01); // => Year, Month - 1, Day, Hour
console.log(dBirthDay); // => Mon Dec 26 1994 01:00:00 GMT+0200 (GMT+03:00)

var dBirthDay = new Date("1994-12-26T01:00:00"); // => Year - Month - Day - Hour - Minute - Second
console.log(dBirthDay); // => Mon Dec 26 1994 01:00:00 GMT+0200 (GMT+03:00)

// Data Formatted
let oToday = new Date(),							// Sun Jun 28 2020 12:51:35 GMT+0300 (GMT+03:00)
	oTodayTR = oToday.toLocaleDateString("tr-TR"),	// "28.06.2020"
	oTodayEN = oToday.toLocaleDateString("en-US");	// "6/28/2020"