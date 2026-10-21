# UNIVERSITAS HARKAT NEGERI
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  
**Mata Kuliah:** Pemrograman Web Service (5537344)  
**Tugas Kelompok Minggu ke-4: API Design Document v1**  
*Bagian pertama Milestone M2 - API Blueprint. Dokumen ini akan dikonversi menjadi OpenAPI pada Minggu ke-5.*

---

## A. Identitas Proyek & Konvensi

| Atribut | Keterangan |
|---|---|
| **Nama Project** | BengkelMotor (Sistem Informasi Layanan Penjadwalan Servis dan Manajemen Riwayat Perawatan Berkala) |
| **Mata Kuliah / SKS** | Pemrograman Web Service / 3 SKS |
| **Kelompok** | Kelompok 2 |
| **Semester** | Semester 7 (Ganjil) 2026/2027 |
| **Deskripsi** | Platform layanan bengkel motor terintegrasi dengan penjadwalan servis instan (auto-confirm), kontrol konkurensi (pessimistic locking anti-overbooking), logbook digital mekanik, dan pelacakan riwayat perawatan berkala transparan. |
| **Versi API** | v1 (prefix `/api/v1`) |
| **Bahasa Penamaan** | Inggris (resource & atribut JSON), pesan respon berbahasa Indonesia |

### Anggota Tim & Tanggung Jawab Modul/Fitur

| No | Nama Mahasiswa | NIM | Tanggung Jawab Modul / Fitur |
|---|---|---|---|
| 1 | Intan Komalasari | 23215012 | Auth & User Profile Module (Sanctum JWT, RBAC 3 Role) |
| 2 | Feldi Sanjaya | 23215022 | Vehicle Fleet Module (Manajemen Motor, Ownership Policy) |
| 3 | Imzy Zulijar Setiawan | 23215035 | Service Slot & Schedule Module (Kapasitas & Kuota Real-Time) |
| 4 | Eko Saputro | 23215050 | Booking & Concurrency Module (Pessimistic Locking Auto-Confirm) |
| 5 | Zakky Fawwaz Mubarok | 23215061 | Service Record & Logbook Module (Tindakan, Odometer, Suku Cadang JSON) |

### Lingkungan & Base URL

| Komponen | Base URL | Keterangan |
|---|---|---|
| **Backend API Server** | `http://localhost:8000/api/v1` | Titik masuk utama API (Laravel 12 REST API Server) |
| **Frontend Web Client** | `http://localhost:5173` | Antarmuka pengguna responsif React 19 + TypeScript + Vite |
| **Testing Client (Postman)** | `http://localhost:8000/api/v1` | Lingkungan pengujian manual & otomatis Postman / Bruno |

### Konvensi Penamaan

| Aspek | Konvensi | Contoh |
|---|---|---|
| **URI path** | Kata benda jamak, huruf kecil, kebab-case, tanpa kata kerja, nesting maks. 2 tingkat | `/api/v1/bookings/{id}/records` |
| **Atribut JSON** | `snake_case` | `booking_code`, `kuota_maksimal`, `odometer_km` |
| **Query parameter** | `snake_case`; sort dengan awalan minus untuk descending | `?per_page=15&sort=-tanggal` |
| **Format waktu** | ISO 8601 dengan zona waktu | `2026-10-16T17:45:00+07:00` |
| **Header wajib** | JSON untuk request dan response | `Content-Type: application/json`, `Accept: application/json` |
| **Otentikasi** | Bearer Token (Laravel Sanctum) pada header Authorization | `Authorization: Bearer ***` |

---

## B. Pemodelan Resource & Relasi

Total 10 resource (9 resource data + 1 singleton me).

