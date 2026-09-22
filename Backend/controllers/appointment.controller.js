const {
  Appointment,
  User,
  Staff,
  Service,
  Payment,
  sequelize,
} = require("../models");

const { sendBookingConfirmation } = require("../services/email.service");

// CREATE APPOINTMENT
const createAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;

    const { staffId, serviceId, appointmentDate, startTime, endTime, notes } =
      req.body;

    if (!staffId || !serviceId || !appointmentDate || !startTime || !endTime) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message:
          "staffId, serviceId, appointmentDate, startTime and endTime are required",
      });
    }

    const service = await Service.findByPk(serviceId);

    if (!service || !service.isActive) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Service not found or inactive",
      });
    }

    const staff = await Staff.findByPk(staffId);

    if (!staff || !staff.isActive) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Staff member not available",
      });
    }

    // Check whether the slot is already booked
    const existingAppointment = await Appointment.findOne({
      where: {
        staffId,
        appointmentDate,
        status: ["pending", "confirmed"],
        startTime: {
          [require("sequelize").Op.lt]: endTime,
        },
        endTime: {
          [require("sequelize").Op.gt]: startTime,
        },
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingAppointment) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    const appointment = await Appointment.create(
      {
        userId,
        staffId,
        serviceId,
        appointmentDate,
        startTime,
        endTime,
        notes,
        status: "pending",
        paymentStatus: "pending",
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    // Send email after successful DB transaction
    try {
      const user = await User.findByPk(userId);

      await sendBookingConfirmation({
        email: user.email,
        name: user.name,
        appointment,
        service,
        staff,
      });
    } catch (emailError) {
      console.error("Confirmation Email Error:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Create Appointment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

// GET MY APPOINTMENTS
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Service,
        },
        {
          model: Staff,
        },
      ],
      order: [
        ["appointmentDate", "DESC"],
        ["startTime", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("My Appointments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// GET APPOINTMENT BY ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: Service,
        },
        {
          model: Staff,
        },
        {
          model: User,
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Payment,
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Customer can only see own appointment
    if (
      req.user.role === "customer" &&
      appointment.userId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Appointment Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
};

// RESCHEDULE
const rescheduleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      req.user.role === "customer" &&
      appointment.userId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (["completed", "cancelled"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: "This appointment cannot be rescheduled",
      });
    }

    const { appointmentDate, startTime, endTime } = req.body;

    if (!appointmentDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "appointmentDate, startTime and endTime are required",
      });
    }

    const conflictingAppointment = await Appointment.findOne({
      where: {
        staffId: appointment.staffId,
        appointmentDate,
        status: ["pending", "confirmed"],
        startTime: {
          [require("sequelize").Op.lt]: endTime,
        },
        endTime: {
          [require("sequelize").Op.gt]: startTime,
        },
        id: {
          [require("sequelize").Op.ne]: appointment.id,
        },
      },
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: "Selected time slot is already booked",
      });
    }

    await appointment.update({
      appointmentDate,
      startTime,
      endTime,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Reschedule Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reschedule appointment",
      error: error.message,
    });
  }
};

// CANCEL APPOINTMENT
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      req.user.role === "customer" &&
      appointment.userId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (["completed", "cancelled"].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: "This appointment cannot be cancelled",
      });
    }

    await appointment.update({
      status: "cancelled",
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  rescheduleAppointment,
  cancelAppointment,
};
