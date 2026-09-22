const {
  Staff,
  WorkingHour,
  Appointment,
  Service,
} = require("../models");

const calculateSlots = (
  startTime,
  endTime,
  duration,
  existingAppointments = []
) => {
  const slots = [];

  const [startHour, startMinute] = startTime
    .split(":")
    .map(Number);

  const [endHour, endMinute] = endTime
    .split(":")
    .map(Number);

  let currentMinutes =
    startHour * 60 + startMinute;

  const endMinutes =
    endHour * 60 + endMinute;

  while (currentMinutes + duration <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;

    const slotStart = `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}`;

    const slotEndMinutes = currentMinutes + duration;

    const endHours = Math.floor(slotEndMinutes / 60);
    const endMins = slotEndMinutes % 60;

    const slotEnd = `${String(endHours).padStart(
      2,
      "0"
    )}:${String(endMins).padStart(2, "0")}`;

    const isBooked = existingAppointments.some(
      (appointment) => {
        const existingStart =
          appointment.startTime.slice(0, 5);

        const existingEnd =
          appointment.endTime.slice(0, 5);

        return (
          slotStart < existingEnd &&
          slotEnd > existingStart
        );
      }
    );

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      available: !isBooked,
    });

    currentMinutes += duration;
  }

  return slots;
};


// CREATE WORKING HOUR
const createWorkingHour = async (req, res) => {
  try {
    const {
      staffId,
      dayOfWeek,
      startTime,
      endTime,
      isAvailable,
    } = req.body;

    if (
      !staffId ||
      dayOfWeek === undefined ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "staffId, dayOfWeek, startTime and endTime are required",
      });
    }

    const staff = await Staff.findByPk(staffId);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    const workingHour = await WorkingHour.create({
      staffId,
      dayOfWeek,
      startTime,
      endTime,
      isAvailable: isAvailable ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Working hour created",
      workingHour,
    });
  } catch (error) {
    console.error("Create Working Hour Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create working hour",
      error: error.message,
    });
  }
};


// GET AVAILABLE SLOTS
const getAvailableSlots = async (req, res) => {
  try {
    const {
      staffId,
      serviceId,
      date,
    } = req.query;

    if (!staffId || !serviceId || !date) {
      return res.status(400).json({
        success: false,
        message:
          "staffId, serviceId and date are required",
      });
    }

    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    const dayOfWeek = selectedDate.getDay();

    const workingHour = await WorkingHour.findOne({
      where: {
        staffId,
        dayOfWeek,
        isAvailable: true,
      },
    });

    if (!workingHour) {
      return res.status(200).json({
        success: true,
        message: "Staff is not available on this day",
        slots: [],
      });
    }

    const appointments =
      await Appointment.findAll({
        where: {
          staffId,
          appointmentDate: date,
          status: [
            "pending",
            "confirmed",
          ],
        },
      });

    const slots = calculateSlots(
      workingHour.startTime,
      workingHour.endTime,
      Number(service.duration),
      appointments
    );

    return res.status(200).json({
      success: true,
      date,
      staffId,
      serviceId,
      slots,
    });
  } catch (error) {
    console.error("Available Slots Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to calculate available slots",
      error: error.message,
    });
  }
};

module.exports = {
  createWorkingHour,
  getAvailableSlots,
};