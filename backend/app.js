require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const path    = require("path");

const logger          = require("./config/logger");
const { connect }     = require("./config/database");
const { runSeeder }   = require("./utils/seeder");
const errorMiddleware = require("./middlewares/error.middleware");

const adminV1Route = require("./api/v1/admin/index");
const clientRoute  = require("./services/public-api/api");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Request logger
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/v1/admin", adminV1Route);
app.use("/api",          clientRoute);

app.get("/health", (_req, res) =>
  res.json({ success: true, message: "Server is healthy" })
);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// ── Centralized error handler (must be last) ──────────────────────────────────
app.use(errorMiddleware);

// ── Bootstrap ─────────────────────────────────────────────────────────────────
(async () => {
  try {
    await connect();
    await runSeeder();

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info("Admin API  →  /api/v1/admin");
      logger.info("Public API →  /api");
    });
  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
})();
