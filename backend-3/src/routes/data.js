const express = require("express");
const router  = express.Router();
const { requireRole } = require("../middleware/auth");
const { pool } = require("../db");

// GET /api/data/siswa — Data Siswa dari PostgreSQL
router.get("/siswa", async (req, res) => {
  try {
    if (!req.appUser) {
      return res.status(403).json({ error: "Belum terdaftar pada aplikasi ini", needsRegistration: true });
    }

    const result = await pool.query("SELECT * FROM siswa ORDER BY id");
    res.json({
      source: "Database Siswa (PostgreSQL)",
      data: result.rows,
      total: result.rows.length,
      requestedBy: req.user.preferred_username,
    });
  } catch (err) {
    console.error("Data fetch error:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// POST /api/data/siswa — Tambah siswa (ADMIN only)
router.post("/siswa", requireRole("ADMIN"), async (req, res) => {
  const { nisn, nama, tanggal_lahir } = req.body;
  if (!nisn || !nama) return res.status(400).json({ error: "NISN dan Nama wajib diisi" });

  try {
    const result = await pool.query(
      `INSERT INTO siswa (nisn, nama, tanggal_lahir)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nisn, nama, tanggal_lahir || "2010-01-01"]
    );
    res.json({ success: true, message: "Siswa berhasil ditambahkan!", data: result.rows[0] });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Gagal menambah data" });
  }
});

// GET /api/data/nilai — Data Nilai dari PostgreSQL
router.get("/nilai", async (req, res) => {
  try {
    if (!req.appUser) {
      return res.status(403).json({ error: "Belum terdaftar pada aplikasi ini", needsRegistration: true });
    }

    const result = await pool.query("SELECT * FROM nilai ORDER BY id");
    res.json({
      source: "Database Nilai Siswa (PostgreSQL)",
      data: result.rows,
      total: result.rows.length,
      requestedBy: req.user.preferred_username,
    });
  } catch (err) {
    console.error("Data fetch error:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

module.exports = router;
