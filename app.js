const express = require("express");
const cookieParser = require("cookie-parser");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: ENV === "production" ? ".env.production" : ".env",
});
const cors = require("cors");

const app = express();

// ✅ Log every request
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Middleware
require("dotenv").config({
  path: ENV === "production" ? ".env.production" : ".env",
});

const allowedOrigins = [process.env.CLIENT_ORIGINS];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = process.env.CLIENT_ORIGINS.split(",");
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const originDomain = new URL(origin).hostname;
      const allowedDomains = allowedOrigins.map((url) => new URL(url).hostname);
      if (allowedDomains.includes(originDomain)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use((req, res, next) => {
  if (ENV === "production") {
    res.setHeader(
      "Set-Cookie",
      `session=value; Path=/; Secure; SameSite=None; HttpOnly`
    );
  }
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // 🔒 Parses cookies

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
console.log("✅ eventRoutes loaded");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// ✅ Test route
app.post("/test-direct", (req, res) => {
  console.log("✅ Reached /test-direct (real app)");
  res.json({ message: "Real app works now" });
});

// ✅ Start
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
