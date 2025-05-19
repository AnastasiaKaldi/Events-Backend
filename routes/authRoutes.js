const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/test", (req, res) => {
  console.log("✅ /api/auth/test hit");
  res.json({ message: "Route is working" });
});

module.exports = router;
