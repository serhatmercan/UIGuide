// Country Code From API
let sCountryCode = "";

await $.getJSON('https://geolocation-db.com/json/').done((oLocation) => {
    sCountryCode = oLocation.country_code; // "TR"
});

// Country Code & Region From Library
Intl.DateTimeFormat().resolvedOptions().locale;	  // "tr"
Intl.DateTimeFormat().resolvedOptions().timeZone; // "Europe/Istanbul"

// Service Information
sap.ushell.Container.getService("UserInfo");

// Service Information ID
sap.ushell.Container.getService("UserInfo").getId();

// System ID
sap.ushell.Container.getLogonSystem().getName();

// System Version
sap.ui.version;

// Tool ID
sap.ui.getCore().getElementById("ID");