# RESTful API Specification — Bengkel Motor Service
**Versi:** 1.2.0  
**Status:** Approved  
**PIC Dokumentasi & QA:** Intan Komalasari (@intannasr28)  

---

## 1. Ringkasan Ekosistem API
Sistem backend Bengkel Motor menyediakan RESTful API berbasis Laravel 12 dengan autentikasi Laravel Sanctum. Seluruh request dan response menggunakan format `application/json` dengan header standar:
```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <SANCTUM_TOKEN>
```

---

## 2. Katalog Endpoint

### A. Otentikasi (`/api/auth`)
1. **Registrasi Pelanggan Baru**
   - **Method:** `POST`
   - **Path:** `/api/register`
   - **Payload:**
     ```json
     {
       "name": "Budi Santoso",
       "email": "budi@example.com",
       "password": "Password123!",
       "password_confirmation": "Password123!",
       "phone": "081234567890"
     }
     ```
   - **Response Success (201 Created):**
     ```json
     {
       "message": "User registered successfully",
       "token": "1|sanctum_token_string...",
       "user": { "id": 1, "name": "Budi Santoso", "email": "budi@example.com", "role": "customer" }
     }
     ```

2. **Login Akun**
   - **Method:** `POST`
   - **Path:** `/api/login`
   - **Payload:** `{ "email": "...", "password": "..." }`
   - **Response Success (200 OK):** Mengembalikan auth token Sanctum dan objek profil pengguna.

3. **Profil & Logout**
   - **Method:** `GET /api/user` (ambil profil aktif)
   - **Method:** `POST /api/logout` (revokasi token aktif)

---

### B. Manajemen Kendaraan (`/api/vehicles`)
*Headers required: `Authorization: Bearer <TOKEN>`*

1. **Daftar Kendaraan Pengguna:** `GET /api/vehicles`
2. **Tambah Kendaraan Baru:** `POST /api/vehicles`
   - **Payload:**
     ```json
     {
       "plate_number": "B 1234 ABC",
       "brand": "Honda",
       "model": "Vario 160",
       "year": 2023,
       "transmission": "automatic"
     }
     ```
3. **Detail & Hapus Kendaraan:** `GET /api/vehicles/{id}`, `DELETE /api/vehicles/{id}`

---

### C. Booking Layanan Servis (`/api/bookings`)
1. **Query Ketersediaan Slot:**
   - **Method:** `GET /api/service-slots?date=YYYY-MM-DD`
   - **Response:** Array ketersediaan slot jam dan kapasitas bengkel.
2. **Buat Tiket Booking:**
   - **Method:** `POST /api/bookings`
   - **Payload:**
     ```json
     {
       "vehicle_id": 1,
       "service_slot_id": 3,
       "service_type": "servis_rutin",
       "complaint": "Tarikan gas berat dan ganti oli"
     }
     ```
   - **Response (201 Created):** Booking otomatis berstatus `confirmed` dan kapasitas slot dikurangi 1.
3. **Batalkan Booking:** `POST /api/bookings/{id}/cancel` (kapasitas slot dipulihkan).

---

### D. Riwayat & Rekam Medis Servis (`/api/service-records`)
1. **Pencarian Riwayat Servis Kendaraan:**
   - **Method:** `GET /api/service-records?plate_number=B1234ABC`
2. **Submit Rekam Servis (Role: Montir / Admin):**
   - **Method:** `POST /api/service-records`
   - **Payload:** `{ "booking_id": 1, "actions_taken": "...", "parts_replaced": "...", "total_cost": 150000 }`

---

## 3. Panduan Pengujian (QA & Testing Matrix)
* Dilengkapi Postman Collection Environment & cURL automation.
* Seluruh endpoint telah terverifikasi melalui automated feature testing:
  ```bash
  php artisan test --filter=AuthApiTest
  php artisan test --filter=BookingApiTest
  php artisan test --filter=VehicleApiTest
  ```
