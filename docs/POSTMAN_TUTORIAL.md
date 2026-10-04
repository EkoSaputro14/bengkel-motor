# TUTORIAL PENGUJIAN API MENGGUNAKAN POSTMAN (POSTMAN TUTORIAL)
**Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor (REST API v1)**

Tutorial ini dirancang khusus untuk memenuhi tugas perkuliahan **Inspeksi HTTP Menggunakan API Client (Postman)** mencakup **Praktikum A (GET Request)**, **Praktikum B (POST Request)**, dan **Praktikum C (Error Testing)**.

---

## 1. Persiapan Awal

### A. Pastikan Backend Server Aktif
Sebelum membuka Postman, pastikan server Laravel 12 sedang berjalan:
```bash
cd C:\Users\SMANSA\workspace\bengkel-motor\backend
php artisan serve
```
*Server aktif di: `http://127.0.0.1:8000`*

### B. Import Postman Collection & Environment
1. Buka aplikasi **Postman**.
2. Klik tombol **Import** (di sudut kiri atas).
3. Pilih dua file yang berada di folder `postman/`:
   - `postman/Bengkel_Motor_API.postman_collection.json` (Daftar 17 request pengujian)
   - `postman/Bengkel_Motor_Local.postman_environment.json` (Variabel environment lokal)
4. Di pojok kanan atas Postman, pada dropdown environment, pilih **"Bengkel Motor Local Environment"**.

---

## 2. Alur Pengujian Otomatis Menggunakan Environment Variables

Collection ini dilengkapi script otomatis (Tests Script) yang menyimpan token otentikasi Sanctum dan ID yang dihasilkan:
1. Jalankan **`03 Login Customer`** → Token otomatis tersimpan di variabel `{{customer_token}}`.
2. Jalankan **`04 Login Mechanic`** → Token otomatis tersimpan di variabel `{{mechanic_token}}`.
3. Jalankan **`05 Login Admin`** → Token otomatis tersimpan di variabel `{{admin_token}}`.

Seluruh request berikutnya (seperti tambah motor, booking, rekam servis) akan otomatis membawa Bearer token yang sesuai tanpa perlu copy-paste manual.

---

## 3. Rincian Pengujian Modul Praktikum (Sesuai Lembar Tugas)

### 📌 Praktikum A — GET Request (Inspeksi HTTP Komprehensif)

**Request yang Diuji:** `09 Get Available Slots (Praktikum A)`

1. **Konfigurasi Request:**
   - **Method**: `GET`
   - **Request URL**: `{{base_url}}/service-slots?tanggal=2026-10-06` (URL Utuh: `http://127.0.0.1:8000/api/v1/service-slots?tanggal=2026-10-06`)
   - **Headers**:
     - `Accept: application/json`
   - **Body**: *(Kosong — Method GET tidak membawa body)*

2. **Kirim Request:** Klik tombol biru **"Send"**.

3. **Komponen yang Diamati & Dianalisis:**
   - **Status Code**: `200 OK` (Menandakan pembacaan resource berhasil).
   - **Response Time**: ~15 - 50 ms (Dapat dilihat di tab kanan atas response Postman).
   - **Response Headers**:
     - `Content-Type: application/json`
     - `Date`: Waktu request diproses.
   - **Dekomposisi Struktur URL**:
     - **Scheme**: `http`
     - **Host**: `127.0.0.1:8000` (atau `localhost:8000`)
     - **Path**: `/api/v1/service-slots`
     - **Query String**: `tanggal=2026-10-06` (digunakan sebagai parameter penyaring tanggal)
   - **Response Body (JSON)**:
     ```json
     {
       "status": "success",
       "message": "Data slot servis berhasil diambil.",
       "data": [
         {
           "id": 1,
           "tanggal": "2026-10-06",
           "jam_mulai": "08:00",
           "kuota_maksimal": 4,
           "terisi": 0,
           "sisa_kuota": 4,
           "is_available": true
         },
         {
           "id": 2,
           "tanggal": "2026-10-06",
           "jam_mulai": "09:00",
           "kuota_maksimal": 4,
           "terisi": 0,
           "sisa_kuota": 4,
           "is_available": true
         }
       ],
       "meta": {
         "tanggal": "2026-10-06",
         "total_slots": 8,
         "available_slots": 8
       }
     }
     ```

---

### 📌 Praktikum B — POST Request (Payload Body vs URL)

**Request yang Diuji:** `10 Create Booking Auto-Confirm (Praktikum B)`

1. **Konfigurasi Request:**
   - **Method**: `POST`
   - **Request URL**: `{{base_url}}/bookings` (`http://127.0.0.1:8000/api/v1/bookings`)
   - **Headers**:
     - `Accept: application/json`
     - `Content-Type: application/json` *(Wajib agar server mengenali data JSON)*
     - `Authorization: Bearer {{customer_token}}`
   - **Body (raw JSON)**:
     ```json
     {
       "vehicle_id": 1,
       "slot_id": 1,
       "keluhan": "Ganti oli mesin MPX2 dan setel rantai roda"
     }
     ```

2. **Kirim Request:** Klik **"Send"**.

