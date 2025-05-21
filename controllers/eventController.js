const pool = require("../models/db");

exports.getEvents = async (req, res) => {
  const result = await pool.query("SELECT * FROM events");
  res.json(result.rows);
};

exports.createEvent = async (req, res) => {
  const { title, date, description } = req.body;
  await pool.query(
    "INSERT INTO events (title, date, description, created_by) VALUES ($1, $2, $3, $4)",
    [title, date, description, req.user.id]
  );
  res.status(201).json({ message: "Event created" });
};

exports.joinEvent = async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  try {
    await pool.query(
      "INSERT INTO event_attendees (user_id, event_id) VALUES ($1, $2)",
      [userId, eventId]
    );
    res.status(200).json({ message: "Joined event" });
  } catch (err) {
    if (err.code === "23505") {
      // 23505 = unique_violation
      return res.status(400).json({ message: "You already joined this event" });
    }
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getJoinedEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
        SELECT events.* FROM events
        JOIN event_attendees ON events.id = event_attendees.event_id
        WHERE event_attendees.user_id = $1
        `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching joined events:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.leaveEvent = async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM event_attendees WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "You haven't joined this event" });
    }

    res.status(200).json({ message: "Left event" });
  } catch (err) {
    console.error("Error leaving event:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
