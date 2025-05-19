const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getEvents,
  createEvent,
  joinEvent,
} = require("../controllers/eventController");

router.get("/", getEvents);
router.post("/", auth, createEvent);
router.post("/:id/join", auth, joinEvent);

module.exports = router;
