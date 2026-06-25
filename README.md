# 🔐 SSO Portal & Layanan Terpadu (Smart Service)

Proyek ini adalah implementasi sistem **Single Sign-On (SSO)** skala penuh yang mengintegrasikan satu Portal Utama dengan tiga aplikasi layanan publik independen (Dukcapil, Kominfo, dan Pendidikan). Sistem ini dibangun menggunakan **Keycloak**, **React**, **Express**, dan **PostgreSQL**.

---

## 🏗 Arsitektur Sistem

Sistem terdiri dari beberapa komponen yang saling terhubung melalui protokol OAuth2 / OpenID Connect (OIDC) dengan PKCE flow:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Browser (Pengguna)                            │
└────────┬───────────────────────────┬──────────────────────────┬────────┘
         │                           │                          │
         ▼                           ▼                          ▼
┌─────────────────┐       ┌──────────────────────┐       ┌───────────────┐
│  Portal Utama   │       │ Keycloak Auth Server │       │ Aplikasi 1-3  │
│  :8000          │◄─────►│ :8080                │◄─────►│ :3000 - :3002 │
│  (Iframe Login) │  SSO  │ Realm: sso-demo      │  SSO  │ (Auto-Login)  │
└─────────────────┘       └──────────────────────┘       └────────┬──────┘
                                    ▲                             │ JWT
                                    │ JWKS verify                 ▼
                          ┌──────────────────────┐       ┌───────────────┐
                          │ PostgreSQL (Database)│◄─────►│ Backend 1-3   │
                          │ :5432                │       │ :4000 - :4002 │
                          └──────────────────────┘       └───────────────┘
```

---

## 🎯 Fitur & Alur Utama

### 1. Dashboard Portal Utama (`localhost:8000`)
- **Iframe Popup Login:** Proses login ke Keycloak tidak membuka tab baru. Menggunakan modal _iframe_ interaktif yang merespons event `SSO_LOGIN_SUCCESS` untuk menutup diri otomatis dan merefresh state autentikasi portal.
- Sebagai pusat layanan (hub) yang menavigasikan pengguna ke aplikasi-aplikasi sektoral.

### 2. Aplikasi Sektoral (Auto-Login)
- **Dukcapil (`localhost:3000`)**
- **Kominfo (`localhost:3001`)**
- **Pendidikan (`localhost:3002`)**
- Menggunakan mode `login-required`. Jika pengguna membuka aplikasi tanpa sesi SSO yang valid, mereka akan diarahkan (**auto-redirect**) ke Keycloak. 
- Jika pengguna sudah login di Portal, Keycloak mendeteksi sesi dan langsung memasukkan pengguna ke dalam aplikasi tanpa perlu input password lagi.

### 3. Pendaftaran Spesifik Aplikasi (App Registration)
Walaupun pengguna sudah memiliki akun Keycloak, setiap aplikasi memiliki tabel `users` di database masing-masing (Backend 1, 2, 3). 
- Jika pengguna masuk tapi belum terdaftar di database lokal aplikasi, mereka akan otomatis diarahkan ke **Halaman Registrasi Khusus Aplikasi** (`RegisterPage`).
- Setelah melengkapi NIK, nama, dll., mereka baru bisa mengakses menu utama aplikasi.

### 4. Role-Based Access Control (RBAC) via Keycloak Groups
Pengguna dimasukkan ke dalam grup tertentu di Keycloak yang otomatis memberikan *realm roles* (e.g., `admin_app_1`, `admin_app_2`). Token JWT Keycloak akan membawa role tersebut (Token Mapping) untuk diverifikasi oleh Backend.

---

## 📁 Struktur Proyek

```
sso-keycloak/
├── docker-compose.yml       ← Konfigurasi Docker seluruh service
├── portal/                  ← Portal Utama (React)
├── frontend/                ← App 1: Dukcapil (React)
├── frontend-2/              ← App 2: Kominfo (React)
├── frontend-3/              ← App 3: Pendidikan (React)
├── backend/                 ← API 1: Dukcapil (Express)
├── backend-2/               ← API 2: Kominfo (Express)
├── backend-3/               ← API 3: Pendidikan (Express)
├── keycloak/                ← Konfigurasi Realm Keycloak
│   └── realm-config/sso-demo-realm.json 
├── sync-to-keycloak.js      ← Skrip sinkronisasi massal data CSV
└── test-insert-20.js        ← Skrip tester (20 baris per file CSV)
```

---

## 🚀 Cara Menjalankan

### 1. Jalankan Container
Pastikan Docker Desktop aktif, lalu jalankan:
```bash
docker compose up --build
```
> **Catatan:** Keycloak butuh ~30-60 detik untuk booting. Frontend dan backend akan otomatis terhubung setelah Keycloak siap.

### 2. Akses Aplikasi
| Layanan | URL | Keterangan |
|---------|-----|------------|
| **Portal Dashboard** | `http://localhost:8000` | Pusat login (Iframe) |
| **App Dukcapil** | `http://localhost:3000` | Auto-login & App Registration |
| **App Kominfo** | `http://localhost:3001` | Auto-login & App Registration |
| **App Pendidikan** | `http://localhost:3002` | Auto-login & App Registration |
| **Keycloak Admin** | `http://localhost:8080` | user: `admin` / pass: `admin123` |

---

## 👥 Seeding Data & Akun Demo

Sistem ini mendukung pengisian akun (sinkronisasi) dari file CSV (`penduduk_8000.csv`, `asn_8000.csv`, `siswa_8000.csv`).

### Cara Menjalankan Skrip Seeding
Untuk menguji coba sinkronisasi (memasukkan 20 data pertama dari masing-masing CSV ke Keycloak & Assign Group otomatis):
```bash
node test-insert-20.js
```
*Note: Skrip sudah dilengkapi sanitasi email otomatis untuk format data yang kurang rapi di CSV (contoh: `ir..julia`)*

### Akun Admin Bawaan
Akun berikut digenerate oleh Keycloak/Skrip untuk akses Admin (Password selalu `admin123` atau `19560130` jika mengambil TTL dari CSV):
- `admin_dukcapil` (Masuk Grup: Admin Dukcapil → Mendapat Akses Admin di App 1)
- `admin_kominfo` (Masuk Grup: Admin Kominfo → Mendapat Akses Admin di App 2)
- `admin_pendidikan` (Masuk Grup: Admin Pendidikan → Mendapat Akses Admin di App 3)

---

## 🛑 Stop & Cleanup

```bash
# Stop semua container
docker compose down

# Stop + Hapus seluruh database (Reset Keycloak & DB Apps)
docker compose down -v
```