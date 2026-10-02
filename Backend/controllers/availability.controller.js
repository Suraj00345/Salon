const { Staff, WorkingHour, Appointment, Service } = require("../models");

const calculateSlots = (
  startTime,
  endTime,
  duration,
  existingAppointments = [],
) => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  while (currentMinutes + duration <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const slotStart = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    const slotEndMinutes = currentMinutes + duration;
    const endHours = Math.floor(slotEndMinutes / 60);
    const endMins = slotEndMinutes % 60;
    const slotEnd = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;

    const isBooked = existingAppointments.some((appointment) => {
      const existingStart = appointment.startTime.slice(0, 5);
      const existingEnd = appointment.endTime.slice(0, 5);
      return slotStart < existingEnd && slotEnd > existingStart;
    });

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      available: !isBooked,
    });

    currentMinutes += duration;
  }

  return slots;
};

// CREATE / UPDATE SINGLE WORKING HOUR
const createWorkingHour = async (req, res) => {
  try {
    const { staffId, dayOfWeek, startTime, endTime, isAvailable } = req.body;

    if (!staffId || dayOfWeek === undefined) {
      return res.status(400).json({
        success: false,
        message: "staffId and dayOfWeek are required",
      });
    }

    const numDay = Number(dayOfWeek);
    if (numDay < 0 || numDay > 6) {
      return res.status(400).json({
        success: false,
        message: "dayOfWeek must be between 0 and 6",
      });
    }

    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    const active = isAvailable ?? true;
    const cleanStart = startTime ? startTime.slice(0, 5) : "09:00";
    const cleanEnd = endTime ? endTime.slice(0, 5) : "18:00";

    // Only validate time order if the staff member is actually working that day
    if (active && cleanStart >= cleanEnd) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    const [workingHour, created] = await WorkingHour.findOrCreate({
      where: { staffId, dayOfWeek: numDay },
      defaults: {
        staffId,
        dayOfWeek: numDay,
        startTime: cleanStart,
        endTime: cleanEnd,
        isAvailable: active,
      },
    });

    if (!created) {
      await workingHour.update({
        startTime: cleanStart,
        endTime: cleanEnd,
        isAvailable: active,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Working hour saved successfully",
      workingHour,
    });
  } catch (error) {
    console.error("Create Working Hour Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save working hour",
      error: error.message,
    });
  }
};

// GET AVAILABLE SLOTS
const getAvailableSlots = async (req, res) => {
  try {
    const { staffId, serviceId, date } = req.query;

    if (!staffId || !serviceId || !date) {
      return res.status(400).json({
        success: false,
        message: "staffId, serviceId and date are required",
      });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Split 'YYYY-MM-DD' directly into local date components to avoid timezone drift
    const [year, month, day] = date.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format (expected YYYY-MM-DD)",
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

    const appointments = await Appointment.findAll({
      where: {
        staffId,
        appointmentDate: date,
        status: ["pending", "confirmed"],
      },
    });

    const slots = calculateSlots(
      workingHour.startTime.slice(0, 5),
      workingHour.endTime.slice(0, 5),
      Number(service.duration),
      appointments,
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
