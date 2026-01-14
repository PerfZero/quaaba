const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const banksRoutes = require("./routes/banks");
const citiesRoutes = require("./routes/cities");
const dadataRoutes = require("./routes/dadata");
const airlinesRoutes = require("./routes/airlines");
const transportsRoutes = require("./routes/transports");
const foodRoutes = require("./routes/food");
const roomsRoutes = require("./routes/rooms");
const extraServicesRoutes = require("./routes/extra-services");
const uploadsRoutes = require("./routes/uploads");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/banks", banksRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/dadata", dadataRoutes);
app.use("/api/airlines", airlinesRoutes);
app.use("/api/transports", transportsRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/extra-services", extraServicesRoutes);
app.use("/api/uploads", uploadsRoutes);

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
