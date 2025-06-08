const pool = require("../models/db");

exports.getEvents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM events WHERE status = 'open'"
    );
    const parsed = result.rows.map((event) => ({
      ...event,
      images: event.images || [],
    }));
    res.json(parsed);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      summary,
      datetime,
      location,
      overview,
      images,
      category,
      capacity,
    } = req.body;

    if (
      !title ||
      !datetime ||
      !location ||
      !Array.isArray(images) ||
      capacity === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedCategory = (category || "custom").trim().toLowerCase();

    const result = await pool.query(
      `INSERT INTO events (created_by, title, summary, datetime, location, overview, images, category, capacity, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        req.user.id,
        title,
        summary,
        datetime,
        location,
        overview,
        JSON.stringify(images),
        normalizedCategory,
        capacity,
        "open",
      ]
    );

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
    const eventRes = await pool.query(
      "SELECT capacity, status FROM events WHERE id = $1",
      [eventId]
    );
    const attendeesRes = await pool.query(
      "SELECT COUNT(*) FROM event_attendees WHERE event_id = $1",
      [eventId]
    );

    if (eventRes.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { capacity, status } = eventRes.rows[0];
    const currentCount = parseInt(attendeesRes.rows[0].count, 10);

    if (status === "full" || currentCount >= capacity) {
      return res.status(400).json({ message: "Event is already full" });
    }

    await pool.query(
      "INSERT INTO event_attendees (user_id, event_id) VALUES ($1, $2)",
      [userId, eventId]
    );

    const isNowFull = currentCount + 1 === capacity;

    if (isNowFull) {
      await pool.query("UPDATE events SET status = 'full' WHERE id = $1", [
        eventId,
      ]);
      console.log(`🔒 Event ${eventId} marked as FULL`);
    }

    res.status(200).json({ message: "Joined event", isNowFull });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "You already joined this event" });
    }
    console.error("❌ joinEvent error:", err);
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
    };

    res.status(200).json(parsedEvent);
  } catch (err) {
    console.error("❌ Error fetching event by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyEvents = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
  SELECT e.*, (
    SELECT COUNT(*) FROM event_attendees ea WHERE ea.event_id = e.id
  ) AS attendee_count
  FROM events e
  WHERE e.created_by = $1
  ORDER BY datetime DESC
  `,
      [userId]
    );

    const events = result.rows.map((event) => {
      let images = [];
      try {
        images = Array.isArray(event.images)
          ? event.images
          : JSON.parse(event.images || "[]");
      } catch (e) {
        console.error("❌ Failed to parse images:", event.images);
      }

      return {
        ...event,
        images,
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

  const {
    title,
    summary,
    datetime,
    location,
    overview,
    images,
    category,
    capacity,
  } = req.body;

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

    const normalizedCategory = (category || "custom").trim().toLowerCase();

    const updated = await pool.query(
      `
      UPDATE events
      SET title = $1, summary = $2, datetime = $3, location = $4, overview = $5, images = $6, category = $7, capacity = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        title,
        summary,
        datetime,
        location,
        overview,
        JSON.stringify(images),
        normalizedCategory,
        capacity,
        eventId,
      ]
    );

    res.status(200).json({ message: "Event updated", event: updated.rows[0] });
  } catch (err) {
    console.error("❌ Error updating event:", err);
    res.status(500).json({ message: "Server error" });
  }
};
