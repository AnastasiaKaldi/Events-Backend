const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: ENV === "production" ? ".env.production" : ".env",
});

const app = express();

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

const allowedOrigins = {
  development: "http://localhost:5173",
  production: "https://eventino.netlify.app",
};

const corsOptions = {
  origin: allowedOrigins[ENV],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.get("/test-cookie", (req, res) => {
  res.cookie("token", "testing123", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.send("✅ Cookie set");
});

app.post("/test-direct", (req, res) => {
  res.json({ message: "Real app works now" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
