const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const banksRoutes = require("./routes/banks");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const defaultCorsOrigins = ["http://localhost:3000"];
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : defaultCorsOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/banks", banksRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend API!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
