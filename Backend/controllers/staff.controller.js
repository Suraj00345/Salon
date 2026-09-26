const { Staff, Service, StaffService, WorkingHour } = require("../models");


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


// UPDATE STAFF BY ID
const updatedStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      });
    }

    const { name, email, phone, specialization, experience, isActive } =
      req.body;

    // Check if new email conflicts with another staff member
    if (email && email !== staff.email) {
      const emailExists = await Staff.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another staff member",
        });
      }
    }

    await staff.update({
      name: name ?? staff.name,
      email: email ?? staff.email,
      phone: phone ?? staff.phone,
      specialization: specialization ?? staff.specialization,
      experience: experience ?? staff.experience,
      isActive: isActive ?? staff.isActive,
    });

    await staff.reload({
      include: [
        {
          model: Service,
          as: "services",
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      staff,
    });
  } catch (error) {
    console.error("Update Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update staff",
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

module.exports = {
  createStaff,
  getStaff,
  getStaffById,
  updatedStaff,
  deleteStaff,
  assignService,
  removeService,
};
