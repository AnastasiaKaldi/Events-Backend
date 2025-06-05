const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const auth = require("../middleware/authMiddleware");
const {
  getEvents,
  createEvent,
  joinEvent,
  getJoinedEvents,
  leaveEvent,
  getEventById,
} = require("../controllers/eventController");

router.get("/", getEvents);
router.post("/", auth, createEvent);
router.get("/joined", requireAuth, getJoinedEvents);
router.get("/:id", getEventById);
router.post("/:id/join", auth, joinEvent);
router.delete("/:id/join", auth, leaveEvent);
router.post("/:id/join", auth, joinEvent);

// router.get("/mine", auth, getMyEvents);
// router.delete("/:id", auth, deleteEvent);

module.exports = router;
