const { Staff, Service, StaffService, WorkingHour } = require("../models");

// create staff
const createStaff = async (req, res) => {
  try {
    const { name, email, phone, specialization, bio } = req.body;

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
        message: "Staff memeber already exists",
      });
    }

    const staff = await Staff.create({
      name,
      email,
      phone,
      specialization,
      bio,
      isActive: true,
    });

    return res.status(200).json({
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

// get all staff
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      where: {
        isActive: true,
      },
      include: [
        {
          model: Service,
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

// get staff by id
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      include: [
        {
          model: Service,
          through: {
            attributes: [],
          },
        },
        {
          model: WorkingHour,
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

// update staff by id
const updatedStaff = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff memeber not found",
      });
    }

    const { name, email, phone, specialization, bio, isActive } = req.body;

    await staff.update({
      name: name ?? staff.name,
      email: email ?? staff.email,
      phone: phone ?? staff.phone,
      specialization: specialization ?? staff.specialization,
      bio: bio ?? staff.bio,
      isActive: isActive ?? staff.isActive,
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

// delete staff by id
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

//Assign service to staff
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

    const staff = await Staff.findByPk(staffId);
    const service = await Service.findByPk(serviceId);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff memeber not found",
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
        message: "Service already assigned to this staff memeber",
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

module.exports = {
  createStaff,
  getStaff,
  getStaffById,
  updatedStaff,
  deleteStaff,
  assignService,
};
