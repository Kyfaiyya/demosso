# 🔐 SSO Demo — Keycloak + Node.js + React

Project Single Sign-On (SSO) lengkap menggunakan **Keycloak** sebagai Identity Provider,
**Express** sebagai backend API, dan **React** sebagai frontend.

---

## 🏗 Arsitektur

```
┌─────────────────────────────────────────────────────┐
│                   Browser (User)                    │
└────────┬───────────────────────────┬────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐       ┌──────────────────────┐
│  React Frontend │       │  Keycloak Auth Server│
│  :3000          │◄─────►│  :8080               │
│                 │  PKCE │  Realm: sso-demo      │
└────────┬────────┘       └──────────────────────┘
         │ Bearer JWT               ▲
         ▼                          │ JWKS verify
┌─────────────────┐                 │
│  Express Backend│─────────────────┘
│  :4000          │
│  /api/user/*    │
│  /api/data/*    │
└─────────────────┘
```

## 📁 Struktur Project

```
sso-keycloak/
├── docker-compose.yml
├── keycloak/
│   └── realm-config/
│       └── sso-demo-realm.json      ← Auto-import realm
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js                 ← Express app
│       ├── middleware/
│       │   └── auth.js              ← JWT verify via JWKS
│       └── routes/
│           ├── auth.js              ← Introspect, logout
│           ├── user.js              ← Profile, session, RBAC
│           └── data.js              ← Products, reports
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx                 ← Keycloak init
        ├── App.jsx                  ← Router + AuthContext
        ├── keycloak.js              ← Keycloak singleton
        ├── components/
        │   ├── Layout.jsx           ← Sidebar navigation
        │   └── Card.jsx
        └── pages/
            ├── Landing.jsx          ← Login page
            ├── Dashboard.jsx        ← Home setelah login
            ├── Profile.jsx          ← Data user dari Keycloak
            ├── Products.jsx         ← CRUD dengan RBAC
            ├── Reports.jsx          ← Manager/Admin only
            └── TokenDebug.jsx       ← JWT inspector
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Docker Desktop (atau Docker Engine + Compose v2)

### 1. Clone / copy project ini

```bash
cd sso-keycloak
```

### 2. Jalankan semua service

```bash
docker compose up --build
```

> Keycloak butuh ~30-60 detik untuk siap. Backend & frontend akan menunggu secara otomatis.

### 3. Akses aplikasi

| Service      | URL                                              |
|--------------|--------------------------------------------------|
| **Portal**     | http://localhost:8000                            |
| **Frontend 1** | http://localhost:3000 (Dukcapil)                 |
| **Frontend 2** | http://localhost:3001 (Kominfo)                  |
| **Frontend 3** | http://localhost:3002 (Layanan Pendidikan)       |
| **Backend**  | http://localhost:4000, 4001, 4002                |
| **Keycloak** | http://localhost:8080                            |
| Keycloak Admin | http://localhost:8080 → user: `admin` / `admin123` |

---

## 👤 Akun Demo

| Username | Password  | Role                    |
|----------|-----------|-------------------------|
| `admin`  | `admin123`| app-admin, app-manager, app-user |
| `budi`   | `budi456` | app-manager, app-user   |
| `sari`   | `sari789` | app-user                |

---

## 🛡 Role & Hak Akses

| Endpoint                  | app-user | app-manager | app-admin |
|---------------------------|:--------:|:-----------:|:---------:|
| GET /api/user/profile     | ✅       | ✅          | ✅        |
| GET /api/data/products    | ✅       | ✅          | ✅        |
| GET /api/data/reports     | ❌       | ✅          | ✅        |
| DELETE /api/data/products | ❌       | ❌          | ✅        |
| GET /api/user/admin-info  | ❌       | ❌          | ✅        |

---

## 🔑 Alur SSO (PKCE Flow)

```
1. User klik "Login" di React
2. Redirect ke Keycloak login page (/realms/sso-demo/protocol/openid-connect/auth)
3. User masukkan username/password di Keycloak
4. Keycloak verifikasi → terbitkan Authorization Code
5. Frontend tukar Code + PKCE verifier → Access Token + Refresh Token
6. Frontend simpan token di memory (bukan localStorage)
7. Setiap request ke backend menyertakan Bearer token
8. Backend verifikasi token via JWKS endpoint Keycloak
9. Refresh otomatis sebelum token expired
```

---

## 🔧 Konfigurasi Environment

### Backend (docker-compose.yml)
```env
KEYCLOAK_URL=http://keycloak:8080
KEYCLOAK_REALM=sso-demo
KEYCLOAK_CLIENT_ID=backend-api
KEYCLOAK_CLIENT_SECRET=backend-secret-1234
FRONTEND_URL=http://localhost:3000
```

### Frontend (docker-compose.yml)
```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=sso-demo
VITE_KEYCLOAK_CLIENT_ID=frontend-app
VITE_API_URL=http://localhost:4000
```

---

## 🛑 Stop & Cleanup

```bash
# Stop semua container
docker compose down

# Stop + hapus volume (reset Keycloak data)
docker compose down -v
```


Admin Dukcapil:
Username: admin_dukcapil
Password: admin123 (Mendapat role ADMIN di App Dukcapil, bisa menambah data penduduk/karyawan)
Admin Kominfo:
Username: admin_kominfo
Password: admin123 (Mendapat role ADMIN di App Kominfo, bisa mendaftarkan SIM dan ASN)

Admin Pendidikan:
Username: admin_pendidikan
Password: admin123 (Mendapat role ADMIN di App Pendidikan, bisa menambah siswa)

node sync-to-keycloak.js asn
node sync-to-keycloak.js penduduk
node sync-to-keycloak.js siswa