sap.ui.define([
	"com/serhatmercan/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], (BaseController, MessageToast, JSONModel) => {
	"use strict";

	return BaseController.extend("com.serhatmercan.Controller", {

		/* ================= */
		/* Lifecycle Methods */
		/* ================= */

		onInit() {
			const oModel = new JSONModel({
				Busy: false,
				GanttData: []
			});

			this.setModel(oModel, "model");
			this.getRouter().getRoute("main").attachPatternMatched(this.patternMatched, this);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onGCShapePress(oEvent) {
			const sPath = oEvent.getParameter("shape").getBindingContext("model").getPath();
		},

		onGCShapeDrop(oEvent) {
			const oDraggedShapeDates = oEvent.getParameter("draggedShapeDates");
			const oViewModel = this.getModel("model");
			const sShapeID = oEvent.getParameter("lastDraggedShapeUid");
			const oShapeInfo = Utility.parseUid(sShapeID);
			const sPath = oShapeInfo.shapeDataName;
			const oNewDateTime = oEvent.getParameter("newDateTime");
			const oOldTimes = oDraggedShapeDates[sShapeID];
			const iTimeDiff = oNewDateTime.getTime() - oOldTimes.time.getTime();
			const dStartTime = new Date(oOldTimes.time.getTime() + iTimeDiff);
			const dEndTime = new Date(oOldTimes.endTime.getTime() + iTimeDiff);

			oViewModel.setProperty(`${sPath}/StartTime`, dStartTime);
			oViewModel.setProperty(`${sPath}/EndTime`, dEndTime);
		},

		onGCShapeResize(oEvent) {
			const oShape = oEvent.getParameter("shape");
			const [newStartTime, newEndTime] = oEvent.getParameter("newTime");

			oShape.setTime(newStartTime);
			oShape.setEndTime(newEndTime);
		},

		onShowDetailGC() {
			const sUID = this.byId("GCTable").getSelectedShapeUid();

			if (!sUID.length) {
				MessageToast.show(this.getText("checkColumn"));
				return;
			}

			const sPath = Utility.parseUid(sUID).shapeDataName;

			this.openDialog("DialogChartDetail", "serhatmercan.ChartDetail").then(oDialog => {
				oDialog.bindElement({
					path: `model>${sPath}`
				});
			});
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		setGanttChartData() {
			const oViewModel = this.getModel("model");
			const aHeader = oData?.to_Top?.results;
			const aDetail = oData?.to_Detail?.results;
			const aGanttHeader = [...new Set(aHeader.map(({ FasonAdi, FasonTanim, BantNo, Msgty }) => ({
				FasonAdi, FasonTanim, BantNo, Msgty
			})))];
			const oGanttData = {
				Children: aGanttHeader.map(oHeader => {
					const aFilteredData = aHeader.filter(oItem => oItem.FasonAdi === oHeader.FasonAdi && oItem.BantNo === oHeader.BantNo);
					const aDuplicateTimes = [...new Set(aFilteredData.map(({ BasZaman, BitZaman }) => ({
						BasZaman, BitZaman
					})))];

					const oProduction = {
						Manufacturer: oHeader.FasonAdi,
						ManufacturerDesc: oHeader.FasonTanim,
						BandNo: oHeader.BantNo,
						Msgty: aFilteredData.some(oItem => oItem.Msgty === "E") ? "E" : "",
						Children: [],
						SubTask: []
					};

					aFilteredData.forEach(oFilteredData => {
						const oSubTask = {
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
							Detail: aDetail.filter(oDetail => oDetail.BantNo === oFilteredData.BantNo && oDetail.FasonAdi === oFilteredData.FasonAdi && oDetail.PlanNo === oFilteredData.PlanNo)
						};

						if (aFilteredData.length === aDuplicateTimes.length) {
							oProduction.SubTask.push(oSubTask);
						} else {
							oProduction.Children.push({ ...oSubTask, SubTask: [oSubTask] });
						}
					});

					return oProduction;
				})
			};

			oViewModel.setProperty("/GanttData", oGanttData);
			this.byId("GCTable").setWidth("auto");
		}

	});

});