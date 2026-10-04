# PANDUAN LENGKAP PENGUJIAN MANUAL REST API DENGAN POSTMAN DI WINDOWS
## Lembar Kerja Praktikum Minggu 2 — Sistem Informasi Bengkel Motor (Kelompok 2)

**Penulis:** Tim Pengembang Kelompok 2 (Eko Saputro / NIM: 23215050)  
**Mata Kuliah:** Pemrograman Web Service  
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  
**Target Platform:** Windows 10/11, Postman Desktop, VS Code Thunder Client, Windows Terminal / PowerShell  
**Base URL API:**
- **Lokal:** `http://127.0.0.1:8000/api/v1` (atau `http://localhost:8000/api/v1`)
- **Publik Live:** `https://bengkel.ekohomelab.online/api/v1`

---

## DAFTAR ISI
1. [BAB I: Persiapan Lingkungan & Instalasi Postman](#bab-i-persiapan-lingkungan--instalasi-postman)
2. [BAB II: Konfigurasi Postman untuk Pemula](#bab-ii-konfigurasi-postman-untuk-pemula)
3. [BAB III: Panduan Eksekusi 15 Request Praktikum](#bab-iii-panduan-eksekusi-15-request-praktikum)
   - [3.1 Intan Komalasari — Autentikasi & Validasi](#31-intan-komalasari--autentikasi--validasi)
   - [3.2 Feldi Sanjaya — Manajemen Kendaraan & Ownership Policy](#32-feldi-sanjaya--manajemen-kendaraan--ownership-policy)
   - [3.3 Imzy Zulijar Setiawan — Ketersediaan Slot & Filter Tanggal](#33-imzy-zulijar-setiawan--ketersediaan-slot--filter-tanggal)
   - [3.4 Eko Saputro — Auto-Confirm Booking & Anti Overbooking](#34-eko-saputro--auto-confirm-booking--anti-overbooking)
   - [3.5 Zakky Fawwaz Mubarok — Logbook Mekanik & Riwayat Digital](#35-zakky-fawwaz-mubarok--logbook-mekanik--riwayat-digital)
4. [BAB IV: Alternatif Pengujian Cepat di Windows (cURL & Thunder Client)](#bab-iv-alternatif-pengujian-cepat-di-windows)
5. [BAB V: Troubleshooting Kode HTTP & Solusi Kendala](#bab-v-troubleshooting-kode-http--solusi-kendala)

---

## BAB I: PERSIAPAN LINGKUNGAN & INSTALASI POSTMAN

### 1.1 Mengunduh & Memasang Postman di Windows
1. Buka browser dan kunjungi: **https://www.postman.com/downloads/**
2. Klik tombol **"Download for Windows (64-bit)"**.
3. Jalankan berkas installer `Postman-win64-Setup.exe`.
4. Anda dapat memilih *"Continue without an account"* untuk langsung masuk ke layar kerja utama.

### 1.2 Memastikan Server Backend Aktif
Pilih salah satu cara berikut:
- **Opsi A (Server Lokal di Laptop):**
  Buka PowerShell / Command Prompt:
  ```powershell
  cd backend
  php artisan serve
  ```
  *Server aktif di: `http://127.0.0.1:8000`*

- **Opsi B (Menggunakan URL Cloudflare Live):**
  Gunakan URL publik `https://bengkel.ekohomelab.online/api/v1` tanpa perlu menjalankan PHP lokal.

---

## BAB II: KONFIGURASI POSTMAN UNTUK PEMULA

### 2.1 Konsep Header Penting
Setiap request yang dikirimkan membutuhkan header berikut:
1. `Content-Type: application/json` (Wajib untuk request yang mengirim JSON pada body seperti POST, PUT, PATCH).
2. `Accept: application/json` (Wajib agar Laravel selalu mengembalikan respons JSON terstruktur, bukan halaman HTML).
3. `Authorization: Bearer <TOKEN>` (Wajib untuk semua endpoint yang diproteksi login/Sanctum).

### 2.2 Cara Mengisi Token Sanctum di Postman
1. Jalankan request **Login** (POST `/auth/login`).
2. Pada tab Response di bawah, salin nilai token dari `data.token` (tanpa tanda kutip).
3. Pindah ke request lain yang butuh autentikasi (misal: POST `/vehicles` atau POST `/bookings`).
4. Klik tab **"Authorization"** di bawah URL bar.
5. Pilih Type: **"Bearer Token"**.
6. Tempelkan (Paste) token yang tadi disalin ke dalam kolom **Token**.

---

## BAB III: PANDUAN EKSEKUSI 15 REQUEST PRAKTIKUM

### 3.1 INTAN KOMALASARI — Autentikasi Pengguna & Validasi Akun

#### Request 1: Registrasi Akun Pelanggan Baru (201 Created)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/auth/register`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`
- **Body (raw JSON):**
```json
{
  "nama": "Intan Komalasari",
  "email": "intan.pelanggan@bengkelmotor.test",
  "no_hp": "081234567891",
  "password": "password123",
  "role": "CUSTOMER"
}
```
- **Cara Uji:** Klik tombol **Send**.
- **Hasil:** Status `201 Created`, waktu ~20-30 ms. Mengembalikan token Sanctum dan data user.

#### Request 2: Login Pelanggan & Penerbitan Token (200 OK)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/auth/login`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`
- **Body (raw JSON):**
```json
{
  "email": "intan.pelanggan@bengkelmotor.test",
  "password": "password123"
}
```
- **Cara Uji:** Klik **Send**, periksa status `200 OK`. Salin `token` untuk request berikutnya.

#### Request 3: Error Testing — Password Kurang dari 6 Karakter (422 Unprocessable)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/auth/register`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`
- **Body (raw JSON):**
```json
{
  "nama": "Intan Error",
  "email": "err@gmail.com",
  "no_hp": "081299998888",
  "password": "123",
  "role": "CUSTOMER"
}
```
- **Cara Uji:** Klik **Send**.
- **Hasil:** Status `422 Unprocessable Content`, server mengembalikan pesan error validasi kolom password.

---

### 3.2 FELDI SANJAYA — Manajemen Kendaraan & Ownership Policy

#### Request 4: Daftarkan Kendaraan Sepeda Motor Baru (201 Created)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/vehicles`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <TOKEN_PELANGGAN>`
- **Body (raw JSON):**
```json
{
  "no_polisi": "G 2222 KL",
  "merk": "Yamaha",
  "model": "Aerox 155 Connected",
  "tahun": 2023
}
```
- **Hasil:** Status `201 Created`. Kendaraan berhasil terikat dengan akun Anda.

#### Request 5: Ambil Daftar Motor Milik Sendiri (200 OK)
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/vehicles`
- **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN_PELANGGAN>`
- **Body:** `None`
- **Hasil:** Status `200 OK`. Menampilkan array kendaraan bermotor yang terdaftar atas nama Anda.

#### Request 6: Error Testing — Akses Motor Milik Pengguna Lain (403 Forbidden)
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/vehicles/999`
- **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN_PELANGGAN>`
- **Body:** `None`
- **Hasil:** Status `403 Forbidden` atau `404 Not Found`. Backend menolak akses secara aman.

---

### 3.3 IMZY ZULIJAR SETIAWAN — Ketersediaan Slot & Filter Tanggal

#### Request 7: Cek Ketersediaan Slot per Tanggal (200 OK)
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/service-slots?tanggal=2026-10-06`
- **Headers:** `Accept: application/json`
- **Body:** `None`
- **Hasil:** Status `200 OK`. Menampilkan daftar jam operasional, kuota maksimal, kuota terisi, dan sisa kapasitas.

#### Request 8: Cek Kuota Hari Ini secara Safe & Idempotent (200 OK)
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/service-slots`
- **Headers:** `Accept: application/json`
- **Body:** `None`
- **Hasil:** Status `200 OK`. Menampilkan data slot servis tanggal berjalan.

#### Request 9: Error Testing — Parameter Tanggal Tidak Valid (422 Unprocessable)
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/service-slots?tanggal=besok-pagi`
- **Headers:** `Accept: application/json`
- **Body:** `None`
- **Hasil:** Status `422 Unprocessable Content`. Server memberi petunjuk format harus `YYYY-MM-DD`.

---

### 3.4 EKO SAPUTRO — Auto-Confirm Booking & Anti Overbooking

#### Request 10: Reservasi Booking Servis Instan / Auto-Confirm (201 Created)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/bookings`
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <TOKEN_PELANGGAN>`
- **Body (raw JSON):**
```json
{
  "vehicle_id": 1,
  "slot_id": 1,
  "keluhan": "Ganti oli mesin MPX2 dan servis berkala 10.000 KM"
}
```
- **Hasil:** Status `201 Created`. Mengembalikan nomor booking unik (`booking_code`), status langsung `CONFIRMED`.

#### Request 11: Error Testing — Uji Concurrency Lock Saat Slot Penuh (409 Conflict)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/bookings`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN_PELANGGAN>`
- **Body (raw JSON):**
```json
{
  "vehicle_id": 1,
  "slot_id": 1,
  "keluhan": "Mencoba memesan slot jam yang sudah penuh kuotanya"
}
```
- **Hasil:** Status `409 Conflict`. Pessimistic locking menolak transaksi saat kapasitas habis.

#### Request 12: Pembatalan Booking & Pemulihan Kuota Otomatis (200 OK)
- **Method:** `PATCH`
- **URL:** `http://127.0.0.1:8000/api/v1/bookings/1/cancel`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN_PELANGGAN>`
- **Body (raw JSON):**
```json
{
  "reason": "Perubahan rencana jadwal servis"
}
```
- **Hasil:** Status `200 OK`. Status booking berubah jadi `CANCELLED` dan kuota slot otomatis pulih.

---

### 3.5 ZAKKY FAWWAZ MUBAROK — Logbook Mekanik & Riwayat Digital

#### Request 13: Lihat Antrean Motor di Pit Servis (200 OK)
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/mechanic/bookings`
- **Headers:** `Accept: application/json`, `Authorization: Bearer <TOKEN_MEKANIK>`
- **Body:** `None`
- **Hasil:** Status `200 OK`. Menampilkan daftar motor yang siap dikerjakan oleh mekanik.

#### Request 14: Catat Tindakan Servis & Suku Cadang (201 Created)
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/v1/service-records`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <TOKEN_MEKANIK>`
- **Body (raw JSON):**
```json
{
  "booking_id": 1,
  "odometer_km": 10500,
  "tindakan": "Ganti oli mesin, busi racing, dan pembersihan filter udara",
  "suku_cadang": [
    { "nama": "Oli MPX2 0.8L", "qty": 1, "keterangan": "Rutin" },
    { "nama": "Busi CPR9EA", "qty": 1, "keterangan": "Penggantian" }
  ],
  "catatan_mekanik": "Kondisi vanbelt dan roller CVT masih sangat baik"
}
```
- **Hasil:** Status `201 Created`. Logbook tersimpan dan status booking otomatis menjadi `COMPLETED`.

#### Request 15: Pencarian Riwayat Servis Digital via Plat Nomor (200 OK)
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/v1/service-history?no_polisi=G 1234 ABC`
- **Headers:** `Accept: application/json`
- **Body:** `None`
- **Hasil:** Status `200 OK`. Menampilkan seluruh riwayat odometer, tindakan, dan sparepart kendaraan.

---

## BAB IV: ALTERNATIF PENGUJIAN CEPAT DI WINDOWS

### 4.1 Menggunakan cURL di Windows PowerShell
Anda dapat menjalankan pengujian tanpa membuka Postman dengan cURL:
```powershell
# Contoh Uji Health Check:
curl.exe -s http://127.0.0.1:8000/api/v1/health

# Contoh Login dan Ambil Token:
curl.exe -X POST http://127.0.0.1:8000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"eko@bengkelmotor.test","password":"password123"}'
```

### 4.2 Menggunakan Ekstensi VS Code: Thunder Client
1. Buka Visual Studio Code di Windows.
2. Buka menu **Extensions** (`Ctrl + Shift + X`), ketik **Thunder Client**, lalu klik **Install**.
3. Klik ikon petir di sisi kiri, pilih **New Request**.
4. Masukkan URL dan JSON body persis seperti panduan Postman di atas.

---

## BAB V: TROUBLESHOOTING KODE HTTP & SOLUSI KENDALA

| Kode Status | Makna | Penyebab Umum | Solusi Cepat |
|---|---|---|---|
| **200 OK** | Berhasil | Request GET, PUT, PATCH berhasil diproses | Observasi data JSON pada response body. |
| **201 Created** | Berhasil Dibuat | Data baru berhasil disimpan (POST) | Periksa ID data baru yang dihasilkan. |
| **401 Unauthorized** | Belum Login | Token Bearer belum diisi atau kadaluarsa | Lakukan login ulang dan pasang token di tab Authorization. |
| **403 Forbidden** | Hak Akses Ditolak | Role tidak sesuai (misal: Pelanggan akses menu Mekanik) | Gunakan akun dengan role yang tepat (ADMIN/MECHANIC). |
| **404 Not Found** | URL / Data Hilang | Typo pada URL endpoint atau ID data tidak ada | Periksa kesesuaian URL (`/api/v1/...`). |
| **409 Conflict** | Kuota Habis | Kuota slot servis penuh saat konkurensi | Pilih jam slot servis yang masih memiliki sisa kuota. |
| **422 Unprocessable** | Validasi Gagal | Format input salah atau field wajib kosong | Periksa pesan error pada field yang ditolak server. |
| **500 Server Error** | Masalah Internal | Database mati atau syntax error | Periksa log backend di `backend/storage/logs/laravel.log`. |
