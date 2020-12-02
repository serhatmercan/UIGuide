"sap/m/TextArea",
"sap/m/Button",
"sap/m/ButtonType"

var oDialog = new Dialog({
	title: "Dialog Title",
	type: "Message",
	content: [
		new TextArea("dialogTextArea", {
			liveChange: function (oEvent) {
				var sText = oEvent.getParameter("value"),
					oParent = oEvent.getSource().getParent();
				// Set Button Enable
				oParent.getBeginButton().setEnabled(sText.length > 0);
			},
			width: "100%",
			placeholder: "Placeholder"
		})
	],
	beginButton: new Button({
		type: ButtonType.Emphasized,
		text: "OK",
		enabled: false,
		press: function () {
			var sText = sap.ui.getCore().byId("submitDialogTextarea").getValue();
			// Call Function
			oDialog.close();
		}
	}),
	endButton: new Button({
		text: "Cancel",
		press: function () {
			oDialog.close();
		}
	}),
	afterClose: function () {
		oDialog.destroy();
	}
});

oDialog.open();