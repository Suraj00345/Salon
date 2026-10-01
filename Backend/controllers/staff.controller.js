const {
  Staff,
  Service,
  StaffService,
  WorkingHour,
  Appointment,
  User,
  Payment,
} = require("../models");

const { Op } = require("sequelize");

// CREATE STAFF
const createStaff = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const existingStaff = await Staff.findOne({
      where: { email },
    });

    if (existingStaff) {
      return res.status(409).json({
        success: false,
        message: "Staff member already exists with this email",
      });
    }

    const staff = await Staff.create({
      name,
      email,
      phone,
      specialization,
      experience,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Staff created successfully",
      staff,
    });
  } catch (error) {
    console.error("Create Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create staff",
      error: error.message,
    });
  }
};

// GET ALL STAFF
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      where: {
        isActive: true,
      },
      include: [
        {
          model: Service,
          as: "services",
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error("Get Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};

// GET STAFF BY ID
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      include: [
        {
          model: Service,
          as: "services",
          through: {
            attributes: [],
          },
        },
        {
          model: WorkingHour,
          as: "workingHours",
        },
      ],
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    return res.status(200).json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error("Get Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};

// UPDATE OWN STAFF PROFILE
const updatedStaff = async (req, res) => {
  try {
    // Get staff ID from JWT
    const staffId = req.user.staffId;

    if (!staffId) {
      return res.status(403).json({
        success: false,
        message: "Staff ID is missing from authentication token",
      });
    }

    // Find logged-in staff member
    const staff = await Staff.findByPk(staffId);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    // Staff can update only these fields
    const { name, email, phone, specialization, experience } = req.body;

    // Check email conflict
    if (email && email !== staff.email) {
      const emailExists = await Staff.findOne({
        where: {
          email,
          id: {
            [Op.ne]: staffId,
          },
        },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another staff member",
        });
      }
    }

    // Update profile
    await staff.update({
      name: name ?? staff.name,
      email: email ?? staff.email,
      phone: phone ?? staff.phone,
      specialization: specialization ?? staff.specialization,
      experience: experience ?? staff.experience,
    });

    // Reload with assigned services
    await staff.reload({
      include: [
        {
          model: Service,
          as: "services",
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Staff profile updated successfully",
      staff,
    });
  } catch (error) {
    console.error("Update Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update staff profile",
      error: error.message,
    });
  }
};
// DELETE STAFF (SOFT DELETE)
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    await staff.update({
      isActive: false,
    });

    return res.status(200).json({
      success: true,
      message: "Staff removed successfully",
    });
  } catch (error) {
    console.error("Delete Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove staff",
      error: error.message,
    });
  }
};

// ASSIGN SERVICE TO STAFF
const assignService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const { id: staffId } = req.params;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "serviceId is required",
      });
    }

    const [staff, service] = await Promise.all([
      Staff.findByPk(staffId),
      Service.findByPk(serviceId),
    ]);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const alreadyAssigned = await StaffService.findOne({
      where: {
        staffId,
        serviceId,
      },
    });

    if (alreadyAssigned) {
      return res.status(409).json({
        success: false,
        message: "Service already assigned to this staff member",
      });
    }

    const assignment = await StaffService.create({
      staffId,
      serviceId,
    });

    return res.status(201).json({
      success: true,
      message: "Service assigned successfully",
      assignment,
    });
  } catch (error) {
    console.error("Assign Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign service",
      error: error.message,
    });
  }
};

// REMOVE SERVICE FROM STAFF
const removeService = async (req, res) => {
  try {
    const { id: staffId, serviceId } = req.params;

    const record = await StaffService.findOne({
      where: { staffId, serviceId },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Service assignment not found",
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Service unassigned successfully",
    });
  } catch (error) {
    console.error("Remove Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unassign service",
      error: error.message,
    });
  }
};

// GET STAFF DASHBOARD
const getStaffDashboard = async (req, res) => {
  try {
    const staff = await Staff.findOne({ where: { userId: req.user.id } });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "No staff profile associated with this account.",
      });
    }

    const staffId = staff.id;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is missing from authentication token",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const [
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
    ] = await Promise.all([
      Appointment.count({
        where: {
          staffId,
        },
      }),

      Appointment.count({
        where: {
          staffId,
          appointmentDate: today,
        },
      }),

      Appointment.count({
        where: {
          staffId,
          status: "pending",
        },
      }),

      Appointment.count({
        where: {
          staffId,
          status: "confirmed",
        },
      }),

      Appointment.count({
        where: {
          staffId,
          status: "completed",
        },
      }),

      Appointment.count({
        where: {
          staffId,
          status: "cancelled",
        },
      }),
    ]);

    const todayAppointmentsList = await Appointment.findAll({
      where: {
        staffId,
        appointmentDate: today,
        status: {
          [Op.in]: ["pending", "confirmed"],
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "price", "duration"],
        },
      ],
      order: [["startTime", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
      },
      todayAppointments: todayAppointmentsList,
    });
  } catch (error) {
    console.error("Staff Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff dashboard",
      error: error.message,
    });
  }
};

// GET STAFF APPOINTMENT
const getStaffAppointments = async (req, res) => {
  try {
    const staffId = req.user.staffId;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is missing from authentication token",
      });
    }

    const { status, date } = req.query;

    const where = {
      staffId,
    };

    if (status) {
      const allowedStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment status",
        });
      }

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
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "price", "duration"],
        },
        {
          model: Payment,
          as: "payments",
        },
      ],
      order: [
        ["appointmentDate", "DESC"],
        ["startTime", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Staff Appointments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff appointments",
      error: error.message,
    });
  }
};

// UPDATE STAFF APPOINTMENT STATUS
const updateStaffAppointmentStatus = async (req, res) => {
  try {
    const staffId = req.user.staffId;
    const appointmentId = req.params.id;

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is missing from authentication token",
      });
    }

    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
        staffId,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or not assigned to you",
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

    // Prevent changing completed appointments
    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed appointments cannot be modified",
      });
    }

    // Prevent changing cancelled appointments
    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled appointments cannot be modified",
      });
    }

    await appointment.update({
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Staff Appointment Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};

module.exports = {
  createStaff,
  getStaff,
  getStaffById,
  updatedStaff,
  deleteStaff,
  assignService,
  removeService,
  getStaffDashboard,
  getStaffAppointments,
  updateStaffAppointmentStatus,
};
