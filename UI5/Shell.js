// Application Language
// "sap/ui/core/Core" => Core
// Get: sap-language || sap-ui-language
const sLanguage = new URLSearchParams(window.location.search).get("sap-language"); // => "TR" | "EN"
const sLanguageII = jQuery.sap.getUriParameters().get("sap-language");

// Set
Core.getConfiguration().setLanguage("TR"); // => "EN"

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

// Manifest Information
const oModelInformation = this.getManifestEntry("/sap.ui5/models"); // "" , i18n Models Informations

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