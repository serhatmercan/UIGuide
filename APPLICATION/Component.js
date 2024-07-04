sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"xxx/model/models"
<<<<<<< HEAD
], (UIComponent, Device, models) => {
=======
], function (UIComponent, Device, models) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
	"use strict";

	return UIComponent.extend("xxx.Component", {

		metadata: {
			manifest: "json"
		},

<<<<<<< HEAD
		init() {
=======
		init: function () {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.setModel(models.createDeviceModel(), "device");
		},

<<<<<<< HEAD
		getContentDensityClass() {
			if (this.sContentDensityClass === undefined) {
				const bodyClassList = document.body.classList;

				if (bodyClassList.contains("sapUiSizeCozy") || bodyClassList.contains("sapUiSizeCompact")) {
=======
		getContentDensityClass: function () {
			if (this.sContentDensityClass === undefined) {
				// eslint-disable-next-line sap-no-proprietary-browser-api
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
					this.sContentDensityClass = "";
				} else if (!Device.support.touch) {
					this.sContentDensityClass = "sapUiSizeCompact";
				} else {
					this.sContentDensityClass = "sapUiSizeCozy";
				}
			}
<<<<<<< HEAD

=======
>>>>>>> 6c45d41f0619ce90d569236455271090dcca39a2
			return this.sContentDensityClass;
		}
	});
});