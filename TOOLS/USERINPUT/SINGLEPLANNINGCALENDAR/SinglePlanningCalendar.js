sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/unified/library"
], function (Controller, JSONModel, unifiedLibrary) {
	"use strict";

	const oCalendarDayType = unifiedLibrary.CalendarDayType;

	return Controller.extend("com.sm.SinglePlanningCalendar.controller.Main", {
		
		/* ================= */
		/* Lifecycle Methods */
		/* ================= */
		
		onInit: function () {
			this.setModel(
				new JSONModel({
					"Appointment": {
						"Title": "",
						"Text": "",
						"Type": oCalendarDayType.Type01,
						"StartDate": new Date(),
						"EndDate": new Date()
					},
					"Appointments": [{
						"Title": "Meeting",
						"Text": "Online",
						"Type": oCalendarDayType.Type01,
						"Icon": "sap-icon://meeting-room",
						"StartDate": new Date("2022-01-12T09:00:00"),
						"EndDate": new Date("2022-01-12T10:00:00")
					}, {
						"Title": "Lunch",
						"Text": "Canteen",
						"Type": oCalendarDayType.Type02,
						"Icon": "sap-icon://meal",
						"StartDate": new Date("2022-01-12T12:00:00"),
						"EndDate": new Date("2022-01-12T13:00:00")
					}, {
						"Title": "Rest",
						"Text": "Home",
						"Type": oCalendarDayType.Type03,
						"Icon": "sap-icon://home",
						"StartDate": new Date("2022-01-12T18:00:00"),
						"EndDate": new Date("2022-01-12T20:00:00")
					}],
					"Mode": "CA"
				}), "model"
			);
		},

		/* ============== */
		/* Event Handlers */
		/* ============== */

		onACAppointmentDialog: function () {
			this.oAppointment.close();
			this.oAppointment.destroy();
			this.oAppointment = null;
			this.sPath = "";
		},

		onAppointmentCreate: function (oEvent) {
			const oModel = this.getView().getModel("model");
			const aAppointments = oModel.getProperty("/Appointments");

			aAppointments.push({
				Title: "New Appointment",
				StartDate: oEvent.getParameter("startDate"),
				EndDate: oEvent.getParameter("endDate")
			});

			oModel.setProperty("/Appointments", aAppointments);
			oModel.updateBindings();
		},

		onAppointmentDrop: function (oEvent) {
			const oAppointment = oEvent.getParameter("appointment");
			const oStartDate = oEvent.getParameter("startDate");
			const oEndDate = oEvent.getParameter("endDate");
			const oModel = this.getView().getModel("model");
			const aAppointments = oModel.getProperty("/Appointments");

			if (oEvent.getParameter("copy")) {
				aAppointments.push({
					Title: oAppointment.getTitle(),
					Icon: oAppointment.getIcon(),
					Text: oAppointment.getText(),
					Type: oAppointment.getType(),
					StartDate: oStartDate,
					EndDate: oEndDate
				});
				oModel.setProperty("/Appointments", aAppointments);
				oModel.updateBindings();
			} else {
				oAppointment.setStartDate(oStartDate);
				oAppointment.setEndDate(oEndDate);
			}
		},

		onAppointmentResize: function (oEvent) {
			const oAppointment = oEvent.getParameter("appointment");

			oAppointment.setStartDate(oEvent.getParameter("startDate"));
			oAppointment.setEndDate(oEvent.getParameter("endDate"));
		},

		onAppointmentSelect: function (oEvent) {
			const oAppointment = oEvent.getParameter("appointment");
			const oModel = this.getModel("model");

			if ((!oAppointment || !oAppointment.getSelected())) {
				return;
			}

			this.sPath = oAppointment.getBindingContext("model").getPath();

			oModel.setProperty("/Mode", "UA");
			oModel.setProperty("/Appointment", {
				Title: oAppointment.getTitle(),
				Text: oAppointment.getText(),
				Type: oAppointment.getType(),
				StartDate: oAppointment.getStartDate(),
				EndDate: oAppointment.getEndDate()
			});

			this.onShowAppointment();
		},	

		onCreateAppointment: function () {
			const oModel = this.getModel("model");

			oModel.setProperty("/Appointment", {
				Title: "",
				Text: "",
				Type: oCalendarDayType.Type01,
				StartDate: new Date(),
				EndDate: new Date()
			});
			oModel.setProperty("/Mode", "CA");

			this.onShowAppointment();
		},

		onDeleteAppointment: function () {
			const oModel = this.getModel("model");
			const aAppointments = oModel.getProperty("/Appointments");

			aAppointments.splice(this.sPath.split("/")[this.sPath.split("/").length - 1], 1);

			oModel.setProperty("/Appointments", aAppointments);
			oModel.updateBindings();

			this.onCloseAppointmentDialog();
		},

		onSaveAppointment: function () {
			const oModel = this.getModel("model");
			const oAppointment = oModel.getProperty("/Appointment");
			const aAppointments = oModel.getProperty("/Appointments");

			if (oModel.getProperty("/Mode") === "CA") {
				aAppointments.push(oAppointment);
				oModel.setProperty("/Appointments", aAppointments);
			} else {
				oModel.setProperty(this._sPath + "/", oAppointment);
			}

			oModel.updateBindings();

			this.onCloseAppointmentDialog();
		},

		onShowAppointment: function () {
			this.oAppointment = sap.ui.xmlfragment(this.getView().getId(), "com.sm.SinglePlanningCalendar.Appointment", this);
			this.oAppointment.setModel(this.getView().getModel("model"), "model");
			this.oAppointment.open();
		},

		/* ================ */
		/* Internal Methods */
		/* ================ */

		formatDate: function (sDate) {
			return new Date(sDate);
		}

	});
});