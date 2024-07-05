sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit: function () {
			const oModel = new JSONModel({
				Busy: false,
				GanttData: []
			});

			this.setModel(oModel, "model");
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGCShapePress: function (oEvent) {
			const sPath = oEvent.getParameter("shape").getBindingContext("model").getPath();
		},

		onGCShapeDrop: function (oEvent) {
			const oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
			const oViewModel = this.getModel("model");
			const sShapeId = oEvent.getParameter("lastDraggedShapeUid");
			const oShapeInfo = Utility.parseUid(sShapeId);
			const sPath = oShapeInfo.shapeDataName;
			const oNewDateTime = oEvent.getParameter("newDateTime");
			const oOldTimes = oDraggedShapeDates[sShapeId];
			const iTimeDiff = oNewDateTime.getTime() - oOldTimes.time.getTime();

			oViewModel.setProperty(sPath + "/StartTime", new Date(oOldTimes.time.getTime() + iTimeDiff));
			oViewModel.setProperty(sPath + "/EndTime", new Date(oOldTimes.endTime.getTime() + iTimeDiff));
		},

		onGCShapeResize: function (oEvent) {
			const oShape = oEvent.getParameter("shape");
			const aNewTimes = oEvent.getParameter("newTime");

			oShape.setTime(aNewTimes[0]);
			oShape.setEndTime(aNewTimes[1]);
		},

		onShowDetailGC: function () {
			const sUID = this.byId("GCTable").getSelectedShapeUid();

			if (sUID.length === 0) {
				MessageToast.show(this.getText("checkColumn"));
				return;
			}

			const sPath = Utility.parseUid(sUID).shapeDataName;

			this.openDialog("DialogChartDetail", "serhatmercan.ChartDetail").then((oDialog) => {
				oDialog.bindElement({
					path: "model>" + sPath
				});
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		setGanttChartData: function () {
			const oViewModel = this.getModel("model");
			const aHeader = oData.to_Top.results;
			const aDetail = oData.to_Detail.results;
			const oGanttData = {
				Children: []
			};

			const aGanttHeader = aHeader.map(item => {
				return {
					FasonAdi: item.FasonAdi,
					FasonTanim: item.FasonTanim,
					BantNo: item.BantNo,
					Msgty: item.Msgty
				};
			}).filter((v, i, a) => a.findIndex(t => (t.FasonAdi === v.FasonAdi && t.BantNo === v.BantNo)) === i);

			aGanttHeader.forEach(oHeader => {
				let aFilteredData = aHeader.filter(oItem => oItem.FasonAdi === oHeader.FasonAdi && oItem.BantNo === oHeader.BantNo);
				let aDuplicateTime = aFilteredData.map(item => {
					return {
						BasZaman: item.BasZaman,
						BitZaman: item.BitZaman
					};
				}).filter((v, i, a) => a.findIndex(t => (t.BasZaman === v.BasZaman && t.BitZaman === v.BitZaman)) === i);
				let oProduction = {
					Manufacturer: oHeader.FasonAdi,
					ManufacturerDesc: oHeader.FasonTanim,
					BandNo: oHeader.BantNo,
					Msgty: aFilteredData.some(oItem => oItem.Msgty === "E") ? "E" : "",
					Children: [],
					SubTask: []
				};

				if (aFilteredData.length === aDuplicateTime.length) {
					aFilteredData.forEach(oFilteredData => {
						oProduction.SubTask.push({
							StartTime: oFilteredData.BasZaman,
							EndTime: oFilteredData.BitZaman,
							PlanNo: oFilteredData.PlanNo,
							MainOrder: oFilteredData.MusteriAnaSipMult,
							Model: oFilteredData.Model,
							ModelName: oFilteredData.ModelAdi,
							Variant: oFilteredData.Varyant,
							Msgty: oFilteredData.Msgty,
							Explanation: oFilteredData.Aciklama,
							ReservationNo: oFilteredData.RezervasyonNo,
							Display: oFilteredData.Gosterim,
							Customer: oFilteredData.Musteri,
							CustomerName: oFilteredData.MusteriAdi,
							Detail: aDetail.filter(oDetail => oDetail.BantNo === oFilteredData.BantNo && oDetail.FasonAdi === oFilteredData.FasonAdi &&
								oDetail.PlanNo === oFilteredData.PlanNo)
						});
					});
					oGanttData.Children.push(oProduction);
				} else {
					aFilteredData.forEach(oFilteredData => {
						oProduction.Children.push({
							PlanNo: oFilteredData.PlanNo,
							Msgty: oFilteredData.Msgty,
							SubTask: [{
								StartTime: oFilteredData.BasZaman,
								EndTime: oFilteredData.BitZaman,
								PlanNo: oFilteredData.PlanNo,
								MainOrder: oFilteredData.MusteriAnaSipMult,
								Model: oFilteredData.Model,
								ModelName: oFilteredData.ModelAdi,
								Variant: oFilteredData.Varyant,
								Msgty: oFilteredData.Msgty,
								Explanation: oFilteredData.Aciklama,
								ReservationNo: oFilteredData.RezervasyonNo,
								Display: oFilteredData.Gosterim,
								Customer: oFilteredData.Musteri,
								CustomerName: oFilteredData.MusteriAdi,
								Detail: aDetail.filter(oDetail => oDetail.BantNo === oFilteredData.BantNo && oDetail.FasonAdi === oFilteredData.FasonAdi &&
									oDetail.PlanNo === oFilteredData.PlanNo)
							}]
						});
					});
					oGanttData.Children.push(oProduction);
				}
			});

			oViewModel.setProperty("/GanttData", oGanttData);

			this.byId("GCTable").setWidth("auto");
		}

	});

});