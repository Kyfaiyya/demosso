-- ============================================================
-- Init script: Create 3 databases for 3 apps
-- This runs automatically when PostgreSQL container starts
-- ============================================================

-- App A: Dukcapil
CREATE DATABASE app_a_db;

-- App B: Kominfo
CREATE DATABASE app_b_db;

-- App C: Layanan Pendidikan
CREATE DATABASE app_c_db;

-- ============================================================
-- App A Schema (Dukcapil)
-- ============================================================
\c app_a_db;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  keycloak_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS penduduk (
  id SERIAL PRIMARY KEY,
  nik VARCHAR(16) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  tempat_lahir VARCHAR(100),
  tanggal_lahir DATE,
  alamat TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS karyawan (
  id SERIAL PRIMARY KEY,
  nip VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(100),
  departemen VARCHAR(100),
  gaji NUMERIC(15,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed penduduk data
INSERT INTO penduduk (nik, nama, tempat_lahir, tanggal_lahir, alamat) VALUES
('1234567890123456', 'Budi Santoso', 'Jakarta', '1990-05-15', 'Jl. Merdeka No. 1'),
('3201010101010001', 'Ahmad Dhani', 'Surabaya', '1985-02-20', 'Jl. Sudirman No. 45'),
('3302020202020002', 'Siti Aminah', 'Bandung', '1992-11-10', 'Jl. Asia Afrika No. 12'),
('3171234567890003', 'Joko Widodo', 'Solo', '1980-06-21', 'Jl. Slamet Riyadi No. 9'),
('3171234567890004', 'Maria Ulfa', 'Semarang', '1995-08-08', 'Jl. Pahlawan No. 2'),
('3171234567890005', 'Rudi Heryanto', 'Medan', '1988-04-12', 'Jl. Gatot Subroto No. 33'),
('3171234567890006', 'Sari Dewi', 'Denpasar', '1993-01-25', 'Jl. Teuku Umar No. 7'),
('3171234567890007', 'Andi Maulana', 'Makassar', '1991-09-30', 'Jl. Hasanuddin No. 18');

-- Seed karyawan data
INSERT INTO karyawan (nip, nama, jabatan, departemen, gaji) VALUES
('198001012020011001', 'Andi Pratama', 'Kepala Seksi', 'Pencatatan Sipil', 8500000),
('199205052022021002', 'Rina Wulandari', 'Staf Administrasi', 'Pelayanan Publik', 5200000),
('198812122019031003', 'Fajar Nugroho', 'Analis Data', 'Teknologi Informasi', 7800000),
('198001012005011001', 'Budi Santoso', 'Kepala Dinas', 'Pimpinan', 15000000),
('198502022010021002', 'Sari Dewi', 'Sekretaris', 'Administrasi', 8000000),
('199003032015031003', 'Andi Maulana', 'Staf IT', 'Teknologi Informasi', 9000000),
('198804042012041004', 'Lina Kusuma', 'Analis Data', 'Pengolahan Data', 8500000);

-- Seed admin user for App A
INSERT INTO users (keycloak_id, username, role) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'admin_dukcapil', 'ADMIN');

-- ============================================================
-- App B Schema (Kominfo)
-- ============================================================
\c app_b_db;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  keycloak_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sim_card (
  id SERIAL PRIMARY KEY,
  nik VARCHAR(16) NOT NULL,
  nomor VARCHAR(15) NOT NULL,
  provider VARCHAR(50),
  tgl_registrasi DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'Aktif',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS domain_registrations (
  id SERIAL PRIMARY KEY,
  domain_name VARCHAR(255) UNIQUE NOT NULL,
  registrant VARCHAR(255) NOT NULL,
  tgl_registrasi DATE DEFAULT CURRENT_DATE,
  tgl_expired DATE,
  status VARCHAR(20) DEFAULT 'Aktif',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asn (
  id SERIAL PRIMARY KEY,
  nip VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  tanggal_lahir DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed sim_card data
INSERT INTO sim_card (nik, nomor, provider, tgl_registrasi, status) VALUES
('1234567890123456', '081234567890', 'Telkomsel', '2023-01-15', 'Aktif'),
('3201010101010001', '085712341234', 'Indosat', '2023-06-20', 'Aktif'),
('3302020202020002', '089877665544', 'XL Axiata', '2024-02-10', 'Aktif'),
('3171234567890003', '089512345678', 'Tri', '2023-11-12', 'Aktif'),
('3171234567890004', '081199998888', 'Telkomsel', '2024-01-05', 'Aktif'),
('3171234567890005', '081877776666', 'XL Axiata', '2023-08-22', 'Blokir'),
('3171234567890006', '085755554444', 'Indosat', '2024-03-10', 'Aktif');

-- Seed domain data
INSERT INTO domain_registrations (domain_name, registrant, tgl_registrasi, tgl_expired, status) VALUES
('kominfo.go.id', 'Kementerian Kominfo', '2020-01-01', '2027-01-01', 'Aktif'),
('data.go.id', 'Badan Pusat Statistik', '2021-06-15', '2026-06-15', 'Aktif'),
('kesehatan.go.id', 'Kementerian Kesehatan', '2019-03-10', '2025-03-10', 'Aktif'),
('pendidikan.go.id', 'Kementerian Pendidikan', '2018-05-20', '2026-05-20', 'Aktif'),
('keuangan.go.id', 'Kementerian Keuangan', '2017-08-12', '2027-08-12', 'Aktif'),
('pertanian.go.id', 'Kementerian Pertanian', '2020-11-05', '2025-11-05', 'Aktif'),
('pariwisata.go.id', 'Kementerian Pariwisata', '2019-09-25', '2024-09-25', 'Expired');

-- Seed admin user for App B
INSERT INTO users (keycloak_id, username, role) VALUES
('bbbb2222-2222-2222-2222-222222222222', 'admin_kominfo', 'ADMIN');

-- ============================================================
-- App C Schema (Layanan Pendidikan)
-- ============================================================
\c app_c_db;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  keycloak_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS siswa (
  id SERIAL PRIMARY KEY,
  nisn VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  tanggal_lahir DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nilai (
  id SERIAL PRIMARY KEY,
  nisn VARCHAR(20) NOT NULL,
  mata_pelajaran VARCHAR(100) NOT NULL,
  semester VARCHAR(20),
  nilai NUMERIC(5,2),
  tahun_ajaran VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed siswa data
INSERT INTO siswa (nisn, nama, tanggal_lahir) VALUES
('0001234567', 'Ahmad Fauzi', '2010-05-15'),
('0002345678', 'Siti Aisyah', '2011-02-20'),
('0003456789', 'Budi Prasetyo', '2010-11-10'),
('0004567890', 'Dewi Lestari', '2011-06-21'),
('0005678901', 'Rudi Hermawan', '2012-08-08'),
('0006789012', 'Putri Wulandari', '2010-04-12'),
('0007890123', 'Eko Saputra', '2011-01-25'),
('0008901234', 'Nadia Permata', '2012-09-30');

-- Seed nilai data
INSERT INTO nilai (nisn, mata_pelajaran, semester, nilai, tahun_ajaran) VALUES
('0001234567', 'Matematika', 'Ganjil', 85.50, '2025/2026'),
('0001234567', 'Bahasa Indonesia', 'Ganjil', 90.00, '2025/2026'),
('0001234567', 'IPA', 'Ganjil', 78.75, '2025/2026'),
('0002345678', 'Matematika', 'Ganjil', 92.00, '2025/2026'),
('0002345678', 'Bahasa Indonesia', 'Ganjil', 88.50, '2025/2026'),
('0003456789', 'Matematika', 'Ganjil', 75.00, '2025/2026'),
('0003456789', 'Bahasa Indonesia', 'Ganjil', 82.00, '2025/2026'),
('0004567890', 'Matematika', 'Ganjil', 88.00, '2025/2026'),
('0005678901', 'IPA', 'Ganjil', 91.50, '2025/2026'),
('0006789012', 'Bahasa Indonesia', 'Ganjil', 86.00, '2025/2026');

-- Seed admin user for App C
INSERT INTO users (keycloak_id, username, role) VALUES
('cccc3333-3333-3333-3333-333333333333', 'admin_pendidikan', 'ADMIN');
