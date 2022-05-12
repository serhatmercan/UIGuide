sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"xxx/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("xxx.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();

			this.setModel(models.createDeviceModel(), "device");
		},

		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// eslint-disable-next-line sap-no-proprietary-browser-api
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});