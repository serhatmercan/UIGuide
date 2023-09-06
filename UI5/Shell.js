// Country Code From API
let sCountryCode = "";

await $.getJSON('https://geolocation-db.com/json/').done((oLocation) => {
    sCountryCode = oLocation.country_code; // "TR"
});

// Country Code & Region From Library
Intl.DateTimeFormat().resolvedOptions().locale;	  // "tr"
Intl.DateTimeFormat().resolvedOptions().timeZone; // "Europe/Istanbul"

// Device Information
sap.ui.Device.system
sap.ui.Device.system.desktop    // => true | false
sap.ui.Device.system.phone      // => true | false
sap.ui.Device.system.tablet     // => true | false

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