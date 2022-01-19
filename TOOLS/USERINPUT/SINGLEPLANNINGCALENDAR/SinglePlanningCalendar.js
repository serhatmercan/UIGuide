sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/unified/library"
], function (Controller, JSONModel, unifiedLibrary) {
	"use strict";

	const oCalendarDayType = unifiedLibrary.CalendarDayType;

	return Controller.extend("com.sm.SinglePlanningCalendar.controller.Main", {
		onInit: function () {
			this.getView().setModel(
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
				}), "viewModel"
			);
		},

		onAppointmentCreate: function (oEvent) {
			const oViewModel = this.getView().getModel("viewModel");
			const aAppointments = oViewModel.getProperty("/Appointments");

			aAppointments.push({
				Title: "New Appointment",
				StartDate: oEvent.getParameter("startDate"),
				EndDate: oEvent.getParameter("endDate")
			});

			oViewModel.setProperty("/Appointments", aAppointments);
			oViewModel.updateBindings();
		},

		onAppointmentDrop: function (oEvent) {
			const oAppointment = oEvent.getParameter("appointment");
			const oStartDate = oEvent.getParameter("startDate");
			const oEndDate = oEvent.getParameter("endDate");
			const oViewModel = this.getView().getModel("viewModel");
			const aAppointments = oViewModel.getProperty("/Appointments");

			if (oEvent.getParameter("copy")) {
				aAppointments.push({
					Title: oAppointment.getTitle(),
					Icon: oAppointment.getIcon(),
					Text: oAppointment.getText(),
					Type: oAppointment.getType(),
					StartDate: oStartDate,
					EndDate: oEndDate
				});
				oViewModel.setProperty("/Appointments", aAppointments);
				oViewModel.updateBindings();
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
			const oViewModel = this.getView().getModel("viewModel");

			if ((!oAppointment || !oAppointment.getSelected())) {
				return;
			}

			this._sPath = oAppointment.getBindingContext("viewModel").getPath();

			oViewModel.setProperty("/Mode", "UA");
			oViewModel.setProperty("/Appointment", {
				Title: oAppointment.getTitle(),
				Text: oAppointment.getText(),
				Type: oAppointment.getType(),
				StartDate: oAppointment.getStartDate(),
				EndDate: oAppointment.getEndDate()
			});

			this.onShowAppointment();
		},

		onCloseAppointmentDialog: function () {
			this._oAppointment.close();
			this._oAppointment.destroy();
			this._oAppointment = null;
			this._sPath = "";
		},

		onCreateAppointment: function () {
			const oViewModel = this.getView().getModel("viewModel");

			oViewModel.setProperty("/Appointment", {
				Title: "",
				Text: "",
				Type: oCalendarDayType.Type01,
				StartDate: new Date(),
				EndDate: new Date()
			});
			oViewModel.setProperty("/Mode", "CA");

			this.onShowAppointment();
		},

		onDeleteAppointment: function () {
			const oViewModel = this.getView().getModel("viewModel");
			const aAppointments = oViewModel.getProperty("/Appointments");

			aAppointments.splice(this._sPath.split("/")[this._sPath.split("/").length - 1], 1);

			oViewModel.setProperty("/Appointments", aAppointments);
			oViewModel.updateBindings();

			this.onCloseAppointmentDialog();
		},

		onSaveAppointment: function () {
			const oViewModel = this.getView().getModel("viewModel");
			const oAppointment = oViewModel.getProperty("/Appointment");
			const aAppointments = oViewModel.getProperty("/Appointments");

			if (oViewModel.getProperty("/Mode") === "CA") {
				aAppointments.push(oAppointment);
				oViewModel.setProperty("/Appointments", aAppointments);
			} else {
				oViewModel.setProperty(this._sPath + "/", oAppointment);
			}

			oViewModel.updateBindings();

			this.onCloseAppointmentDialog();
		},

		onShowAppointment: function () {
			this._oAppointment = sap.ui.xmlfragment(this.getView().getId(), "com.sm.SinglePlanningCalendar.Appointment", this);
			this._oAppointment.setModel(this.getView().getModel("viewModel"), "viewModel");
			this._oAppointment.open();
		},

		formatDate: function (sDate) {
			return new Date(sDate);
		}
	});
});