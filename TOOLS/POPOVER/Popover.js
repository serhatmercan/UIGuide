sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/Button",
	"sap/m/Image",
	"sap/m/Popover",
	"sap/m/PlacementType",
	"sap/m/Toolbar",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], (BaseController, Button, Image, Popover, PlacementType, Toolbar, JSONModel, Fragment) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Busy: false,
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onClose(oEvent) {
			oEvent.getSource().getParent().getParent().close();
		},

		onShowPopover(oEvent) {
			this.showPopover(oEvent, "PopoverID", "Popover");
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		createPopover() {
			if (!this.oPopover) {
				const oPlacementType = new PlacementType;

				this.oPopover = new Popover({
					placement: oPlacementType.Bottom,
					enableScrolling: false,
					modal: true,
					showHeader: false
				});

				this.oPopover.addStyleClass("sapUiContentPadding");

				this.oPopover.setFooter(
					new Toolbar.addContent(
						new Button({
							text: "Close",
							press: () => this.oPopover.close()
						})
					)
				);

				this.oImage = new Image({
					width: "5rem",
					densityAware: false
				});

				this.oPopover.addContent(this.oImage);
			}

			if (!this.oPopover.isOpen()) {
				this.oImage.setSrc("./..url");
				this.oPopover.openBy(oEvent.getSource());
			}
		},

		showPopover(oEvent, sDialogID, sName) {
			const oSource = oEvent.getSource();
			const oView = this.getView();
			let oDialog = this.byId(sDialogID);

			if (!oDialog) {
				Fragment.load({
					id: oView.getId(),
					name: `com.serhatmercan.fragment.dialog.${sName}`,
					controller: this
				}).then((oPopover) => {
					oView.addDependent(oPopover);
					oPopover.openBy(oSource);
				});
			} else {
				oDialog.openBy(oSource);
			}
		}

	});

});