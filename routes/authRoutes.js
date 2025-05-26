const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getMe,
  logoutUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getMe);
router.post("/logout", logoutUser);

// Optional test route
router.post("/test", (req, res) => {
  console.log("✅ /api/auth/test hit");
  res.json({ message: "Route is working" });
});

module.exports = router;
