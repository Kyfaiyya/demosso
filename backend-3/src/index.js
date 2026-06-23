const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { initDB } = require("./db");
const { verifyToken } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const dataRoutes = require("./routes/data");
const registerRoutes = require("./routes/register");

const app = express();
const PORT = process.env.PORT || 4002;
const APP_NAME = process.env.APP_NAME || "Layanan Pendidikan";

// ── Security ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3002",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan("combined"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/user", verifyToken, userRoutes);
app.use("/api/data", verifyToken, dataRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: `sso-backend-${APP_NAME}`, timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Terjadi kesalahan server" });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend ${APP_NAME} running at http://localhost:${PORT}`);
    console.log(`🔐 Keycloak: ${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME}`);
  });
});