| No | Resource | Modul | Atribut Utama & Tipe Data | Jenis |
|---|---|---|---|---|
| 1 | `users` | Auth | `id` (bigint, PK), `nama` (string), `email` (string, unik), `no_hp` (string), `password` (string, hash), `role` (enum: CUSTOMER, MECHANIC, ADMIN), `created_at` (datetime) | Collection |
| 2 | `me` | Auth | Gabungan data akun user yang login beserta token metadata | Singleton |
| 3 | `vehicles` | Vehicle | `id` (bigint, PK), `user_id` (bigint, FK), `no_polisi` (string, unik), `merk` (string), `model` (string), `tahun` (integer: 1990-2030), `created_at` (datetime) | Collection |
| 4 | `service_slots` | Slot | `id` (bigint, PK), `tanggal` (date), `jam_mulai` (time), `kuota_maksimal` (integer), `terisi` (integer, default 0), `is_available` (boolean computed) | Collection |
| 5 | `bookings` | Booking | `id` (bigint, PK), `booking_code` (string, unik), `user_id` (bigint, FK), `vehicle_id` (bigint, FK), `slot_id` (bigint, FK), `keluhan` (text), `status` (enum: CONFIRMED, IN_SERVICE, COMPLETED, CANCELLED) | Collection |
| 6 | `service_records` | Record | `id` (bigint, PK), `booking_id` (bigint, FK unik), `mechanic_id` (bigint, FK), `odometer_km` (integer), `tindakan` (text), `suku_cadang` (json), `catatan_mekanik` (text), `created_at` (datetime) | Collection |
| 7 | `parts` | Record | `nama` (string), `qty` (integer), `keterangan` (string) | Sub-resource JSON |
| 8 | `vehicle_history` | Record | Agregasi riwayat servis kronologis berdasarkan `no_polisi` motor | Sub-resource |
| 9 | `mechanic_tasks` | Booking | Antrean kerja pit servis khusus kendaraan status CONFIRMED / IN_SERVICE | Sub-resource |
| 10 | `booking_cancellations`| Booking | Data audit pembatalan booking beserta alasan dan pemulihan kuota | Sub-resource |

### Relasi Antar-Resource & Kardinalitas

| Relasi | Kardinalitas | Keterangan |
|---|---|---|
| `users (CUSTOMER)` - `vehicles` | 1 : N | Satu pelanggan dapat mendaftarkan banyak sepeda motor. |
| `vehicles` - `bookings` | 1 : N | Satu sepeda motor dapat memiliki riwayat banyak jadwal booking servis. |
| `service_slots` - `bookings` | 1 : N | Satu slot jam menampung beberapa booking sesuai batas `kuota_maksimal`. |
| `bookings` - `service_records` | 1 : 1 | Satu transaksi servis tuntas menghasilkan tepat satu dokumen logbook. |
| `users (MECHANIC)` - `service_records` | 1 : N | Satu mekanik mengerjakan dan mencatat banyak logbook servis. |
| `service_records` - `parts` | 1 : N | Satu lembar servis mencatat daftar komponen suku cadang yang diganti (JSON). |

---

## C. Endpoint Matrix (Minimal 15 Endpoint, Disajikan 25 Endpoint Lengkap)

