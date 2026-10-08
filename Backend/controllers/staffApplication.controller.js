const { StaffApplication, Staff, User } = require("../models/Index");

const { sequelize } = require("../models/Index");

// APPLY TO BECOME STAFF
const createStaffApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const { experience, qualification, bio, skills, requestedServices } =
      req.body;

    // Check user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already staff
    if (user.role === "staff") {
      return res.status(400).json({
        success: false,
        message: "You are already a staff member",
      });
    }

    // Admin cannot apply
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin cannot apply for staff",
      });
    }

    // Check existing staff profile
    const existingStaff = await Staff.findOne({
      where: {
        userId,
      },
    });

    if (existingStaff) {
      return res.status(400).json({
        success: false,
        message: "Staff profile already exists",
      });
    }

    // Check pending application
    const pendingApplication = await StaffApplication.findOne({
      where: {
        userId,
        status: "pending",
      },
    });

    if (pendingApplication) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending application",
      });
    }

    // Basic validation
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one skill is required",
      });
    }

    const application = await StaffApplication.create({
      userId,
      experience,
      qualification,
      bio,
      skills,
      requestedServices: Array.isArray(requestedServices)
        ? requestedServices
        : [],
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Staff application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Create Staff Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit staff application",
      error: error.message,
    });
  }
};

// Get user's own application
const getMyStaffApplication = async (req, res) => {
  try {
    const application = await StaffApplication.findOne({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!application) {
      return res.status(200).json({
        success: true,
        application: null,
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get My Staff Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff application",
      error: error.message,
    });
  }
};

// admin: Get Applications
const getStaffApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};

    if (status) {
      const allowedStatuses = ["pending", "approved", "rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application status",
        });
      }

      where.status = status;
    }

    const applications = await StaffApplication.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone", "role"],
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Staff Applications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff applications",
      error: error.message,
    });
  }
};

// admin Approval
const approveStaffApplication = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const application = await StaffApplication.findByPk(req.params.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!application) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Staff application not found",
      });
    }

    if (application.status !== "pending") {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Only pending applications can be approved",
      });
    }

    // Get applicant
    const user = await User.findByPk(application.userId, {
      transaction,
    });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Applicant user not found",
      });
    }

    // Check if staff profile already exists
    const existingStaff = await Staff.findOne({
      where: {
        userId: user.id,
      },
      transaction,
    });

    if (existingStaff) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: "Staff profile already exists for this user",
      });
    }

    const specialization =
      Array.isArray(application.skills) && application.skills.length > 0
        ? application.skills[0]
        : null;

    if (!specialization) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Application must contain at least one skill",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Staff Profile
    |--------------------------------------------------------------------------
    */

    const staff = await Staff.create(
      {
        userId: user.id,

        // Comes from User
        name: user.name,
        email: user.email,
        phone: user.phone,

        // Comes from application
        specialization,
        experience: application.experience,

        isActive: true,
      },
      {
        transaction,
      },
    );

    /*
    |--------------------------------------------------------------------------
    | Change User Role
    |--------------------------------------------------------------------------
    */

    await user.update(
      {
        role: "staff",
      },
      {
        transaction,
      },
    );

    /*
    |--------------------------------------------------------------------------
    | Update Application
    |--------------------------------------------------------------------------
    */

    await application.update(
      {
        status: "approved",
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Staff application approved successfully",

      staff,

      application,
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Approve Staff Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve staff application",
      error: error.message,
    });
  }
};

// admin rejection
const rejectStaffApplication = async (req, res) => {
  try {
    const application = await StaffApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Staff application not found",
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending applications can be rejected",
      });
    }

    const { adminNote } = req.body;

    await application.update({
      status: "rejected",
      adminNote: adminNote || null,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Staff application rejected",
      application,
    });
  } catch (error) {
    console.error("Reject Staff Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject staff application",
      error: error.message,
    });
  }
};

module.exports = {
  createStaffApplication,
  getMyStaffApplication,
  getStaffApplications,
  approveStaffApplication,
  rejectStaffApplication,
};
