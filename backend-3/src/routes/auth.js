const express = require("express");
const router  = express.Router();

const KEYCLOAK_URL = process.env.KEYCLOAK_URL    || "http://keycloak:8080";
const REALM        = process.env.KEYCLOAK_REALM  || "sso-demo";
const CLIENT_ID    = process.env.KEYCLOAK_CLIENT_ID     || "backend-api";
const CLIENT_SECRET= process.env.KEYCLOAK_CLIENT_SECRET || "backend-secret-1234";

const INTROSPECT_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token/introspect`;
const LOGOUT_URL     = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;

router.post("/introspect", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token diperlukan" });

  try {
    const { default: fetch } = await import("node-fetch");
    const response = await fetch(INTROSPECT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token, client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: "Gagal menghubungi Keycloak", detail: err.message });
  }
});

router.post("/logout-backend", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "Refresh token diperlukan" });

  try {
    const { default: fetch } = await import("node-fetch");
    await fetch(LOGOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: refreshToken }),
    });
    res.json({ success: true, message: "Sesi berhasil dihapus dari server" });
  } catch (err) {
    res.status(502).json({ error: "Gagal logout dari Keycloak" });
  }
});

router.get("/keycloak-config", (req, res) => {
  res.json({
    url:      process.env.KEYCLOAK_URL   || "http://localhost:8080",
    realm:    REALM,
    clientId: "frontend-app",
  });
});

module.exports = router;
