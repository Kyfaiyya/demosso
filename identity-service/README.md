# Identity Service - Smart City SSO

Identity Service bertindak sebagai pusat manajemen identitas pengguna (Identity and Access Management) untuk platform Smart City. Service ini dibuat menggunakan arsitektur modular NestJS (TypeScript), Prisma (PostgreSQL), dan terintegrasi dengan Keycloak Admin API.

## Fitur Utama

- **User Management**: CRUD User dengan sinkronisasi otomatis ke Keycloak.
- **Organization Management**: Manajemen data organisasi (OPD/Dinas) dan relasi dengan User.
- **Role Management**: RBAC (SUPER_ADMIN, ADMIN_OPD, ASN, MASYARAKAT).
- **Audit Log**: Pencatatan riwayat aktivitas pengguna.
- **Security**: Request Logging, Global Exception Filter, Validation Pipe.

## Teknologi

- **Framework**: NestJS (v10)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth/SSO**: Keycloak
- **Validasi**: class-validator & class-transformer

## Struktur Direktori (Clean Architecture)

```
identity-service/
├── prisma/
│   └── schema.prisma        # Definisi database schema
├── src/
│   ├── common/              # Decorators, Filters, Guards, Middlewares
│   ├── config/              # Konfigurasi aplikasi
│   ├── modules/
│   │   ├── audit/           # Layanan log aktivitas
│   │   ├── keycloak/        # Wrapper Keycloak Admin REST API
│   │   ├── organizations/   # CRUD OPD/Dinas
│   │   ├── roles/           # RBAC manajemen role
│   │   └── users/           # IAM / CRUD Pengguna
│   ├── prisma/              # Prisma DB Service
│   ├── app.module.ts        # Root Module
│   └── main.ts              # Entry point aplikasi
├── .env                     # Variabel Environment
├── docker-compose.yml       # Konfigurasi Docker (App & DB)
└── package.json             # Dependensi proyek
```

## Cara Instalasi dan Menjalankan (Local Development)

### 1. Install Dependensi
```bash
cd identity-service
npm install
```

### 2. Konfigurasi Environment Variable
Pastikan `.env` sudah diisi sesuai dengan konfigurasi Keycloak dan Database Anda:
```env
PORT=4003
DATABASE_URL="postgresql://sso_admin:sso_password@localhost:5433/identity_db?schema=public"

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=sso-demo
KEYCLOAK_CLIENT_ID=admin-cli
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=admin123
```

### 3. Jalankan PostgreSQL via Docker Compose
Gunakan Docker untuk menjalankan database khusus Identity Service:
```bash
docker-compose up -d identity-db
```
*(Catatan: DB berjalan di port `5433` lokal agar tidak bentrok dengan `postgres` SSO utama).*

### 4. Push Skema Prisma ke Database
```bash
npm run prisma:generate
npm run prisma:push
```

### 5. Jalankan Aplikasi
```bash
# Mode development (live reload)
npm run start:dev
```
Aplikasi akan berjalan di `http://localhost:4003`.

## Cara Menjalankan Penuh via Docker (Production)

Anda dapat langsung menjalankan aplikasi dan databasenya melalui satu perintah:
```bash
docker-compose up --build -d
```
Docker akan melakukan build NestJS dan menyalakan port `4003`.

## Endpoint API Utama

**Users**
- `POST /users` (Create user & sync to Keycloak)
- `GET /users` (List all users)
- `GET /users/:id` (Get user by ID)
- `PATCH /users/:id/activate` (Enable user in DB & Keycloak)
- `PATCH /users/:id/disable` (Disable user in DB & Keycloak)

**Roles & Organizations**
- `POST /users/:id/roles` (Assign role to user)
- `DELETE /users/:id/roles/:roleId` (Remove role)
- `GET /organizations` (List OPD)
- `POST /organizations` (Create OPD)

**Audit Logs**
- `GET /audit-logs` (Melihat riwayat aktivitas)
