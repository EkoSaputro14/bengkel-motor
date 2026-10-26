# RESTful API Layanan Penjadwalan Servis & Manajemen Riwayat Perawatan Berkala Bengkel Motor

**Kelompok 2 — Imzy Zulijar Setiawan**

Aplikasi PHP **murni (tanpa framework)** yang strukturnya meniru Laravel, agar mudah
dimigrasikan ke Laravel di kemudian hari.

## Fitur (sesuai dokumen spesifikasi)

- ✅ Autentikasi pengguna berbasis token (pengganti Sanctum/JWT)
- ✅ Manajemen profil kendaraan milik pelanggan (nomor polisi, merk, model, tahun)
- ✅ Validasi kuota & reservasi slot waktu servis motor (transaksi atomik, anti-overbooking)
- ✅ Pencatatan logbook servis & suku cadang yang diganti oleh mekanik
- ✅ Pencarian riwayat servis berdasarkan nomor polisi motor
- ✅ Antarmuka web sederhana untuk pelanggan, layar mekanik, dan panel admin
- ✅ Dokumentasi API: OpenAPI (`docs/openapi.yaml`) + Postman Collection (`docs/postman_collection.json`)
- ✅ Kode status HTTP standar: 200, 201, 401, 403, 404, 409, 422

## Cara Menjalankan

### Prasyarat
- PHP ≥ 8.0 dengan ekstensi `pdo_sqlite` (bawaan) atau `pdo_mysql`

### 1. Menjalankan dengan SQLite (paling mudah, tanpa instalasi apa pun)

```bash
cd bengkel-api
php -S localhost:8000 -t public public/router.php
```

Database SQLite dibuat + di-seed otomatis saat request pertama (`database/bengkel.sqlite`).

### 2. Menjalankan dengan MySQL

1. Impor skema: `mysql -u root -p < database/schema.sql`
2. Ubah `config/config.php`: `define('DB_DRIVER', 'mysql');` lalu sesuaikan kredensial.
3. Jalankan server seperti di atas.

### Akun contoh (password: `password123`)

| Peran      | Email                |
|------------|----------------------|
| Admin      | admin@bengkel.test   |
| Mekanik    | mekanik@bengkel.test |
| Pelanggan  | budi@mail.test       |

Buka `http://localhost:8000` → halaman beranda → portal Pelanggan / Mekanik / Admin,
atau `http://localhost:8000/api-docs` untuk dokumentasi endpoint.

## Struktur Proyek (padanan Laravel)

```
bengkel-api/
├── public/
│   ├── index.php        ← front controller (padanan public/index.php Laravel)
│   ├── router.php       ← router untuk php -S (padanan .htaccess)
│   ├── .htaccess        ← rewrite untuk Apache
│   └── assets/          ← CSS + JS halaman (padanan resources/js, resources/css)
├── app/
│   ├── Core/            ← inti mini-framework
│   │   ├── Database.php ← koneksi PDO singleton  (padanan Eloquent/DB facade)
│   │   ├── Response.php ← helper JSON + kode HTTP (padanan response()->json())
│   │   └── Auth.php     ← autentikasi Bearer token (padanan Sanctum auth:sanctum)
│   ├── Controllers/     ← padanan app/Http/Controllers
│   │   ├── AuthController.php            (register, login, me, logout)
│   │   ├── VehicleController.php         (CRUD kendaraan + otorisasi pemilik)
│   │   ├── SlotController.php            (kuota slot; create khusus admin)
│   │   ├── BookingController.php         (reservasi, batal, ubah status)
│   │   └── ServiceRecordController.php   (logbook mekanik, riwayat per no. polisi)
│   └── Models/          ← padanan Eloquent Model
│       ├── User.php, Vehicle.php, ServiceSlot.php, Booking.php, ServiceRecord.php
├── routes/
│   └── api.php          ← tabel rute (padanan routes/api.php)
├── views/               ← padanan resources/views (Blade)
│   ├── partials/ (header, footer)
│   ├── home, login, register, pelanggan, mekanik, admin, api-docs
├── config/
│   └── config.php       ← padanan .env + config/database.php
├── database/
│   ├── schema.sql       ← skema MySQL (5 tabel inti)
│   ├── init_sqlite.php  ← migrasi + seeder SQLite otomatis
│   └── bengkel.sqlite   ← dibuat otomatis
└── docs/
    ├── openapi.yaml           ← dokumentasi OpenAPI 3.0
    └── postman_collection.json
```

