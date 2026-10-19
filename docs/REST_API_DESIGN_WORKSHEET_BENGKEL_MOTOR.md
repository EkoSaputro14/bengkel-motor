# REST API Design Worksheet
## Sistem Informasi Layanan Penjadwalan Servis dan Manajemen Riwayat Perawatan Berkala Bengkel Motor

Dokumen ini menyajikan rancangan antarmuka **REST API Design Worksheet** berorientasi *resource-based architecture* yang sesuai dengan standar konvensi RESTful (penggunaan kata benda jamak, pemanfaatan HTTP method semantik, dan bebas dari kata kerja di dalam URI path) untuk platform backend Bengkel Motor berbasis Laravel 12.

---

### Bagian A - Identifikasi Resource

Berikut adalah 5 resource entitas utama yang diidentifikasi dari skema basis data dan arsitektur backend sistem manajemen bengkel motor:

| No | Resource | Deskripsi |
|---|---|---|
| 1 | **users (pengguna)** | Entitas akun pengguna sistem yang mencakup tiga peran utama (Role-Based Access Control / RBAC): `CUSTOMER` (pelanggan), `MECHANIC` (mekanik servis), dan `ADMIN` (administrator bengkel), beserta kredensial autentikasi Bearer Token Laravel Sanctum. |
| 2 | **vehicles (kendaraan)** | Entitas sepeda motor milik pelanggan yang didaftarkan ke sistem, menyimpan metadata nomor polisi unik (`no_polisi`), merk pabrikan, model varian kendaraan, tahun produksi, serta relasi kepemilikan terisolasi ke akun pelanggan (`user_id`). |
| 3 | **service-slots (slot servis)** | Master alokasi jadwal operasional bengkel per tanggal (`tanggal`) dan jam mulai servis (`jam_mulai`), memuat kuota maksimal motor (`kuota_maksimal`), jumlah kuota terisi (`terisi`), dan status ketersediaan kapasitas secara real-time. |
| 4 | **bookings (reservasi servis)** | Transaksi reservasi jadwal servis oleh pelanggan yang mengikat kendaraan dan slot jam secara atomik, mencatat kode booking unik (`booking_code`), deskripsi keluhan kerusakan, serta status siklus hidup (`PENDING`, `CONFIRMED`, `IN_SERVICE`, `COMPLETED`, `CANCELLED`). |
| 5 | **service-records (riwayat perawatan)** | Dokumen rekam logbook digital perawatan berkala yang diisi mekanik setelah pengerjaan selesai, mencatat jarak tempuh speedometer (`odometer_km`), rincian tindakan perbaikan, daftar penggantian suku cadang (JSON), dan rekomendasi catatan mekanik. |

---

### Bagian B - Rancangan Endpoint

Rancangan endpoint di bawah ini menggunakan prefiks `/api/v1/`, berorientasi kata benda jamak (*plural nouns*), memanfaatkan relasi hierarki (*nested resources*) untuk asosiasi yang terikat kuat, dan tanpa kata kerja di dalam URI:

| No | Method | Endpoint | Fungsi |
|---|---|---|---|
| 1 | `POST` | `/api/v1/users` | Mendaftarkan akun pelanggan baru ke sistem bengkel (registrasi mandiri). |
| 2 | `GET` | `/api/v1/users/me` | Mengambil data profil dan role pengguna yang sedang login berdasarkan Bearer Token. |
| 3 | `PATCH` | `/api/v1/users/{id}` | Memperbarui profil akun atau mengubah status peran pengguna (khusus peran `ADMIN`). |
| 4 | `GET` | `/api/v1/vehicles` | Mengambil daftar sepeda motor terdaftar milik pelanggan yang terotentikasi (scope isolation). |
| 5 | `POST` | `/api/v1/vehicles` | Menambahkan unit kendaraan motor baru milik pelanggan ke basis data. |
| 6 | `GET` | `/api/v1/vehicles/{id}` | Mengambil detail spesifik sepeda motor berdasarkan ID (dilindungi Ownership Policy). |
| 7 | `PUT` | `/api/v1/vehicles/{id}` | Memperbarui data kendaraan (merk, model, tahun) milik pelanggan terkait. |
| 8 | `DELETE` | `/api/v1/vehicles/{id}` | Menghapus unit kendaraan bermotor yang terdaftar dari sistem. |
| 9 | `GET` | `/api/v1/service-slots` | Mengambil katalog slot ketersediaan servis bengkel dengan filter query string (`?tanggal=YYYY-MM-DD`). |
| 10 | `POST` | `/api/v1/service-slots` | Membuat alokasi slot jam servis dan kapasitas kuota baru (khusus peran `ADMIN`). |
| 11 | `PUT` | `/api/v1/service-slots/{id}` | Memperbarui kuota maksimal atau jam operasional slot servis tertentu (khusus `ADMIN`). |
| 12 | `DELETE` | `/api/v1/service-slots/{id}` | Menghapus slot operasional servis bengkel yang belum memiliki transaksi aktif. |
| 13 | `POST` | `/api/v1/bookings` | Mengajukan reservasi servis baru dengan mekanisme auto-confirm & pessimistic concurrency lock. |
| 14 | `GET` | `/api/v1/bookings` | Mengambil daftar riwayat booking servis (terfilter otomatis sesuai role: Customer, Mechanic, Admin). |
| 15 | `GET` | `/api/v1/bookings/{id}` | Mengambil informasi detail lengkap satu transaksi booking servis dan relasi motornya. |
| 16 | `PATCH` | `/api/v1/bookings/{id}` | Memperbarui status booking (pembatalan oleh pelanggan atau update status pengerjaan oleh mekanik). |
| 17 | `GET` | `/api/v1/bookings/{id}/records` | Mengambil riwayat logbook servis spesifik yang terikat pada transaksi booking tersebut. |
| 18 | `POST` | `/api/v1/service-records` | Mencatat logbook tindakan servis, odometer KM, dan rincian suku cadang (khusus `MECHANIC`). |

