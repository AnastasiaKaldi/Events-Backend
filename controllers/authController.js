const pool = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
    [email, hashed, role]
  );
  res.status(201).json({ message: "User registered" });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🧪 Login attempt:", email);

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!user.rows.length) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("🔐 Stored hash:", user.rows[0].password);
    console.log("🔑 Password from request:", password);

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT secret not set");
      return res.status(500).json({ message: "JWT secret not set" });
    }

    console.log("✅ JWT_SECRET is:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET
    );

    console.log("✅ Token generated:", token);

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
