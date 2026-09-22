const { User, Service, Staff, Appointment, Payment } = require("../models");
const { Op } = require("sequelize");

// GET USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Admin Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// UPDATE USER STATUS
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    await user.update({
      isActive,
    });

    return res.status(200).json({
      success: true,
      message: "User status updated",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update User Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

// GET ALL APPOINTMENTS
const getAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (date) {
      where.appointmentDate = date;
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Staff,
        },
        {
          model: Service,
        },
        {
          model: Payment,
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
    console.error("Admin Appointments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// UPDATE APPOINTMENT STATUS
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    await appointment.update({
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};

// DASHBOARD STATS
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalServices,
      totalStaff,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      User.count({
        where: {
          role: "customer",
        },
      }),

      Service.count({
        where: {
          isActive: true,
        },
      }),

      Staff.count({
        where: {
          isActive: true,
        },
      }),

      Appointment.count(),

      Appointment.count({
        where: {
          status: "pending",
        },
      }),

      Appointment.count({
        where: {
          status: "completed",
        },
      }),

      Appointment.count({
        where: {
          status: "cancelled",
        },
      }),
    ]);

    const payments = await Payment.findAll({
      where: {
        status: "paid",
      },
      attributes: ["amount"],
    });

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalServices,
        totalStaff,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  updateUserStatus,
  getAppointments,
  updateAppointmentStatus,
  getDashboardStats,
};