| No | Method | Endpoint | Fungsi | Aktor | Sukses | Gagal |
|---|---|---|---|---|---|---|
| **Auth & User Profile (Intan)** | | | | | | |
| 1 | `POST` | `/api/v1/auth/register` | Mendaftarkan akun pelanggan baru | Public | 201 | 409, 422 |
| 2 | `POST` | `/api/v1/auth/login` | Login akun dan menerbitkan Bearer Token | Public | 200 | 401, 422 |
| 3 | `POST` | `/api/v1/auth/logout` | Mencabut token aktif pengguna | Semua (Login) | 200 | 401 |
| 4 | `GET` | `/api/v1/me` | Melihat profil pengguna yang sedang login | Semua (Login) | 200 | 401 |
| 5 | `PATCH` | `/api/v1/me` | Mengubah profil pribadi pengguna | Semua (Login) | 200 | 401, 422 |
| 6 | `GET` | `/api/v1/users` | Mengambil master daftar seluruh pengguna | Admin | 200 | 401, 403 |
| **Vehicle Fleet (Feldi)** | | | | | | |
| 7 | `GET` | `/api/v1/vehicles` | Mengambil daftar motor milik sendiri | Customer | 200 | 401 |
| 8 | `POST` | `/api/v1/vehicles` | Mendaftarkan motor baru ke sistem | Customer | 201 | 401, 409, 422 |
| 9 | `GET` | `/api/v1/vehicles/{id}` | Mengambil detail spesifik sepeda motor | Customer (Owner), Admin | 200 | 401, 403, 404 |
| 10 | `PUT` | `/api/v1/vehicles/{id}` | Mengganti seluruh data sepeda motor | Customer (Owner) | 200 | 401, 403, 404, 422 |
| 11 | `DELETE`| `/api/v1/vehicles/{id}` | Menghapus unit motor dari akun | Customer (Owner) | 200 / 204 | 401, 403, 404, 409 |
| **Service Slot & Capacity (Imzy)** | | | | | | |
| 12 | `GET` | `/api/v1/service-slots` | Katalog kuota slot servis per tanggal | Public / Customer | 200 | 422 |
| 13 | `POST` | `/api/v1/service-slots` | Membuat slot alokasi kuota servis baru | Admin | 201 | 401, 403, 409, 422 |
| 14 | `PUT` | `/api/v1/service-slots/{id}` | Memperbarui kuota maksimal slot servis | Admin | 200 | 401, 403, 404, 422 |
| 15 | `DELETE`| `/api/v1/service-slots/{id}`| Menghapus slot servis belum terisi | Admin | 200 / 204 | 401, 403, 404, 409 |
| **Booking & Concurrency (Eko)** | | | | | | |
| 16 | `POST` | `/api/v1/bookings` | Reservasi servis (Auto-Confirm & Lock) | Customer | 201 | 401, 403, 404, 409, 422 |
| 17 | `GET` | `/api/v1/bookings` | Mengambil daftar riwayat booking servis | Customer, Mechanic, Admin | 200 | 401 |
| 18 | `GET` | `/api/v1/bookings/{id}` | Melihat detail satu transaksi booking | Customer (Owner), Mechanic, Admin | 200 | 401, 403, 404 |
| 19 | `PATCH` | `/api/v1/bookings/{id}/cancel` | Membatalkan booking & pulihkan kuota | Customer (Owner), Admin | 200 | 401, 403, 404, 409, 422 |
| 20 | `GET` | `/api/v1/mechanic/bookings`| Antrean motor siap servis di pit | Mechanic | 200 | 401, 403 |
| **Service Record & History (Zakky)** | | | | | | |
| 21 | `POST` | `/api/v1/service-records` | Rekam logbook servis & suku cadang | Mechanic | 201 | 401, 403, 404, 409, 422 |
| 22 | `GET` | `/api/v1/service-records/{id}` | Melihat detail logbook servis spesifik | Customer, Mechanic, Admin | 200 | 401, 403, 404 |
| 23 | `GET` | `/api/v1/bookings/{id}/records` | Melihat riwayat pengerjaan per booking | Customer, Mechanic, Admin | 200 | 401, 403, 404 |
| 24 | `GET` | `/api/v1/service-history` | Lacak riwayat servis via plat nomor | Public / Customer | 200 | 422 |
| 25 | `GET` | `/api/v1/health` | Status operasional backend & database | Public | 200 | 500 |

---

## D. Desain Query: Filtering, Searching, Sorting & Pagination

### 1. GET /api/v1/service-slots
- `tanggal` (Filter): `?tanggal=2026-10-06` (Format `YYYY-MM-DD`, default hari ini).
- `tersedia` (Filter): `?tersedia=true` (Menampilkan slot yang `terisi < kuota_maksimal`).
- `sort` (Sort): `?sort=jam_mulai` (Whitelist: `jam_mulai`, `kuota_maksimal`, `terisi`).
- `page` / `per_page` (Pagination): `?page=1&per_page=10` (Default 1/15, maksimum 50).

### 2. GET /api/v1/bookings
- `status` (Filter): `?status=CONFIRMED,IN_SERVICE` (Whitelist: `CONFIRMED`, `IN_SERVICE`, `COMPLETED`, `CANCELLED`).
- `vehicle_id` (Filter relasi): `?vehicle_id=1` (ID kendaraan valid milik pemohon).
- `q` (Search): `?q=BK-20261004` (Pencarian kode booking atau nama pelanggan).
- `sort` (Sort): `?sort=-created_at` (Whitelist: `created_at`, `id`, `status`).
- `page` / `per_page` (Pagination): `?page=1&per_page=15` (Default 1/15, maks 50).

### 3. GET /api/v1/service-history
- `no_polisi` (Filter Wajib): `?no_polisi=G 2222 KL` (Nomor polisi motor yang dicari).
- `sort` (Sort): `?sort=-created_at` (Urutan riwayat servis terbaru).

---

## E. Desain Representasi Data

