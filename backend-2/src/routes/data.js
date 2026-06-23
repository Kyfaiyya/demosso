const express = require("express");
const router  = express.Router();
const { requireRole } = require("../middleware/auth");
const { pool } = require("../db");

// GET /api/data/kominfo — Data SIM Card dari PostgreSQL
router.get("/kominfo", async (req, res) => {
  try {
    if (!req.appUser) {
      return res.status(403).json({ error: "Belum terdaftar pada aplikasi ini", needsRegistration: true });
    }

    const result = await pool.query("SELECT * FROM sim_card ORDER BY id");
    res.json({
      source: "Database Kominfo (PostgreSQL)",
      data: result.rows,
      total: result.rows.length,
      requestedBy: req.user.preferred_username,
    });
  } catch (err) {
    console.error("Data fetch error:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// POST /api/data/kominfo — Tambah registrasi SIM Card (ADMIN only)
router.post("/kominfo", requireRole("ADMIN"), async (req, res) => {
  const { nik, nomor, provider } = req.body;
  if (!nik || !nomor) return res.status(400).json({ error: "NIK dan Nomor wajib diisi" });

  try {
    const result = await pool.query(
      `INSERT INTO sim_card (nik, nomor, provider)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nik, nomor, provider || "Tri"]
    );
    res.json({ success: true, message: "Nomor berhasil diregistrasi!", data: result.rows[0] });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Gagal menambah data" });
  }
});

// GET /api/data/domain — Data Domain dari PostgreSQL
router.get("/domain", async (req, res) => {
  try {
    if (!req.appUser) {
      return res.status(403).json({ error: "Belum terdaftar pada aplikasi ini", needsRegistration: true });
    }

    const result = await pool.query("SELECT * FROM domain_registrations ORDER BY id");
    res.json({
      source: "Database Domain Kominfo (PostgreSQL)",
      data: result.rows,
      total: result.rows.length,
      requestedBy: req.user.preferred_username,
    });
  } catch (err) {
    console.error("Data fetch error:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// GET /api/data/asn — Data ASN dari PostgreSQL
router.get("/asn", async (req, res) => {
  try {
    if (!req.appUser) {
      return res.status(403).json({ error: "Belum terdaftar pada aplikasi ini", needsRegistration: true });
    }

    const result = await pool.query("SELECT * FROM asn ORDER BY id");
    res.json({
      source: "Database ASN Kominfo (PostgreSQL)",
      data: result.rows,
      total: result.rows.length,
      requestedBy: req.user.preferred_username,
    });
  } catch (err) {
    console.error("Data fetch error:", err);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// POST /api/data/asn — Tambah ASN (ADMIN only)
router.post("/asn", requireRole("ADMIN"), async (req, res) => {
  const { nip, nama, tanggal_lahir } = req.body;
  if (!nip || !nama) return res.status(400).json({ error: "NIP dan Nama wajib diisi" });

  try {
    const result = await pool.query(
      `INSERT INTO asn (nip, nama, tanggal_lahir)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nip, nama, tanggal_lahir || "2000-01-01"]
    );
    res.json({ success: true, message: "ASN berhasil ditambahkan!", data: result.rows[0] });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Gagal menambah data" });
  }
});

module.exports = router;
