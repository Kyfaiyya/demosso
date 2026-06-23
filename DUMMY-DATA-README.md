# Dummy Data untuk SSO Keycloak - 3 Aplikasi

Dokumentasi ini menjelaskan struktur dan cara menggunakan dummy data terpisah untuk masing-masing aplikasi.

## 📋 Struktur Aplikasi

Sistem ini terdiri dari **3 aplikasi independen** yang terintegrasi dengan **Keycloak SSO**:

### 1. **APP A - DUKCAPIL** (Dinas Kependudukan dan Pencatatan Sipil)
   - **Database**: `app_a_db`
   - **File Seed**: `seed-data-app-a.sql`
   - **Tabel Utama**:
     - `users` - Admin dan staff Dukcapil
     - `penduduk` - Data penduduk/warga
     - `karyawan` - Data karyawan Dukcapil
   - **Data yang Disimpan**:
     - 5 users (1 admin + 4 staff/user)
     - 11 penduduk records
     - 10 karyawan records

### 2. **APP B - KOMINFO** (Kementerian Komunikasi dan Informatika)
   - **Database**: `app_b_db`
   - **File Seed**: `seed-data-app-b.sql`
   - **Tabel Utama**:
     - `users` - Admin dan operator Kominfo
     - `sim_card` - Data registrasi SIM card
     - `domain_registrations` - Data domain .go.id
     - `asn` - Data Aparatur Sipil Negara
   - **Data yang Disimpan**:
     - 5 users (1 admin + 4 operator/user)
     - 15 SIM card records
     - 15 domain registrations
     - 8000+ ASN records

### 3. **APP C - LAYANAN PENDIDIKAN**
   - **Database**: `app_c_db`
   - **File Seed**: `seed-data-app-c.sql`
   - **Tabel Utama**:
     - `users` - Admin dan staff pendidikan
     - `siswa` - Data siswa
     - `nilai` - Data nilai siswa
   - **Data yang Disimpan**:
     - 5 users (1 admin + 4 staff/user)
     - 8000+ siswa records
     - 24 nilai records

---

## 🚀 Cara Menggunakan

### Opsi 1: Menggunakan Docker Compose

Jika sudah ada `docker-compose.yml`, pastikan file seed berikut ada di root folder:
- `init-db.sql` (untuk struktur database)
- `seed-data-app-a.sql`
- `seed-data-app-b.sql`
- `seed-data-app-c.sql`

Jalankan:
```bash
docker-compose up -d
```

### Opsi 2: Menggunakan psql Langsung

#### Koneksi ke PostgreSQL
```bash
psql -h localhost -U postgres -d postgres
```

#### Load struktur database
```bash
\i init-db.sql
```

#### Load dummy data untuk setiap aplikasi
```bash
\i seed-data-app-a.sql
\i seed-data-app-b.sql
\i seed-data-app-c.sql
```

### Opsi 3: Menggunakan Single SQL File

Gabungkan semua file menjadi satu, atau eksekusi satu per satu:
```bash
psql -h localhost -U postgres -d postgres -f init-db.sql
psql -h localhost -U postgres -d app_a_db -f seed-data-app-a.sql
psql -h localhost -U postgres -d app_b_db -f seed-data-app-b.sql
psql -h localhost -U postgres -d app_c_db -f seed-data-app-c.sql
```

---

## 📊 Struktur Data Detil

### **APP A - DUKCAPIL**

#### Tabel `users`
| keycloak_id | username | role |
|---|---|---|
| kcid-admin-app-a | admin_dukcapil | ADMIN |
| kcid-staff-001-app-a | staff_pencatatan | STAFF |
| kcid-staff-002-app-a | staff_pelayanan | STAFF |

#### Tabel `penduduk` (Sample)
- 11 records dengan NIK unik (16 digit)
- Data: nama, tempat lahir, tanggal lahir, alamat
- Mencakup berbagai kota di Indonesia

#### Tabel `karyawan` (Sample)
- 10 records dengan NIP unik
- Data: nama, jabatan, departemen, gaji
- Struktur organisasi Dukcapil

---

### **APP B - KOMINFO**

#### Tabel `users`
| keycloak_id | username | role |
|---|---|---|
| kcid-admin-app-b | admin_kominfo | ADMIN |
| kcid-staff-001-app-b | operator_sim | STAFF |
| kcid-staff-002-app-b | operator_domain | STAFF |

#### Tabel `sim_card` (Sample)
- 15 records registrasi SIM card
- Data: NIK, nomor SIM, provider (Telkomsel, Indosat, XL Axiata, Tri)
- Status: Aktif/Tidak Aktif
- Tgl registrasi berbeda-beda

#### Tabel `domain_registrations` (Sample)
- 15 records domain nasional
- Data: domain_name, registrant, tgl_registrasi, tgl_expired, status
- Domains contoh: kominfo.go.id, bssn.go.id, telkom-indonesia.go.id, dll

---

### **APP C - LAYANAN PENDIDIKAN**

#### Tabel `users`
| keycloak_id | username | role |
|---|---|---|
| kcid-admin-app-c | admin_pendidikan | ADMIN |
| kcid-staff-001-app-c | guru_matematika | STAFF |
| kcid-staff-002-app-c | guru_bahasa | STAFF |

#### Tabel `siswa` (Sample)
- 8000+ records
- Data: NISN, nama, tanggal_lahir

#### Tabel `nilai` (Sample)
- 24 records
- Data: NISN, mata_pelajaran, semester, nilai, tahun_ajaran

---

## 🔐 Keycloak Integration

Setiap aplikasi memiliki set users terpisah dengan keycloak_id:
- Format: `kcid-{role}-{seq}-app-{letter}`
- Contoh: `kcid-admin-app-a`, `kcid-staff-001-app-b`

**Pastikan** semua keycloak_id ini di-setup di Keycloak server untuk SSO berfungsi sempurna.

---

## ⚙️ Modifikasi Data

Jika ingin menambah/mengurangi dummy data:

1. **Edit file seed** sesuai kebutuhan
2. **Pastikan uniqueness constraints** (nik, nip, npwp, domain_name, etc.)
3. **Gunakan ON CONFLICT ... DO NOTHING** untuk prevent duplicate errors
4. **Re-run** seed script setelah perubahan

---

## 🔄 Reset Database

Untuk reset dan reload data fresh:

```bash
# Dropdown database
psql -h localhost -U postgres -d postgres
DROP DATABASE app_a_db;
DROP DATABASE app_b_db;
DROP DATABASE app_c_db;
```

Kemudian jalankan lagi dari `init-db.sql` dan file seed.

---

## 📝 Catatan

- Setiap aplikasi **terisolasi** dalam database terpisah
- Koordinasi user melalui **Keycloak** (external auth)
- Data yang ditampilkan adalah **realistic mock data** untuk development/testing
- Gunakan untuk **development/staging** saja, jangan di production
- NIK, NIP, NPWP format mengikuti standar Indonesia (jika possible)

---

## 📚 Files Reference

| File | Fungsi | Database Target |
|---|---|---|
| `init-db.sql` | Struktur database dan tables | PostgreSQL (all 3 dbs) |
| `seed-data-app-a.sql` | Dummy data Dukcapil | `app_a_db` |
| `seed-data-app-b.sql` | Dummy data Kominfo | `app_b_db` |
| `seed-data-app-c.sql` | Dummy data Layanan Pendidikan | `app_c_db` |

---

**Last Updated**: 2026-06-23