## Endpoint API

| Metode | Endpoint | Keterangan | Akses |
|--------|----------|------------|-------|
| POST | /api/auth/register | Registrasi + token | publik |
| POST | /api/auth/login | Login + token | publik |
| GET | /api/auth/me | Profil saat ini | token |
| POST | /api/auth/logout | Cabut token | token |
| GET/POST | /api/vehicles | Daftar / tambah kendaraan | token |
| PUT/DELETE | /api/vehicles/{id} | Ubah / hapus kendaraan | pemilik |
| GET | /api/slots?tanggal=YYYY-MM-DD | Slot & sisa kuota | publik |
| GET | /api/slots/available | Tanggal tersedia (14 hari) | publik |
| POST | /api/slots | Buat slot | admin |
| GET/POST | /api/bookings | Daftar / reservasi booking | token |
| GET | /api/bookings/{id} | Detail booking | pemilik/mekanik/admin |
| DELETE | /api/bookings/{id} | Batalkan (kuota kembali) | pemilik |
| PUT | /api/bookings/{id}/status | Ubah status pengerjaan | mekanik/admin |
| POST | /api/service-records | Catat tindakan + suku cadang | mekanik/admin |
| GET | /api/history?no_polisi=X | Riwayat servis per no. polisi | token |

Contoh memakai API:

```bash
# login, simpan token
TOKEN=$(curl -s -X POST localhost:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"budi@mail.test","password":"password123"}' | grep -o '"token": "[^"]*' | cut -d'"' -f4)

# lihat slot tersedia
curl "localhost:8000/api/slots?tanggal=$(date +%F)"

# reservasi (id kendaraan & slot dari daftar)
curl -X POST localhost:8000/api/bookings \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"vehicle_id":1,"slot_id":1,"keluhan":"Mesin kasar"}'
```

## Skema Data (5 tabel inti, sesuai dokumen)

- **users** (id, nama, no_hp, email, password, role, api_token)
- **vehicles** (id, user_id, no_polisi, merk, model, tahun)
- **service_slots** (id, tanggal, jam_mulai, kuota_maksimal, terisi) — UNIQUE(tanggal, jam_mulai)
- **bookings** (id, vehicle_id, slot_id, keluhan, status)
- **service_records** (id, booking_id, odometer_km, tindakan, suku_cadang, catatan_mekanik)

## Mitigasi Risiko (sesuai dokumen)

- **Overbooking**: penukaran kuota dilakukan dalam **transaksi atomik** (`beginTransaction`
  + pengecekan kuota di dalam transaksi); constraint UNIQUE mencegah slot ganda.
- **Otorisasi**: pelanggan hanya dapat mengakses kendaraan/booking/riwayat miliknya
  (dicek `user_id` di setiap endpoint), mekanik/admin terbatas pada perannya (403).

## Catatan Migrasi ke Laravel

| PHP murni (proyek ini)              | Laravel                                  |
|-------------------------------------|------------------------------------------|
| `config/config.php`                 | `.env` + `config/database.php`           |
| `routes/api.php` (array regex)      | `routes/api.php` + `Route::apiResource`  |
| `app/Core/Database.php` (PDO)       | Eloquent Model + migration               |
| `app/Core/Auth.php` (Bearer token)  | Laravel Sanctum (`auth:sanctum`)         |
| `app/Core/Response.php`             | `response()->json()` + FormRequest       |
| `app/Controllers/*`                 | `app/Http/Controllers/*`                 |
| `views/*.php` + `assets/*`          | Blade + Vite                             |
| `database/schema.sql`               | Migration + Seeder                       |
| validasi manual `if (empty(...))`   | FormRequest / `$request->validate()`     |

Alur bisnis, nama kolom, dan kontrak endpoint dirancang identik, sehingga migrasi
hanya memindahkan logika — antarmuka (JSON) tidak berubah.
