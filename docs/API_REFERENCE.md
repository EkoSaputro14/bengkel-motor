# REFERENSI LENGKAP ENDPOINT RESTFUL API (API REFERENCE)
**Base URL**: `http://127.0.0.1:8000/api/v1` (Production: `https://api.bengkelmotor.test/api/v1`)

---

## 1. Konvensi Struktur JSON

### Format Sukses (200 OK, 201 Created)
```json
{
  "status": "success",
  "message": "Deskripsi operasi berhasil.",
  "data": { ... },
  "meta": { ... } // opsional
}
```

### Format Error (400, 401, 403, 404, 409, 422, 500)
```json
{
  "status": "error",
  "message": "Pesan ringkas kegagalan.",
  "errors": {
    "field_name": ["Detail pesan kesalahan validasi."]
  }
}
```

---

## 2. Modul Autentikasi (`/auth`)

### 1. `POST /auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "nama": "Eko Saputro",
    "email": "eko@example.com",
    "no_hp": "081234567890",
    "password": "password123",
    "role": "CUSTOMER"
  }
  ```
- **Response 201 Created**: Mengembalikan token Sanctum dan data profil.

### 2. `POST /auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "eko@bengkelmotor.test",
    "password": "password123"
  }
  ```
- **Response 200 OK**: Mengembalikan Bearer token otorisasi.

### 3. `GET /auth/me`
- **Auth**: Bearer Token (Semua Role)
- **Response 200 OK**: Profil user aktif beserta hitungan motor dan booking.

### 4. `POST /auth/logout`
- **Auth**: Bearer Token
- **Response 200 OK**: Mencabut dan menghapus personal access token aktif.

---

## 3. Modul Kendaraan (`/vehicles`)

### 1. `GET /vehicles`
- **Auth**: Bearer Token (CUSTOMER, ADMIN)
- **Query Params**: `search` (opsional)
- **Response 200 OK**: Array daftar motor milik pengguna.

### 2. `POST /vehicles`
- **Auth**: Bearer Token (CUSTOMER)
- **Request Body**:
  ```json
  {
    "no_polisi": "G 1234 ABC",
    "merk": "Honda",
    "model": "Vario 160",
    "tahun": 2023
  }
  ```
- **Response 201 Created**.

### 3. `GET /vehicles/{id}`
- **Auth**: Bearer Token (Pemilik / ADMIN)
- **Response 200 OK** atau `403 Forbidden` jika motor bukan milik pengguna.

### 4. `PUT /vehicles/{id}`
- **Auth**: Bearer Token (Pemilik)
- **Request Body**: Sama seperti POST.
- **Response 200 OK**.

### 5. `DELETE /vehicles/{id}`
- **Auth**: Bearer Token (Pemilik)
- **Response 200 OK** (atau `409 Conflict` jika memiliki jadwal booking aktif `CONFIRMED`).

---

## 4. Modul Slot Servis (`/service-slots`)

### 1. `GET /service-slots`
- **Auth**: Public
- **Query Params**: `tanggal=YYYY-MM-DD` (default: hari ini)
- **Response 200 OK**: Array slot per jam operasional, `kuota_maksimal`, `terisi`, `sisa_kuota`, dan `is_available`.
- **Response 422**: Jika format tanggal salah (contoh: `tanggal=besok-pagi`).

### 2. `POST /admin/service-slots`
- **Auth**: Bearer Token (ADMIN)
- **Request Body**:
  ```json
  {
    "tanggal": "2026-10-10",
    "jam_mulai": "08:00",
    "kuota_maksimal": 5
  }
  ```
- **Response 201 Created**.

### 3. `POST /admin/service-slots/batch`
- **Auth**: Bearer Token (ADMIN)
- **Request Body**:
  ```json
  {
    "start_date": "2026-10-10",
    "days": 7,
    "kuota_per_slot": 4
  }
  ```
- **Response 200 OK**: Men-generate jadwal massal jam 08:00 - 16:00.

---

## 5. Modul Booking & Reservasi (`/bookings`)

### 1. `POST /bookings` (Auto-Confirm)
- **Auth**: Bearer Token (CUSTOMER)
- **Request Body**:
  ```json
  {
    "vehicle_id": 1,
    "slot_id": 1,
    "keluhan": "Ganti oli mesin dan servis berkala"
  }
  ```
- **Response 201 Created**: Status `CONFIRMED` dan kode booking `BK-YYYYMMDD-XXXXX`.
- **Response 403 Forbidden**: Jika `vehicle_id` bukan milik akun yang login.
- **Response 409 Conflict**: Jika kuota slot telah penuh (`terisi >= kuota_maksimal`).

### 2. `GET /bookings/{id}`
- **Auth**: Bearer Token (Pemilik / Mekanik / Admin)
- **Response 200 OK**.

### 3. `PATCH /bookings/{id}/cancel`
- **Auth**: Bearer Token (Pemilik / Admin)
- **Response 200 OK**: Status berubah menjadi `CANCELLED` dan counter kuota terisi berkurang 1.
- **Response 409 Conflict**: Jika status booking sudah `COMPLETED`.

### 4. `GET /customer/bookings`
- **Auth**: Bearer Token (CUSTOMER)
- **Response 200 OK**: Daftar riwayat seluruh pemesanan servis pengguna.

### 5. `GET /mechanic/bookings`
- **Auth**: Bearer Token (MECHANIC, ADMIN)
- **Response 200 OK**: Antrean motor berstatus `CONFIRMED` yang siap diservis di pit mekanik.

---

## 6. Modul Rekam Servis & Riwayat Digital (`/service-records`)

### 1. `POST /service-records`
- **Auth**: Bearer Token (MECHANIC, ADMIN)
- **Request Body**:
  ```json
  {
    "booking_id": 1,
    "odometer_km": 10500,
    "tindakan": "Ganti oli mesin, bersihkan CVT, setel klep.",
    "suku_cadang": [
      {
        "nama": "Oli Mesin MPX2 0.8L",
        "qty": 1,
        "keterangan": "Penggantian rutin"
      }
    ],
    "catatan_mekanik": "Kondisi rem masih tebal."
  }
  ```
- **Response 201 Created**: Menyimpan logbook dan otomatis mengubah status booking menjadi `COMPLETED`.

### 2. `GET /service-history`
- **Auth**: Bearer Token
- **Query Params**: `no_polisi=G 1234 ABC`
- **Response 200 OK**: Riwayat kronologis lengkap perawatan motor.
