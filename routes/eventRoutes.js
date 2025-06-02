const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { leaveEvent } = require("../controllers/eventController");

const {
  getEvents,
  createEvent,
  joinEvent,
  getJoinedEvents,
  // getMyEvents,
  // deleteEvent,
} = require("../controllers/eventController");

router.get("/", getEvents);
router.post("/", auth, createEvent);
router.post("/:id/join", auth, joinEvent);
router.get("/joined", auth, getJoinedEvents);
router.delete("/:id/join", auth, leaveEvent);
// router.get("/mine", auth, getMyEvents);
// router.delete("/:id", auth, deleteEvent);

module.exports = router;
