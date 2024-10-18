// Clear Local Storage: App.controller.js / onInit()
sap.ushell.Container.attachLogoutEvent(() => { localStorage.clear() });

// Country Code From API
try {
    const oLocation = await $.getJSON('https://geolocation-db.com/json/');
    const sCountryCode = oLocation.country_code; // "TR"
} catch (oError) {
    console.error('Error fetching country code:', oError);
}

// Country Code & Region From Library
const sLocale = Intl.DateTimeFormat().resolvedOptions().locale;     // "tr"
const sTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // "Europe/Istanbul"

// Device Information
const oDeviceSystem = sap.ui.Device.system;
const bDesktop = oDeviceSystem.desktop;    // => true | false
const bPhone = oDeviceSystem.phone;        // => true | false
const bTablet = oDeviceSystem.tablet;      // => true | false

// Service Information
const oUserInfoService = sap.ushell.Container.getService("UserInfo");

// Service Information ID
const sUserID = oUserInfoService.getId();

// System ID
const sSystemName = sap.ushell.Container.getLogonSystem().getName();

// System Version
const sUI5Version = sap.ui.version;

// Tool ID
const sToolID = sap.ui.getCore().getElementById("ID");