3. **Komponen yang Diamati & Dianalisis:**
   - **Status Code**: `201 Created` (Menandakan pembuatan resource booking baru berhasil).
   - **Perbedaan Data URL vs Body**:
     - Pada GET (Praktikum A), data filter `tanggal=2026-10-06` diletakkan di URL (terlihat di address bar / log URL).
     - Pada POST (Praktikum B), data sensitif dan berukuran besar (`vehicle_id`, `slot_id`, `keluhan`) diletakkan di dalam **Payload Body**, tidak terlihat di URL, dan dikirim terenkripsi saat menggunakan HTTPS.
   - **Response Body (JSON)**:
     ```json
     {
       "status": "success",
       "message": "Reservasi servis berhasil dibuat dan terkonfirmasi otomatis (Auto-Confirmed).",
       "data": {
         "id": 1,
         "booking_code": "BK-20261006-XXXXX",
         "user_id": 3,
         "vehicle_id": 1,
         "slot_id": 1,
         "keluhan": "Ganti oli mesin MPX2 dan setel rantai roda",
         "status": "CONFIRMED",
         "created_at": "2026-10-04T15:00:00.000000Z"
       }
     }
     ```

---

### 📌 Praktikum C — Error Testing (Skenario Kegagalan HTTP)

Skenario pengujian galat untuk melatih analisis error handling pada REST API:

#### 1. Uji Error 422 Unprocessable Content (Parameter Tidak Valid)
- **Request**: `15 Error Testing - Invalid Date Query`
- **Method & URL**: `GET {{base_url}}/service-slots?tanggal=besok-pagi`
- **Hasil Response**:
  - **Status**: `422 Unprocessable Content`
  - **JSON**:
    ```json
    {
      "status": "error",
      "message": "Format parameter tanggal tidak valid.",
      "errors": {
        "tanggal": ["Parameter tanggal harus berformat YYYY-MM-DD (contoh: 2026-10-06)."]
      }
    }
    ```
  - **Analisis**: Server menolak query non-standar dan memberikan pesan edukatif mengenai format tanggal yang benar (`YYYY-MM-DD`).

#### 2. Uji Error 404 Not Found (Endpoint Tidak Tersedia)
- **Request**: `16 Error Testing - Nonexistent Endpoint`
- **Method & URL**: `GET {{base_url}}/slot-kosong-tidak-ada`
- **Hasil Response**:
  - **Status**: `404 Not Found`
  - **JSON**:
    ```json
    {
      "status": "error",
      "message": "Resource atau endpoint tidak ditemukan (404 Not Found)."
    }
    ```
  - **Analisis**: Router Laravel mendeteksi endpoint yang tidak terdaftar dan mengembalikan respon 404 berformat JSON terstandarisasi.

#### 3. Uji Error 405 Method Not Allowed (Method Tidak Didukung)
- **Request**: `17 Error Testing - Unsupported Method`
- **Method & URL**: `PUT {{base_url}}/service-slots`
- **Hasil Response**:
  - **Status**: `405 Method Not Allowed`
  - **JSON**:
    ```json
    {
      "status": "error",
      "message": "HTTP Method tidak didukung pada endpoint ini (405 Method Not Allowed)."
    }
    ```
  - **Analisis**: Server menolak method `PUT` pada route publik `/service-slots` yang hanya menerima method `GET`.

#### 4. Uji Error 401 Unauthorized (Tanpa Token)
- Buka request `06 Get Current User Profile`, hilangkan centang header `Authorization`, lalu kirim.
- **Hasil**: `401 Unauthorized` dengan pesan `"Unauthenticated. Token otentikasi tidak valid atau tidak disertakan."`.

#### 5. Uji Error 403 Forbidden (Hak Akses Dibatasi)
- Login sebagai Pelanggan, lalu coba akses endpoint admin `POST {{base_url}}/admin/service-slots`.
- **Hasil**: `403 Forbidden` dengan pesan `"Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini."`.

---

## 4. Rangkuman Daftar Seluruh 17 Request dalam Collection

| No | Nama Request | Method | Endpoint URL | Status Diharapkan |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Health Check | `GET` | `/health` | `200 OK` |
| **02** | Register Customer | `POST` | `/auth/register` | `201 Created` |
| **03** | Login Customer | `POST` | `/auth/login` | `200 OK` |
| **04** | Login Mechanic | `POST` | `/auth/login` | `200 OK` |
| **05** | Login Admin | `POST` | `/auth/login` | `200 OK` |
| **06** | Get Current User Profile | `GET` | `/auth/me` | `200 OK` |
| **07** | Create Vehicle | `POST` | `/vehicles` | `201 Created` |
| **08** | List Vehicles | `GET` | `/vehicles` | `200 OK` |
| **09** | **Get Available Slots (Praktikum A)** | `GET` | `/service-slots?tanggal=...` | `200 OK` |
| **10** | **Create Booking (Praktikum B)** | `POST` | `/bookings` | `201 Created` |
| **11** | Get Booking Details | `GET` | `/bookings/{id}` | `200 OK` |
| **12** | Mechanic Active Queue | `GET` | `/mechanic/bookings` | `200 OK` |
| **13** | Mechanic Submit Service Record | `POST` | `/service-records` | `201 Created` |
| **14** | Get Service History by No Polisi | `GET` | `/service-history?no_polisi=...` | `200 OK` |
| **15** | **Error Testing: Invalid Date (Praktikum C)** | `GET` | `/service-slots?tanggal=besok-pagi` | `422 Unprocessable` |
| **16** | **Error Testing: 404 Route (Praktikum C)** | `GET` | `/slot-kosong-tidak-ada` | `404 Not Found` |
| **17** | **Error Testing: 405 Method (Praktikum C)** | `PUT` | `/service-slots` | `405 Method Not Allowed`|
