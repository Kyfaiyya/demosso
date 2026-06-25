const { createRemoteJWKSet, jwtVerify } = require("jose");
const { pool } = require("../db");

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || "http://keycloak:8080";
const REALM = process.env.KEYCLOAK_REALM || "sso-demo";
const ISSUER_INTERNAL = `${KEYCLOAK_URL}/realms/${REALM}`;
const ISSUER_EXTERNAL = `http://localhost:8080/realms/${REALM}`;
const JWKS_URI = `${ISSUER_INTERNAL}/protocol/openid-connect/certs`;

let JWKS;
function getJWKS() {
  if (!JWKS) JWKS = createRemoteJWKSet(new URL(JWKS_URI));
  return JWKS;
}

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: [ISSUER_INTERNAL, ISSUER_EXTERNAL],
    });
    req.user = payload;

    const result = await pool.query(
      "SELECT * FROM users WHERE keycloak_id = $1",
      [payload.sub]
    );

    let appUser = result.rows[0] || null;

    if (!appUser) {
      const checkData = await pool.query(
        "SELECT nisn FROM siswa WHERE nisn = $1",
        [payload.nisn || payload.preferred_username]
      );
      if (checkData.rows.length > 0) {
        const ins = await pool.query(
          "INSERT INTO users (keycloak_id, username, role) VALUES ($1, $2, 'USER') RETURNING *",
          [payload.sub, payload.preferred_username]
        );
        appUser = ins.rows[0];
      }
    }

    req.appUser = appUser;
    req.token = token;
    next();
  } catch (err) {
    console.warn("Token verification failed:", err.message);
    return res.status(401).json({ error: "Token tidak valid atau sudah kedaluwarsa" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.appUser) {
      return res.status(403).json({
        error: "Belum terdaftar pada aplikasi ini",
        needsRegistration: true
      });
    }

    if (!roles.includes(req.appUser.role)) {
      return res.status(403).json({
        error: "Akses ditolak",
        required: roles,
        yourRole: req.appUser.role
      });
    }

    next();
  };
}

module.exports = { verifyToken, requireRole };
