const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const auth = require("../middleware/authMiddleware");
const {
  getEvents,
  getMyEvents,
  createEvent,
  joinEvent,
  getJoinedEvents,
  leaveEvent,
  getEventById,
  deleteEvent,
  updateEvent,
} = require("../controllers/eventController");

router.get("/", getEvents);
router.post("/", auth, createEvent);
router.get("/joined", requireAuth, getJoinedEvents);
router.get("/mine", requireAuth, getMyEvents);
router.post("/:id/join", auth, joinEvent);
router.post("/:id/leave", auth, leaveEvent);
router.put("/:id", requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);
router.get("/:id", getEventById);

module.exports = router;
