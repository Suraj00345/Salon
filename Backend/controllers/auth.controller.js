const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is missing.");
}

const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const sanitizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({
      where: { email: sanitizedEmail },
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash password
    const saltRounds = parseInt(process.env.SALT, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Defense-in-depth: Ensure role can strictly only be customer or staff
    const assignedRole = role === "staff" ? "staff" : "customer";

    // Create user in database
    const newUser = await User.create({
      name: name.trim(),
      email: sanitizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role: assignedRole,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "14d" },
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
        message: error.errors.map((e) => e.message).join(", "),
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sanitizedEmail = email.trim().toLowerCase();

    // Find user (works for customer, staff, or admin inserted directly in DB)
    const user = await User.findOne({ where: { email: sanitizedEmail } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Embed whatever role exists in the DB (admin, staff, or customer) into token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "14d" },
    );

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
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login };
