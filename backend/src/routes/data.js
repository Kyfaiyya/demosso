const express = require("express");
const router  = express.Router();
const { requireRole } = require("../middleware/auth");
const { pool } = require("../db");

// GET /api/data/dukcapil — Data Penduduk dari PostgreSQL
router.get("/dukcapil", async (req, res) => {
  try {
    if (!req.appUser) {
      return res.status(403).json({ error: "Belum terdaftar pada aplikasi ini", needsRegistration: true });
    }

    const result = await pool.query("SELECT * FROM penduduk ORDER BY id");
    res.json({
      source: "Database Dukcapil (PostgreSQL)",
      data: result.rows,
      total: result.rows.length,
      requestedBy: req.user.preferred_username,
    });
  } catch (err) {
    console.error("Data fetch error:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// POST /api/data/dukcapil — Tambah penduduk (ADMIN only)
router.post("/dukcapil", requireRole("ADMIN"), async (req, res) => {
  const { nik, nama, tempat_lahir, tanggal_lahir, alamat } = req.body;
  if (!nik || !nama) return res.status(400).json({ error: "NIK dan Nama wajib diisi" });

  try {
    const result = await pool.query(
      `INSERT INTO penduduk (nik, nama, tempat_lahir, tanggal_lahir, alamat)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nik, nama, tempat_lahir || "Jakarta", tanggal_lahir || "2000-01-01", alamat || "Jl. Baru"]
    );
    res.json({ success: true, message: "Data Penduduk berhasil ditambahkan!", data: result.rows[0] });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Gagal menambah data" });
  }
});

// GET /api/data/karyawan — Data Karyawan dari PostgreSQL
router.get("/karyawan", async (req, res) => {
  try {
    if (!req.appUser) {
      return res.status(403).json({ error: "Belum terdaftar pada aplikasi ini", needsRegistration: true });
    }

    const result = await pool.query("SELECT * FROM karyawan ORDER BY id");
    res.json({
      source: "Database Karyawan Dukcapil (PostgreSQL)",
      data: result.rows,
      total: result.rows.length,
      requestedBy: req.user.preferred_username,
    });
  } catch (err) {
    console.error("Data fetch error:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// POST /api/data/karyawan — Tambah karyawan (ADMIN only)
router.post("/karyawan", requireRole("ADMIN"), async (req, res) => {
  const { nip, nama, jabatan, departemen, gaji } = req.body;
  if (!nip || !nama) return res.status(400).json({ error: "NIP dan Nama wajib diisi" });

  try {
    const result = await pool.query(
      `INSERT INTO karyawan (nip, nama, jabatan, departemen, gaji)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nip, nama, jabatan || "Staf", departemen || "Umum", gaji || 5000000]
    );
    res.json({ success: true, message: "Karyawan berhasil ditambahkan!", data: result.rows[0] });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Gagal menambah data" });
  }
});

module.exports = router;
