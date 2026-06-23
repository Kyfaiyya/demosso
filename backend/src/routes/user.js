const express = require("express");
const router  = express.Router();
const { requireRole } = require("../middleware/auth");

// GET /api/user/profile — returns Keycloak token info + per-app role
router.get("/profile", (req, res) => {
  const u = req.user;
  res.json({
    sub:       u.sub,
    username:  u.preferred_username,
    email:     u.email,
    firstName: u.given_name,
    lastName:  u.family_name,
    fullName:  u.name,
    roles:     u.realm_access?.roles || [],
    appRole:   req.appUser?.role || null,
    registered: !!req.appUser,
    emailVerified: u.email_verified,
    issuedAt:  new Date(u.iat * 1000).toISOString(),
    expiresAt: new Date(u.exp * 1000).toISOString(),
    issuer:    u.iss,
    sessionId: u.sid,
  });
});

// GET /api/user/session
router.get("/session", (req, res) => {
  const now = Math.floor(Date.now() / 1000);
  const remaining = req.user.exp - now;
  res.json({
    active: remaining > 0,
    remainingSeconds: Math.max(0, remaining),
    remainingMinutes: Math.max(0, Math.floor(remaining / 60)),
    sessionId: req.user.sid,
  });
});

// GET /api/user/admin-info — only per-app ADMIN
router.get("/admin-info", requireRole("ADMIN"), (req, res) => {
  res.json({
    message: "Anda mengakses endpoint khusus Admin",
    serverTime: new Date().toISOString(),
    adminData: {
      totalUsers: 3,
      activeSessions: 1,
      systemVersion: "1.0.0",
    },
  });
});

// GET /api/user/manager-info — per-app ADMIN or USER (everyone registered)
router.get("/manager-info", requireRole("ADMIN", "USER"), (req, res) => {
  res.json({
    message: "Anda mengakses endpoint Manager/User",
    reports: [
      { id: 1, title: "Laporan Bulanan", status: "active" },
      { id: 2, title: "Laporan Tahunan", status: "pending" },
    ],
  });
});

module.exports = router;