### 1. Item: GET /api/v1/bookings/1 → 200 OK
```json
{
  "status": "success",
  "message": "Detail reservasi servis berhasil diambil",
  "data": {
    "id": 1,
    "booking_code": "BK-20261004-7A9B",
    "user_id": 3,
    "vehicle_id": 1,
    "slot_id": 1,
    "keluhan": "Ganti oli mesin MPX2 dan servis berkala 10.000 KM",
    "status": "CONFIRMED",
    "vehicle": {
      "id": 1,
      "no_polisi": "G 2222 KL",
      "merk": "Yamaha",
      "model": "Aerox 155 Connected",
      "tahun": 2023
    },
    "slot": {
      "id": 1,
      "tanggal": "2026-10-06",
      "jam_mulai": "09:00:00",
      "kuota_maksimal": 5,
      "terisi": 1
    },
    "created_at": "2026-10-04T15:10:00+07:00",
    "updated_at": "2026-10-04T15:10:00+07:00"
  },
  "meta": { "timestamp": "2026-10-04T15:10:00+07:00", "version": "v1" }
}
```

### 2. Collection: GET /api/v1/service-slots?tanggal=2026-10-06&page=1&per_page=2 → 200 OK
```json
{
  "status": "success",
  "message": "Katalog slot servis berhasil diambil",
  "data": [
    {
      "id": 1,
      "tanggal": "2026-10-06",
      "jam_mulai": "08:00:00",
      "kuota_maksimal": 5,
      "terisi": 1,
      "is_available": true
    },
    {
      "id": 2,
      "tanggal": "2026-10-06",
      "jam_mulai": "09:00:00",
      "kuota_maksimal": 5,
      "terisi": 5,
      "is_available": false
    }
  ],
  "links": {
    "first": "http://localhost:8000/api/v1/service-slots?page=1&per_page=2",
    "last": "http://localhost:8000/api/v1/service-slots?page=4&per_page=2",
    "prev": null,
    "next": "http://localhost:8000/api/v1/service-slots?page=2&per_page=2"
  },
  "meta": {
    "timestamp": "2026-10-04T15:15:00+07:00",
    "version": "v1",
    "current_page": 1,
    "per_page": 2,
    "total": 8
  }
}
```

### 3. Create: POST /api/v1/bookings → 201 Created (+ Location Header)
```json
// Request Body
{
  "vehicle_id": 1,
  "slot_id": 1,
  "keluhan": "Ganti oli mesin MPX2 dan setel rantai roda"
}

// Response Body
{
  "status": "success",
  "message": "Reservasi servis berhasil dibuat dan otomatis terkonfirmasi (Auto-Confirm)",
  "data": {
    "id": 1,
    "booking_code": "BK-20261004-7A9B",
    "status": "CONFIRMED",
    "slot_id": 1,
    "vehicle_id": 1
  },
  "meta": { "timestamp": "2026-10-04T15:20:00+07:00", "version": "v1" }
}
```

---

## F. Error & Status Code Standar

Seluruh error menggunakan struktur terstandarisasi:
```json
{
  "status": "error",
  "message": "Deskripsi kesalahan yang mudah dipahami manusia",
  "code": "ERROR_CONSTANT_CODE",
  "errors": {
    "field_name": ["Detail pesan validasi spesifik"]
  },
  "meta": { "timestamp": "2026-10-04T15:25:00+07:00", "version": "v1" }
}
```

### 1. Contoh Validasi Gagal: POST /api/v1/bookings → 422 Unprocessable Content
```json
{
  "status": "error",
  "message": "Data yang dikirim tidak valid.",
  "code": "VALIDATION_FAILED",
  "errors": {
    "vehicle_id": ["Bidang vehicle_id wajib diisi."],
    "slot_id": ["Slot servis yang dipilih tidak valid atau sudah kedaluwarsa."]
  },
  "meta": { "timestamp": "2026-10-04T15:25:00+07:00", "version": "v1" }
}
```

### 2. Contoh Aturan Bisnis: POST /api/v1/bookings → 409 Conflict
```json
{
  "status": "error",
  "message": "Slot servis pada jam yang dipilih sudah penuh (kapasitas maksimal telah tercapai).",
  "code": "SLOT_CAPACITY_EXCEEDED",
  "meta": { "timestamp": "2026-10-04T15:25:00+07:00", "version": "v1" }
}
```

### 3. Daftar Kode Error Sistem Bengkel

