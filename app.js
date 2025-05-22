const express = require("express");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: ENV === "production" ? ".env.production" : ".env",
});

const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.post("/test-direct", (req, res) => {
  console.log("✅ Reached /test-direct (real app)");
  res.json({ message: "Real app works now" });
});

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
