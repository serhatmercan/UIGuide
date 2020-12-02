// XML //
busy = "{viewModel>/Busy}"
enabled = "{=$ !{viewModel>/Busy}}"

// onInit //
this.getView().setModel(new JSONModel({
	Busy: false
}), "viewModel");

// GW //
let that = this;

this.getModel("viewModel").setProperty("/Busy", true);
this.getModel("viewModel").setProperty("/Busy", false);

that.getModel("viewModel").setProperty("/Busy", false);
that.getModel("viewModel").getProperty("/Busy") ? false : true;