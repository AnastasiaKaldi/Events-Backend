const { pool } = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ENV = process.env.NODE_ENV || "development";

exports.registerUser = async (req, res) => {
  const { email, password, first_name, last_name, role = "user" } = req.body;

  if (!first_name || !last_name) {
    return res
      .status(400)
      .json({ message: "First and last name are required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, first_name, last_name, role, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [email, hashed, first_name, last_name, role, true]
    );

    const newUserId = result.rows[0].id;

    res.status(201).json({ message: "User registered", id: newUserId });
  } catch (err) {
    if (err.code === "23505") {
      // Unique constraint violation (duplicate email)
      return res.status(409).json({ message: "User already exists" });
    }

    console.error("Registration failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!userResult.rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚫 Block login if email is not verified
    // if (!user.is_verified) {
    //   return res.status(403).json({
    //     message: "Please verify your email before logging in.",
    //   });
    // }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, role, first_name FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in /api/auth/me:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCurrentUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
