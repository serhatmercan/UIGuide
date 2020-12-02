// Create JSON
var sJSON = '{"family":['
'{"firstName":"Serhat","lastName":"Mercan" },'
'{"firstName":"Elif","lastName":"Mercan" },'
'{"firstName":"Selim","lastName":"Mercan" }]}';

// Creata a JSON Model
this.getView().setModel(new JSONModel({
	ID: "",
	Name: ""
}), "modelJSON");

var aFamily = JSON.parse(sJSON).family;

for (var i in aFamily) {
	console.log(aFamily[i]); // {firstName: "Serhat", lastName: "Mercan"}, ...
}

// Convert Message
var sError;

aParams.error = function (oError) {
	if (oError.responseText) {
		sError = JSON.parse(oError.responseText).error.innererror.errordetails[0];
		MessageToast.show(sError.message);
		if (sError.severity === "success") {}
	}
}.bind(this);

// Attributes
var oPerson = {
	name: "Serhat",
	age: 26,
	city: "İstanbul"
};

var oJSON = JSON.stringify(oPerson); // Send Data	=> "{"name":"Serhat","age":26,"city":"İstanbul"}"
JSON.parse(oJSON); // Display Data As Object

// Local Storage
localStorage.setItem("lsJSON", oJSON); // Store Data 
localStorage.getItem("lsJSON"); // Retrieve Data
localStorage.removeItem("lsJSON");