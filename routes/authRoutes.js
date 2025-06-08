const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getMe,
  logoutUser,
} = require("../controllers/authController");

const requireAuth = require("../middleware/requireAuth");
const authenticate = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getMe);
router.post("/logout", logoutUser);

router.post("/test", (req, res) => {
  res.json({ message: "Route is working" });
});

module.exports = router;
