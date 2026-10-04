# Sistem Informasi Layanan Penjadwalan Servis & Manajemen Riwayat Perawatan Berkala Bengkel Motor

[![Laravel 12](https://img.shields.io/badge/Backend-Laravel%2012.x-red)](https://laravel.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue)](https://react.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/UI-Tailwind%20CSS%204-sky)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-emerald)](https://web.dev/progressive-web-apps/)
[![Tests](https://img.shields.io/badge/Tests-26%20Passed%20(112%20assertions)-brightgreen)](#pengujian-otomatis)

Aplikasi web terpadu operasional bengkel motor berbasis **RESTful API** dengan mekanisme **Auto-Confirm Booking**, proteksi *concurrency* / *race condition*, dan **Digital Service Logbook** berbasis nomor polisi kendaraan.

Proyek ini dibangun oleh **Kelompok 2** untuk mata kuliah **Pemrograman Web Service (Tahun Akademik 2026/2027)**, Universitas Harkat Negeri:
1. **Intan Komalasari**
2. **Feldi Sanjaya**
3. **Imzy Zulijar Setiawan**
4. **Eko Saputro** (NIM: 23215050)
5. **Zakky Fawwaz Mubarok**

---

## 🚀 Fitur Utama

- **Autentikasi Token Stateless (Laravel Sanctum)**: 3 Role terisolasi (`CUSTOMER`, `MECHANIC`, `ADMIN`).
- **Auto-Confirm Booking Instan**: Reservasi langsung berstatus `CONFIRMED` jika kuota slot tersedia tanpa menunggu approval manual admin.
- **Pessimistic Concurrency Lock**: Mencegah *overbooking* saat banyak pelanggan memesan slot jam yang sama secara bersamaan (`lockForUpdate()`).
- **Digital Service Logbook**: Rekam jejak servis, odometer, tindakan mekanik, dan daftar suku cadang/oli yang diganti dapat dilacak bebas nota fisik via nomor polisi motor.
- **Responsive & PWA Ready**: Tampilan teroptimasi untuk Desktop, Tablet Mekanik, dan Smartphone Pelanggan dengan Web App Manifest & Service Worker.
- **HTTP Practicum Compliance**: 100% memenuhi modul pengujian Postman Praktikum A (GET), Praktikum B (POST), dan Praktikum C (Error Testing 401, 403, 404, 405, 409, 422).

---

## 🛠️ Arsitektur & Teknologi

- **Backend**: Laravel 12.x REST API (`/api/v1`)
- **Database**: SQLite (Development/Testing) / MySQL 8.0+ (Production)
- **Frontend**: React 18/19 + TypeScript + Vite + Tailwind CSS
- **PWA**: `vite-plugin-pwa` (Workbox Service Worker + Web App Manifest)
- **API Client Testing**: Postman Collection v2.1 & Automated Feature Tests (PHPUnit)

---

## 📦 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat Sistem
- PHP >= 8.2 (Direkomendasikan PHP 8.3+)
- Composer >= 2.5
- Node.js >= 18.0 & NPM

### 2. Setup Backend (Laravel 12)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```
*Backend aktif di `http://127.0.0.1:8000` (API endpoint: `http://127.0.0.1:8000/api/v1`)*.

### 3. Setup Frontend (React + Vite)
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
*Frontend aktif di `http://localhost:5173`*.

---

## 🔑 Akun Demo Pengujian

| Role | Email | Password | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Pelanggan** | `eko@bengkelmotor.test` | `password123` | Kelola motor, booking servis, lihat riwayat. |
| **Pelanggan 2**| `siti@bengkelmotor.test` | `password123` | Pengujian kepemilikan motor & isolasi data. |
| **Mekanik** | `mechanic@bengkelmotor.test` | `password123` | Antrean pit servis, catat tindakan & sparepart. |
| **Admin** | `admin@bengkelmotor.test` | `password123` | Ringkasan metrik, kelola slot jam, manajemen user. |

---

## 🧪 Pengujian Otomatis (Backend Feature Tests)
Untuk menjalankan 26 feature tests otomatis:
```bash
cd backend
php artisan test
```
*Hasil: **26 passed (112 assertions)***.

---

## 📮 Postman Collection
File Postman Collection dan Environment siap import tersedia di direktori `postman/`:
- `postman/Bengkel_Motor_API.postman_collection.json` (17 Request lengkap skenario sukses & error)
- `postman/Bengkel_Motor_Local.postman_environment.json`

---

## 📚 Dokumentasi Lengkap
- [Panduan Pemula (Beginner Guide)](docs/BEGINNER_GUIDE.md)
- [Tutorial Pengujian Postman & Praktikum HTTP](docs/POSTMAN_TUTORIAL.md)
- [Spesifikasi Proyek (PROJECT_SPEC.md)](docs/PROJECT_SPEC.md)
- [Referensi Endpoint API](docs/API_REFERENCE.md)
- [Daftar Akun Demo](docs/DEMO_ACCOUNTS.md)
- [Laporan QA & Pengujian](docs/QA_REPORT.md)
- [Laporan Rilis (Release Notes)](docs/RELEASE_REPORT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
