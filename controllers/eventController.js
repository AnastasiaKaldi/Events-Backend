const pool = require("../models/db");

exports.getEvents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events");
    const parsed = result.rows.map((event) => ({
      ...event,
      images: event.images || [],
      tickets: event.tickets || [],
    }));
    res.json(parsed);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, summary, datetime, location, overview, images, tickets } =
      req.body;

    console.log("📥 Payload received on backend:", req.body);

    if (
      !title ||
      !datetime ||
      !location ||
      !Array.isArray(images) ||
      !Array.isArray(tickets)
    ) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEvent = {
      created_by: req.user.id,
      title,
      summary,
      datetime,
      location,
      overview,
      images,
      tickets,
    };

    console.log("📦 Processed newEvent to insert:", newEvent);

    const result = await pool.query(
      `INSERT INTO events (created_by, title, summary, datetime, location, overview, images, tickets)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user.id,
        title,
        summary,
        datetime,
        location,
        overview,
        JSON.stringify(images),
        JSON.stringify(tickets),
      ]
    );

    console.log("✅ Event inserted into DB:", result.rows[0]);
    res.status(201).json({ message: "Event created", event: result.rows[0] });
  } catch (err) {
    console.error("❌ Error creating event:", err);
    res.status(500).json({ message: "Server error" });
  }
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
      SELECT e.id, e.title, e.datetime, e.summary, e.location, e.images
      FROM events e
      JOIN event_attendees ea ON ea.event_id = e.id
      WHERE ea.user_id = $1
      ORDER BY e.datetime DESC
      `,
      [userId]
    );

    const events = result.rows.map((event) => ({
      ...event,
      image_url: Array.isArray(event.images)
        ? event.images[0]
        : JSON.parse(event.images || "[]")[0] || null,
    }));

    res.json(events);
  } catch (err) {
    console.error("Error fetching joined events:", err);
    res.status(500).json({ message: "Failed to fetch joined events" });
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

exports.getEventById = async (req, res) => {
  const eventId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [
      eventId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = result.rows[0];

    const parsedEvent = {
      ...event,
      images: event.images || [],
      tickets: event.tickets || [],
    };

    res.status(200).json(parsedEvent);
  } catch (err) {
    console.error("❌ Error fetching event by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyEvents = async (req, res) => {
  const userId = req.user.id;
  console.log("🔍 Logged in user ID:", userId);

  try {
    const result = await pool.query(
      "SELECT * FROM events WHERE created_by = $1 ORDER BY datetime DESC",
      [userId]
    );

    console.log("📦 Raw rows from DB:", result.rows);

    const events = result.rows.map((event) => {
      let images = [];
      let tickets = [];

      try {
        images = Array.isArray(event.images)
          ? event.images
          : JSON.parse(event.images || "[]");
      } catch (e) {
        console.error("❌ Failed to parse images:", event.images);
      }

      try {
        tickets = Array.isArray(event.tickets)
          ? event.tickets
          : JSON.parse(event.tickets || "[]");
      } catch (e) {
        console.error("❌ Failed to parse tickets:", event.tickets);
      }

      return {
        ...event,
        images,
        tickets,
        image_url: images[0] || null,
      };
    });

    res.status(200).json(events);
  } catch (err) {
    console.error("❌ FINAL CATCH ERROR:", err.stack || err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const eventId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [
      eventId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = result.rows[0];

    if (event.created_by !== userId && userRole !== "staff") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    await pool.query("DELETE FROM event_attendees WHERE event_id = $1", [
      eventId,
    ]);
    await pool.query("DELETE FROM events WHERE id = $1", [eventId]);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting event:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  const { title, summary, datetime, location, overview, images, tickets } =
    req.body;

  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [
      eventId,
    ]);
    const event = result.rows[0];

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.created_by !== userId && userRole !== "staff") {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this event" });
    }

    const updated = await pool.query(
      `
      UPDATE events
      SET title = $1, summary = $2, datetime = $3, location = $4, overview = $5, images = $6, tickets = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        title,
        summary,
        datetime,
        location,
        overview,
        JSON.stringify(images),
        JSON.stringify(tickets),
        eventId,
      ]
    );

    res.status(200).json({ message: "Event updated", event: updated.rows[0] });
  } catch (err) {
    console.error("❌ Error updating event:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// module.exports = {
//   getEvents,
//   createEvent,
//   joinEvent,
//   getJoinedEvents,
//   leaveEvent,
//   getEventById,
// };
