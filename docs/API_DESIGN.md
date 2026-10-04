# SPESIFIKASI KONTRAK RESTFUL API (API DESIGN & CONTRACT)

## 1. Konvensi Protokol & Format JSON

- **Base URL**: `https://api.bengkelmotor.test/api/v1` (Lokal: `http://127.0.0.1:8000/api/v1`)
- **Protokol**: HTTP/1.1 atau HTTP/2
- **Header Standar**:
  - `Accept: application/json`
  - `Content-Type: application/json` (Wajib untuk POST/PUT/PATCH)
  - `Authorization: Bearer <token_sanctum>` (Wajib untuk endpoint terlindungi)

### Struktur Format JSON Konsisten

#### Format Sukses (200 OK, 201 Created)
```json
{
  "status": "success",
  "message": "Deskripsi hasil operasi berhasil.",
  "data": { ... }
}
```

#### Format Error Klien / Validasi (400, 401, 403, 404, 409, 422)
```json
{
  "status": "error",
  "message": "Pesan kesalahan deskriptif yang mudah dipahami.",
  "errors": {
    "field_name": [
      "Detail alasan kegagalan validasi pada field terkait."
    ]
  }
}
```

---

## 2. Ringkasan Status Code HTTP

| Status Code | Makna RFC 9110 | Penggunaan Spesifik dalam Sistem Bengkel |
|---|---|---|
| **200 OK** | Permintaan sukses | Pengambilan data list (GET), detail single item, atau update sukses. |
| **201 Created** | Sumber daya baru berhasil dibuat | Pembuatan booking baru, pendaftaran motor, atau pencatatan servis. |
| **204 No Content** | Operasi sukses tanpa respon body | Penghapusan kendaraan atau pembatalan berhasil tanpa pengembalian payload. |
| **400 Bad Request** | Request cacat secara logika | Payload JSON malformed atau parameter query di luar rentang yang diizinkan. |
| **401 Unauthorized** | Autentikasi hilang / gagal | Token Bearer belum disertakan, kadaluarsa, atau token tidak valid. |
| **402 / 403 Forbidden** | Dilarang (Otorisasi gagal) | Pelanggan mencoba melihat/mengubah motor atau booking milik pengguna lain. |
| **404 Not Found** | Resource tidak ditemukan | Endpoint tidak terdaftar atau ID kendaraan/booking tidak ditemukan. |
| **405 Method Not Allowed** | Method HTTP tidak didukung | Mengirim `PUT` ke endpoint yang hanya mendukung `GET` (misal: `/service-slots`). |
| **409 Conflict** | Terjadi konflik sumber daya | **Kuota slot penuh** saat proses booking berjalan atau race condition overbooking. |
| **422 Unprocessable Content** | Kegagalan validasi semantic | Field wajib tidak diisi (misal: `slot_id` kosong, plat nomor salah format). |
| **500 Internal Server Error** | Kesalahan tak terduga server | Kegagalan koneksi database atau exception server yang tidak tertangani. |

---

## 3. Daftar Spesifikasi Endpoint Lengkap

### A. Modul Autentikasi (`/auth`)

#### 1. Registrasi Akun Pelanggan
- **Method & URI**: `POST /auth/register`
- **Role**: Publik
- **Auth**: None
- **Request Body**:
  ```json
  {
    "nama": "Budi Santoso",
    "no_hp": "081234567890",
    "email": "budi@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Registrasi akun berhasil.",
    "data": {
      "user": {
        "id": 1,
        "nama": "Budi Santoso",
        "email": "budi@example.com",
        "role": "CUSTOMER"
      },
      "token": "1|sanctum_plain_text_token_string..."
    }
  }
  ```
- **Error Cases**: `422 Unprocessable Content` (email sudah terdaftar atau password < 8 karakter).

#### 2. Login Pengguna
- **Method & URI**: `POST /auth/login`
- **Role**: Publik
- **Request Body**:
  ```json
  {
    "email": "budi@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**: Kembalikan objek profil pengguna dan Sanctum Bearer token.
- **Error Cases**: `401 Unauthorized` (kredensial salah).

#### 3. Profil Pengguna Aktif
- **Method & URI**: `GET /auth/me`
- **Role**: All authenticated
- **Auth**: Bearer Token
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "nama": "Budi Santoso",
      "no_hp": "081234567890",
      "email": "budi@example.com",
      "role": "CUSTOMER"
    }
  }
  ```

