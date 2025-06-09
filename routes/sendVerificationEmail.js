// backend/routes/sendVerificationEmail.js
const express = require("express");
const router = express.Router();
const { Resend } = require("resend");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const { getUserByEmail } = require("../models/db");

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const CLIENT_ORIGINS = process.env.CLIENT_ORIGINS || "http://localhost:5173";

router.post("/", async (req, res) => {
  const { email } = req.body;

  const user = await db.getUserByEmail(email);
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
  const verifyLink = `${CLIENT_ORIGINS}/verify?token=${token}`;

  try {
    await resend.emails.send({
      from: "<onboarding@resend.dev>",
      to: user.email,
      subject: "Verify your Eventino account",
      html: `<h2>Welcome to Eventino!</h2>
             <p>Please click below to verify your account:</p>
             <a href="${verifyLink}">${verifyLink}</a>`,
    });

    res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
