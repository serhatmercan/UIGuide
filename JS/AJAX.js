// Create an XMLHttpRequest Object
function fnAJAX() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () { // Gets Everytime Fired When the XHR Request State Changes
		if (this.readyState == 4 && this.status == 200) { // 4 means Request is Finished & Response is Ready 200 Means OK
			console.log(this.responseText); // This Refers Here to the XHR Object

			if (this.responseXML) {
				decodeXML(this);
			}

		}
	};
	xhttp.open("GET", "https://reqres.in/api/products/3", true); // Set the XHR Request Parameters
	xhttp.send(); // Fire the XHR Request		
}
// => Response Text
/*
{
	"data": {
		"id": 3,
		"name": "true red",
		"year": 2002,
		"color": "#BF1932",
		"pantone_value": "19-1664"
	},
	"ad": {
		"company": "StatusCode Weekly",
		"url": "http://statuscode.org/",
		"text": "A weekly newsletter focusing on software development, infrastructure, the server, performance, and the stack end of things."
	}
}
*/
function decodeXML(that) {
	var oXMLDoc = that.responseXML,
		oParagraph = xmlDoc.getElementsByTagName("p");
	sData = oParagraph[0].getElementsByTagName("DATA_COLUMN")[0].childNodes[0].nodeValue; // FOR
}

// 
// AJAX: Fetch
function getWeather(woeid) {
	fetch(`https://crossorigin.me/https://www.metaweather.com/api/location/${woeid}/`)
		.then(result => {
			return result.json();
		})
		.then(data => {
			const today = data.consolidated_weather[0];
			console.log(`Temperatures today in ${data.title} stay between ${today.min_temp} and ${today.max_temp}.`);
		})
		.catch(error => console.log(error));
}
getWeather(2487956);
getWeather(44418);