---

### B. Modul Kendaraan Pelanggan (`/vehicles`)

#### 1. List Kendaraan Pengguna
- **Method & URI**: `GET /vehicles`
- **Role**: Customer (hanya miliknya), Admin (seluruhnya)
- **Response (200 OK)**: Array kendaraan milik pengguna.

#### 2. Daftarkan Kendaraan Baru
- **Method & URI**: `POST /vehicles`
- **Role**: Customer, Admin
- **Request Body**:
  ```json
  {
    "no_polisi": "G 4567 XY",
    "merk": "Honda",
    "model": "Vario 160",
    "tahun": 2023
  }
  ```
- **Response (201 Created)**: Objek kendaraan yang berhasil disimpan.
- **Error Cases**: `422 Unprocessable Content` (format no_polisi salah / duplikat).

#### 3. Detail, Update & Hapus Kendaraan
- `GET /vehicles/{id}` -> 200 OK / 403 Forbidden / 404 Not Found
- `PUT /vehicles/{id}` -> 200 OK
- `DELETE /vehicles/{id}` -> 200 OK / 204 No Content (dicegah bila ada booking aktif).

---

### C. Modul Slot Servis (`/service-slots`)

#### 1. Cek Ketersediaan Kuota Slot (Objek Praktikum A - GET)
- **Method & URI**: `GET /service-slots?tanggal=2026-10-05`
- **Role**: Publik / Authenticated
- **Query Params**: `tanggal` (format: `YYYY-MM-DD`, wajib)
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Daftar slot servis berhasil diambil.",
    "data": [
      {
        "id": 1,
        "tanggal": "2026-10-05",
        "jam_mulai": "08:00:00",
        "kuota_maksimal": 5,
        "terisi": 3,
        "sisa_kuota": 2,
        "status_tersedia": true
      },
      {
        "id": 2,
        "tanggal": "2026-10-05",
        "jam_mulai": "09:00:00",
        "kuota_maksimal": 5,
        "terisi": 5,
        "sisa_kuota": 0,
        "status_tersedia": false
      }
    ]
  }
  ```
- **Error Cases**: `422 Unprocessable Content` jika format tanggal tidak valid.

#### 2. Pembuatan Slot Harian (Admin)
- **Method & URI**: `POST /admin/service-slots`
- **Role**: Admin

---

### D. Modul Reservasi Booking (`/bookings`)

#### 1. Reservasi Servis Auto-Confirm (Objek Praktikum B - POST)
- **Method & URI**: `POST /bookings`
- **Role**: Customer, Admin
- **Auth**: Bearer Token
- **Request Body**:
  ```json
  {
    "vehicle_id": 1,
    "slot_id": 1,
    "keluhan": "Ganti oli mesin dan tarikan mesin berat"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Reservasi servis berhasil dikonfirmasi otomatis.",
    "data": {
      "id": 101,
      "booking_code": "BK-A91F2C",
      "vehicle_id": 1,
      "slot_id": 1,
      "keluhan": "Ganti oli mesin dan tarikan mesin berat",
      "status": "CONFIRMED",
      "slot": {
        "tanggal": "2026-10-05",
        "jam_mulai": "08:00:00"
      },
      "created_at": "2026-10-04T20:30:00.000000Z"
    }
  }
  ```
- **Error Cases**:
  - `409 Conflict`: Kuota slot yang dipilih sudah habis saat commit transaksi.
  - `403 Forbidden`: `vehicle_id` bukan merupakan milik customer yang login.
  - `422 Unprocessable Content`: `slot_id` atau `vehicle_id` tidak disertakan.

#### 2. Batalkan Booking
- **Method & URI**: `POST /bookings/{id}/cancel`
- **Role**: Customer (pemilik), Admin
- **Response (200 OK)**: Kuota slot terisi otomatis dikurangi 1.

#### 3. Check-In Kedatangan Motor di Bengkel
- **Method & URI**: `POST /bookings/{id}/check-in`
- **Role**: Mechanic, Admin
- **Response (200 OK)**: Status booking berubah menjadi `IN_PROGRESS`.

---

### E. Modul Pengerjaan Servis Mekanik (`/service-records`)

#### 1. Input Tindakan dan Suku Cadang
- **Method & URI**: `POST /service-records`
- **Role**: Mechanic, Admin
- **Request Body**:
  ```json
  {
    "booking_id": 101,
    "odometer_km": 15420,
    "tindakan": "Servis CVT, pembersihan injektor, ganti oli mesin",
    "suku_cadang": [
      { "nama": "Oli MPX2 0.8L", "qty": 1, "harga_estimasi": 58000 },
      { "nama": "Roller Set", "qty": 1, "harga_estimasi": 65000 }
    ],
    "catatan_mekanik": "Kondisi vanbelt masih prima, disarankan ganti filter udara di servis berikutnya."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Catatan servis berhasil disimpan. Status servis selesai.",
    "data": {
      "id": 50,
      "booking_id": 101,
      "odometer_km": 15420,
      "tindakan": "Servis CVT, pembersihan injektor, ganti oli mesin",
      "status_booking_terkini": "COMPLETED"
    }
  }
  ```

---

### F. Modul Riwayat Servis & Pencarian (`/service-history`)

#### 1. Riwayat Servis Kendaraan Spesifik
- **Method & URI**: `GET /vehicles/{id}/service-history`
- **Role**: Customer (pemilik), Mechanic, Admin

#### 2. Pencarian Riwayat Berdasarkan Nomor Polisi
- **Method & URI**: `GET /service-history/search?no_polisi=G4567XY`
- **Role**: Mechanic, Admin
- **Response (200 OK)**: Menampilkan profil kendaraan beserta array riwayat tindakan, kilometer, tanggal pengerjaan, dan suku cadang masa lalu.

---

## 4. Pemenuhan Standar Praktikum Inspeksi HTTP (Postman Compliance)

Dokumen ini secara langsung menyediakan skenario pengujian untuk mengisi **Lembar Pengumpulan Tugas (Bagian 20)**:

### 1. Praktikum A – GET Request
- **Request URL**: `GET http://127.0.0.1:8000/api/v1/service-slots?tanggal=2026-10-05`
- **Inspeksi URL**:
  - *Scheme*: `http`
  - *Host*: `127.0.0.1:8000`
  - *Path*: `/api/v1/service-slots`
  - *Query String*: `tanggal=2026-10-05`