| code | Status | Kondisi |
|---|---|---|
| `VALIDATION_FAILED` | 422 | Field body atau parameter query string tidak valid |
| `UNAUTHENTICATED` | 401 | Token tidak ada, tidak valid, atau kedaluwarsa |
| `FORBIDDEN` | 403 | Role atau kepemilikan motor tidak sesuai |
| `RESOURCE_NOT_FOUND` | 404 | ID motor, booking, atau slot tidak ditemukan |
| `EMAIL_ALREADY_REGISTERED`| 409 | Registrasi dengan email yang sudah ada |
| `PLATE_ALREADY_EXISTS` | 409 | Mendaftarkan motor dengan nomor polisi yang sudah terdaftar |
| `SLOT_CAPACITY_EXCEEDED` | 409 | Mencoba booking slot yang kuota maksimalnya telah habis |
| `BOOKING_ALREADY_SERVICED`| 409 | Mencatat logbook pada booking yang sudah berstatus COMPLETED |
| `BOOKING_ALREADY_CANCELLED`| 409 | Membatalkan booking yang sudah berstatus CANCELLED |

---

## G. Aksi Non-CRUD

| Proses Bisnis | Endpoint & Pola | Alasan |
|---|---|---|
| **Reservasi Auto-Confirm & Concurrency Lock** | `POST /api/v1/bookings`<br>*(Atomik DB Transaction)* | Menghindari endpoint kata kerja `/confirmBooking`. Backend secara atomik mengunci baris slot dengan `lockForUpdate()`, memverifikasi sisa kuota, membuat booking status `CONFIRMED`, dan menaikkan kuota terisi. |
| **Pembatalan Booking & Pemulihan Kuota** | `PATCH /api/v1/bookings/{id}/cancel`<br>*(Sub-resource Transition)* | Status booking berubah menjadi `CANCELLED` dan counter kuota terisi pada slot jam terkait otomatis dikurangi 1 tanpa menghapus rekaman riwayat (audit trail). |
| **Pencatatan Logbook Suku Cadang Digital** | `POST /api/v1/service-records`<br>*(Document Record Creation)* | Mekanik menyimpan rincian tindakan, kilometer odometer, dan array JSON suku cadang, sekaligus otomatis mentransisikan status booking dari `CONFIRMED` menjadi `COMPLETED`. |

---

## H. Catatan Keputusan Desain

1. **Auto-Confirm Booking:** Menggantikan sistem konfirmasi manual admin agar pelanggan mendapatkan kepastian jadwal instan.
2. **Pessimistic Row Lock (`lockForUpdate`):** Dipilih untuk menjamin integritas transaksi atomik saat beberapa pelanggan berebut memesan slot jam yang sama secara bersamaan (anti race condition / overbooking).
3. **Penyimpanan Suku Cadang JSON:** Disimpan dalam kolom tipe JSON fleksibel pada tabel `service_records` untuk efisiensi transaksi servis tanpa overhead tabel pivot kompleks.
4. **Ownership Policy Authorization:** Pelanggan hanya berhak mengakses dan mendaftarkan servis untuk motor miliknya sendiri (`user_id == auth()->id()`).
5. **Envelope JSON Seragam:** Menggunakan envelope standar `{ "status", "message", "data", "meta" }` untuk memudahkan integrasi client React dan interceptor Axios.

---

## Lampiran: Hasil Peer Review

| No | Butir Pemeriksaan | Ya | Tidak | Catatan Reviewer | Perbaikan |
|---|---|---|---|---|---|
| 1 | URI kata benda jamak, huruf kecil, tanpa kata kerja | [ v ] | [   ] | Sesuai konvensi RESTful | Tidak ada |
| 2 | Prefix `/api/v1` dipakai konsisten | [ v ] | [   ] | Sangat konsisten | Tidak ada |
| 3 | Method sesuai operasi; GET tidak mengubah data | [ v ] | [   ] | Idempotent & Safe terpenuhi | Tidak ada |
| 4 | POST -> 201, DELETE -> 204/200, status gagal dicantumkan | [ v ] | [   ] | Lengkap dengan header Location | Tidak ada |
| 5 | Nesting maksimal 2 tingkat | [ v ] | [   ] | Terjaga rapi (`/bookings/{id}/records`) | Tidak ada |
| 6 | Collection memiliki pagination dengan batas maksimum | [ v ] | [   ] | Page-based + meta links | Tidak ada |
| 7 | Filter/sort memakai query parameter dengan whitelist | [ v ] | [   ] | Aman dari injection | Tidak ada |
| 8 | Format error seragam | [ v ] | [   ] | Error envelope konsisten | Tidak ada |
