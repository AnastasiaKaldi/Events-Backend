const express = require("express");
require("dotenv").config();
// const cors = require("cors");

const app = express();
// app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

/*

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
*/

app.post("/test-direct", (req, res) => {
  console.log("✅ Reached /test-direct (real app)");
  res.json({ message: "Real app works now" });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
