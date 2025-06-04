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

// backend route example:
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// router.get("/mine", auth, getMyEvents);
// router.delete("/:id", auth, deleteEvent);

module.exports = router;
