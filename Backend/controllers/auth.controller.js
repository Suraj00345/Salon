const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Staff } = require('../models/Index');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is missing.");
}

/*
|--------------------------------------------------------------------------
| SIGNUP
|--------------------------------------------------------------------------
| Every public registration creates a CUSTOMER.
| A user can become STAFF only after admin approval.
*/
const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({
      where: {
        email: sanitizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.SALT, 10) || 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    /*
     * IMPORTANT:
     * Never trust role from frontend during registration.
     *
     * Every public registration starts as CUSTOMER.
     */
    const newUser = await User.create({
      name: name.trim(),
      email: sanitizedEmail,
      phone: phone ? phone.trim() : null,
      password: hashedPassword,
      role: "customer",
    });

    // Generate customer JWT
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      {
        expiresIn: "14d",
      },
    );

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,

      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
| Customer:
|   JWT -> id, email, role
|
| Staff:
|   JWT -> id, email, role, staffId
|
| Admin:
|   JWT -> id, email, role
|--------------------------------------------------------------------------
*/
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      where: {
        email: sanitizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /*
     * Find Staff profile only if the user is STAFF.
     */
    let staff = null;

    if (user.role === "staff") {
      staff = await Staff.findOne({
        where: {
          userId: user.id,
        },
      });

      if (!staff) {
        return res.status(403).json({
          success: false,
          message: "Staff profile not found. Please contact the administrator.",
        });
      }

      if (!staff.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your staff account is currently inactive.",
        });
      }
    }

    /*
     * Base JWT payload
     */
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    /*
     * Staff gets staffId.
     */
    if (staff) {
      payload.staffId = staff.id;
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "14d",
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,

        // Frontend can use this if needed
        ...(staff && {
          staffId: staff.id,
        }),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  signup,
  login,
};
