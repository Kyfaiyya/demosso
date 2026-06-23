const router = require("express").Router();
const { pool } = require("../db");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.appUser) {
      return res.json({
        message: "Sudah terdaftar",
        user: { username: req.appUser.username, role: req.appUser.role, created_at: req.appUser.created_at }
      });
    }

    const { npwp, nama, jenis_pajak } = req.body;
    if (!npwp || !nama) {
      return res.status(400).json({ error: "NPWP dan Nama wajib diisi untuk registrasi" });
    }

    const result = await pool.query(
      `INSERT INTO users (keycloak_id, username, role) VALUES ($1, $2, 'USER') RETURNING *`,
      [req.user.sub, req.user.preferred_username]
    );

    await pool.query(
      `INSERT INTO wajib_pajak (npwp, nama, jenis_pajak) VALUES ($1, $2, $3)`,
      [npwp, nama, jenis_pajak || 'Pribadi']
    );

    res.json({
      message: "Registrasi berhasil! Anda terdaftar sebagai USER di aplikasi ini.",
      user: { username: result.rows[0].username, role: result.rows[0].role, created_at: result.rows[0].created_at }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Gagal melakukan registrasi" });
  }
});

router.get("/status", verifyToken, async (req, res) => {
  res.json({
    registered: !!req.appUser,
    user: req.appUser ? { username: req.appUser.username, role: req.appUser.role, created_at: req.appUser.created_at } : null
  });
});

module.exports = router;