---

### Bagian C - Contoh Response JSON

Berikut adalah detail representasi response JSON (sukses dan gagal) untuk 3 endpoint representatif:

#### 1. Endpoint: GET /api/v1/vehicles/{id}
**Fungsi:** Menampilkan detail spesifik satu sepeda motor beserta data profil pemiliknya.

##### A. Response Sukses (200 OK)
```json
{
  "status": "success",
  "message": "Detail kendaraan berhasil diambil.",
  "data": {
    "id": 1,
    "user_id": 3,
    "no_polisi": "G 2222 KL",
    "merk": "Yamaha",
    "model": "Aerox 155 Connected",
    "tahun": 2023,
    "created_at": "2026-10-04T15:00:00.000000Z",
    "updated_at": "2026-10-04T15:00:00.000000Z",
    "owner": {
      "id": 3,
      "nama": "Budi Pelanggan",
      "email": "budi@pelanggan.com",
      "no_hp": "081234567890",
      "role": "CUSTOMER"
    }
  }
}
```

##### B. Response Error (404 Not Found)
```json
{
  "status": "error",
  "message": "Data kendaraan dengan ID 999 tidak ditemukan di sistem bengkel."
}
```
**Kondisi Pemicu Error:** Klien mengirimkan request dengan parameter `{id}` kendaraan yang tidak terdaftar di database atau telah dihapus.

---

#### 2. Endpoint: POST /api/v1/bookings
**Fungsi:** Pemesanan jadwal servis motor oleh pelanggan secara atomik dengan *Pessimistic Concurrency Locking*.

##### A. Response Sukses (201 Created)
```json
{
  "status": "success",
  "message": "Reservasi servis berhasil dibuat dan status otomatis terkonfirmasi (Auto-Confirm).",
  "data": {
    "id": 1,
    "booking_code": "BK-20261004-7A9B",
    "user_id": 3,
    "vehicle_id": 1,
    "slot_id": 1,
    "keluhan": "Ganti oli mesin MPX2 dan setel rantai roda",
    "status": "CONFIRMED",
    "created_at": "2026-10-04T15:10:00.000000Z",
    "updated_at": "2026-10-04T15:10:00.000000Z",
    "vehicle": {
      "id": 1,
      "no_polisi": "G 2222 KL",
      "merk": "Yamaha",
      "model": "Aerox 155 Connected"
    },
    "slot": {
      "id": 1,
      "tanggal": "2026-10-06",
      "jam_mulai": "09:00:00",
      "kuota_maksimal": 5,
      "terisi": 1
    }
  }
}
```

##### B. Response Error 1 (409 Conflict)
```json
{
  "status": "error",
  "message": "Slot servis pada jam yang dipilih sudah penuh (kapasitas maksimal telah tercapai)."
}
```
**Kondisi Pemicu Error:** Terjadi perebutan slot secara konkuren (*race condition*) di mana kapasitas kuota pada slot jam tersebut telah habis terisi oleh transaksi lain yang lebih dahulu di-commit.

##### C. Response Error 2 (422 Unprocessable Content)
```json
{
  "status": "error",
  "message": "Validasi data reservasi servis gagal.",
  "errors": {
    "vehicle_id": [
      "Bidang vehicle_id wajib diisi dan harus berupa referensi kendaraan yang sah."
    ],
    "slot_id": [
      "Slot servis yang dipilih tidak valid atau sudah kedaluwarsa."
    ]
  }
}
```
**Kondisi Pemicu Error:** Klien mengirimkan request body dengan parameter yang kosong atau bernilai tidak valid yang melanggar aturan `StoreBookingRequest`.

---

#### 3. Endpoint: POST /api/v1/users
**Fungsi:** Pendaftaran pengguna baru (registrasi akun pelanggan mandiri).

##### A. Response Sukses (201 Created)
```json
{
  "status": "success",
  "message": "Pendaftaran akun pelanggan berhasil.",
  "data": {
    "user": {
      "id": 5,
      "nama": "Eko Saputro",
      "email": "eko@bengkelmotor.test",
      "no_hp": "081234567892",
      "role": "CUSTOMER",
      "created_at": "2026-10-04T15:20:00.000000Z",
      "updated_at": "2026-10-04T15:20:00.000000Z"
    },
    "token": "5|8d9f10a7c4e2b19c88df..."
  }
}
```

##### B. Response Error (422 Unprocessable Content)
```json
{
  "status": "error",
  "message": "Validasi pendaftaran akun gagal.",
  "errors": {
    "email": [
      "Alamat email ini sudah terdaftar di sistem bengkel."
    ],
    "password": [
      "Kata sandi minimal harus terdiri dari 6 karakter."
    ]
  }
}
```
**Kondisi Pemicu Error:** Alamat email yang didaftarkan sudah ada di tabel `users` (*unique constraint violation*), atau panjang kata sandi kurang dari batas minimum 6 karakter.
