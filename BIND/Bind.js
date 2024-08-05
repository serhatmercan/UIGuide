sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (BaseController, JSONModel, Filter, FilterOperator) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oViewModel = new JSONModel({
				Items: [],
				Value: ""
			});

			this.setModel(oViewModel, "model");

			this.getOwnerComponent().getModel().attachRequestCompleted(this.attachRequestCompleted.bind(this));
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched.bind(this));
		},

		onExit() {
			this.getModel().resetChanges();
			this.byId("SmartTable").rebindTable();
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACDialog() {
			const oModel = this.getModel();

			if (oModel.hasPendingChanges()) {
				oModel.resetChanges();
			}

			if (this.oDialog) {
				oModel.deleteCreatedEntry(this.oDialog.getBindingContext());

				this.oDialog.unbindElement();
				this.oDialog.close();
				this.oDialog.destroy();
				this.oDialog = null;
			}
		},

		onCheckBindingData() {
			const oModel = this.getModel();
			const oSmartForm = this.byId("SmartForm");

			if (oSmartForm.check().length) {
				return;
			}

			if (oModel.hasPendingChanges()) { }
		},

		onClearBindingData() {
			this.getView().bindElement(this.getModel().createEntry("/IDSet").getPath());
		},

		onClearBindingProperties() {
			const oModel = this.getModel();
			const aProperties = oModel.getMetaModel().getODataEntityType("ZXX_SRV.Material").property;

			aProperties.forEach(({ name, type }) => {
				let xValue;

				switch (type) {
					case "Edm.Boolean":
						xValue = false;
						break;
					case "Edm.DateTime":
						xValue = null;
						break;
					case "Edm.String":
						xValue = "";
						break;
					case "Edm.Time":
						xValue = {
							ms: 0,
							__edmType: "Edm.Time"
						};
						break;
				}

				oModel.setProperty(`${this.getView().getBindingContext().getPath()}/${name}`, xValue);
			});
		},

		onConfirmDialog() {
			const oSmartForm = sap.ui.core.Fragment.byId("Dialog", "SmartForm");

			if (oSmartForm.check().length > 0) {
				return;
			}

			const oData = oSmartForm.getBindingContext().getProperty();
		},

		onGetSetBindingData() {
			const oModel = this.getModel();
			const sBindingPath = this.getView().getBindingContext().getPath();

			oModel.setProperty(`${sBindingPath}/ID`, "X");
		},

		onReadBindingData() {
			const sPath = this.getModel().createKey("/IDSet", { ID: "X" });

			this.getView().bindElement({ path: sPath });
		},

		onRefreshRebindView() {
			const oView = this.getView();
			const sPath = this.getModel().createKey("/SFSet", { ID: "X" });

			oView.unbindElement();
			oView.bindElement({ path: sPath });
		},

		onShowDialog() {
			const oModel = this.getModel();
			const sPath = oModel.createEntry("/DialogSet").getPath();

			this.oDialog = sap.ui.xmlfragment("Dialog", "com.serhatmercan.view.fragment.Dialog", this);
			this.getView().addDependent(this.oDialog);

			this.oDialog.bindElement(sPath);
			sap.ui.core.Fragment.byId("Dialog", "SmartForm").bindElement(sPath);

			oModel.setProperty(`${sPath}/ID`, "X");

			this.oDialog.open();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		attachRequestCompleted() {
			setTimeout(() => {
				const oComboBox = this.byId("ComboBox");

				oComboBox.fireChange();
				oComboBox.getInnerControls()[0].getBinding("items").filter([
					new Filter("ID", FilterOperator.EQ, this.getModel().getProperty(`${this.getView().getBindingContext().getPath()}/ID`))
				]);
			}, 500);
		},

		change() {
			// Handle Change
		},

		clearView() {
			const oView = this.getView();
			const oBindingContext = oView.getBindingContext();
			const oModel = this.getModel();

			if (oBindingContext) {
				oView.unbindElement();
				oModel.deleteCreatedEntry(oBindingContext);
				oModel.resetChanges();
				oModel.refresh(true, true);
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		dataReceived() {
			const aData = this.getView().getElementBinding().getBoundContext().getObject().to_Header.__list;
		},

		getMyComponent() {
			const sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			return sap.ui.component(sComponentId);
		},

		getData(oEvent) {
			const oBindingContext = this.getView().getBindingContext();
			const oData = oBindingContext.getObject();
			const oDataID = oBindingContext.getObject("ID");
			const oDataX = this.getModel().getProperty(oBindingContext.getPath());
			const oDataXID = this.getModel().getProperty(`${oBindingContext.getPath()}/ID`);
		},

		getPath(oEvent) {
			// From Model
			const sPath = oEvent.getSource().getParent().getBindingContext("model").getPath();

			// From Input Model
			const sValuePath = oEvent.getSource().getBindingInfo("value").binding.getPath();

			// From View I
			const oView = this.getView();
			const sBindingPath = oView.getBindingContext().getPath();
			const sData = oView.getModel().getProperty(`${sPath}/Data`);

			// From View II
			const oObject = this.getView().getBindingContext().getObject();
		},

		async patternMatched(oEvent) {
			const oView = this.getView();
			const oModel = this.getModel();
			const oViewModel = this.getModel("model");
			const oTable = this.byId("Table");
			const oExpand = { "$expand": "Header,Items" };

			this.clearView();

			this.oStartupParameters = this.getMyComponent().getComponentData().startupParameters;

			if (this.oStartupParameters.ID && this.oStartupParameters.ID !== "") {
				// Handle Startup Parameters
			}

			await this.getOwnerComponent().getModel().metadataLoaded();

			const oCreateEntry = this.getModel().createEntry("/IDSet");

			this.byId("SimpleForm").bindElement(oCreateEntry.getPath());

			oModel.setProperty(`${oCreateEntry.getPath()}/ID`, "X");
			oModel.setProperty(`${oCreateEntry.getPath()}/Date`, new Date());
			oModel.setProperty(`${oCreateEntry.getPath()}/Time`, {
				__edmType: "Edm.Time",
				ms: new Date().getTime()
			});

			const sPath = oModel.createKey("/SFSet", { ID: "X" });

			oView.bindElement({
				path: sPath,
				parameters: { oExpand },
				events: {
					change: oEvent => {
						const aItemPaths = oEvent.getSource().getBoundContext().getObject().to_Items.__list;
						const aItems = aItemPaths.map(oItemPath => {
							const oItem = oModel.getProperty(`/${oItemPath}`);
							delete oItem.__metadata;
							return oItem;
						});
					},
					change: this.change.bind(this),
					dataReceived: this.dataReceived.bind(this),
					dataReceived: () => {
						sap.ui.core.BusyIndicator.hide();
					},
					dataRequested: this.dataRequested.bind(this),
					dataRequested: () => {
						sap.ui.core.BusyIndicator.show();
					}
				}
			});

			oTable.rebindTable();
		},

		viewBind() {
			const oModel = this.getModel();
			const oView = this.getView();
			const sPath = oModel.createKey("/...Set", { ID: "X" });

			if (oView.getBindingContext()) {
				oView.unbindElement();
				oModel.refresh(true, true);
			}

			oView.bindElement({
				path: sPath,
				events: {
					dataReceived: oEvent => {
						const oData = oEvent.getSource().getBoundContext().getObject();
					}
				}
			});
		}

	});

});
