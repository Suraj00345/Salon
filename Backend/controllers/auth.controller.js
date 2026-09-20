const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//jwt secret
const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    //check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    //hash password
    const saltRounds = parseInt(process.env.SALT, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //create user in database
    const newUser = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
    });

    //return response
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    //find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    //compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    //generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "14d" },
    );

    //return response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login };
