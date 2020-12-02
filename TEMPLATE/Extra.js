		onVHLot: function () {
				if (!this._VHLot) {
					this._VHLot = sap.ui.xmlfragment("idVHLot", "com.sun.ppcolorplanningshifting.view.fragment.valueHelp.Lot",
						this);

					let oSmartFilterPC = sap.ui.core.Fragment.byId("idVHLot", "idSFBLot"),
						oSmartTablePC = sap.ui.core.Fragment.byId("idVHLot", "idSTLot");

					oSmartTablePC.setSmartFilterId(oSmartFilterPC.getId());

					this._VHLot.setModel(this.getModel("i18n"), "i18n");
					this._VHLot.setModel(this.getModel());
					this.getView().addDependent(this._VHLot);
				}
				this._VHLot.open();
			},

			onSelectLot: function (oEvent) {
				let sPath = oEvent.getSource().getBindingContextPath(),
					sLot = this.getModel().getProperty(sPath + "/ProjeKodu"),
					oModel = this.getView().getModel("lotModel");

				oModel.setProperty("/LotTarget", sLot);

				this.onCloseLotVH();
			},

			onCloseLotVH: function () {
				this._VHLot.close();
				this._VHLot.destroy();
				this._VHLot = null;
			}