- **Inspeksi Header Response**:
  - `Content-Type: application/json`
  - `Date: Sun, 04 Oct 2026 ... GMT`
- **Status Code Didapat**: `200 OK`
- **Response Time**: ~25ms - 45ms (lokal).

### 2. Praktikum B – POST Request
- **Request URL**: `POST http://127.0.0.1:8000/api/v1/bookings`
- **Header Request**:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer 1|sanctum_token...`
- **Request Body (JSON Raw)**:
  ```json
  {
    "vehicle_id": 1,
    "slot_id": 1,
    "keluhan": "Ganti oli dan stel rantai roda"
  }
  ```
- **Komparasi GET vs POST**: Pada GET data parameter dilewatkan melalui query string di URL, sedangkan pada POST seluruh data reservasi dibungkus aman di dalam HTTP Body payload format JSON.
- **Status Code Didapat**: `201 Created`

### 3. Praktikum C – Error Testing
Sistem menyediakan 5 kasus error yang siap diuji:
1. **Endpoint Tidak Tersedia (404 Not Found)**:
   - Request: `GET /api/v1/jadwal-kosong`
   - Respon: `404 Not Found` (`{"message": "The route api/v1/jadwal-kosong could not be found."}`)
2. **Field Wajib Hilang (422 Unprocessable Content)**:
   - Request: `POST /api/v1/bookings` dengan body `{ "keluhan": "servis" }` (tanpa `vehicle_id` dan `slot_id`).
   - Respon: `422 Unprocessable Content` dengan struktur `errors` detail per field.
3. **Method Tidak Didukung (405 Method Not Allowed)**:
   - Request: `PUT /api/v1/service-slots`
   - Respon: `405 Method Not Allowed`, header response menyertakan `Allow: GET`.
4. **Tidak Terautentikasi (401 Unauthorized)**:
   - Request: `GET /api/v1/auth/me` tanpa header `Authorization`.
   - Respon: `401 Unauthorized`.
5. **Kuota Slot Penuh (409 Conflict)**:
   - Request: `POST /api/v1/bookings` ke slot dengan `terisi == kuota_maksimal`.
   - Respon: `409 Conflict` (`{"status": "error", "message": "Kuota slot servis untuk jam ini telah penuh."}`).
