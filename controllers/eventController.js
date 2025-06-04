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

// exports.createEvent = async (req, res) => {
//   try {
//     const { title, summary, datetime, location, overview, images, tickets } =
//       req.body;

//     if (
//       !title ||
//       !datetime ||
//       !location ||
//       !Array.isArray(images) ||
//       !Array.isArray(tickets)
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const newEvent = {
//       created_by: req.user.id,
//       title,
//       summary,
//       datetime,
//       location,
//       overview,
//       images,
//       tickets,
//     };

//     console.log("📦 New Event:", newEvent);

//     console.log("🧪 DB insert values:", [
//       req.user.id,
//       title,
//       summary,
//       datetime,
//       location,
//       overview,
//       JSON.stringify(images),
//       JSON.stringify(tickets),
//     ]);

//     const result = await pool.query(
//       `INSERT INTO events (created_by, title, summary, datetime, location, overview, images, tickets)
//    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//    RETURNING *`,
//       [
//         req.user.id,
//         title,
//         summary,
//         datetime,
//         location,
//         overview,
//         JSON.stringify(images),
//         JSON.stringify(tickets),
//       ]
//     );

//     res.status(201).json({ message: "Event created", event: result.rows[0] });
//   } catch (err) {
//     console.error("❌ Error creating event:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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

// exports.deleteEvent = async (req, res) => {
//   const userId = req.user.id;
//   const eventId = req.params.id;

//   try {
//     const result = await pool.query(
//       "DELETE FROM events WHERE id = $1 AND created_by = $2 RETURNING *",
//       [eventId, userId]
//     );

//     if (result.rowCount === 0) {
//       return res
//         .status(403)
//         .json({ message: "Not allowed to delete this event" });
//     }

//     res.status(200).json({ message: "Event deleted" });
//   } catch (err) {
//     console.error("❌ Error deleting event:", err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
