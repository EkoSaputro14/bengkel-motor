# Sistem Informasi Layanan Penjadwalan Servis & Manajemen Riwayat Perawatan Berkala Bengkel Motor

[![CI / Automated Tests & Quality Gate](https://github.com/EkoSaputro14/bengkel-motor/actions/workflows/ci.yml/badge.svg)](https://github.com/EkoSaputro14/bengkel-motor/actions/workflows/ci.yml)
[![Tests: 24 Passed](https://img.shields.io/badge/Tests-24%20Passed%20(68%20assertions)-brightgreen)](#-pengujian-otomatis--verifikasi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Backend: Laravel 12](https://img.shields.io/badge/Backend-Laravel%2012.x-red)](https://laravel.com)
[![Frontend: React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue)](https://react.dev)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-emerald)](https://web.dev/progressive-web-apps/)

Aplikasi **Sistem Informasi Layanan Penjadwalan Servis & Manajemen Riwayat Perawatan Berkala Bengkel Motor** merupakan platform web terpadu yang dirancang untuk mengoptimalkan operasional bengkel secara *real-time*. Berbasis **RESTful API**, sistem ini dilengkapi dengan fitur **Auto-Confirm Booking** untuk reservasi instan, proteksi *concurrency* / *race condition* menggunakan *Pessimistic Locking* guna mencegah *overbooking* slot servis, **Digital Service Logbook** berbasis nomor polisi kendaraan, serta antarmuka laboratorium pengujian interaktif di `/api-test`.

Proyek ini dibangun secara kolaboratif oleh **Kelompok 2** untuk mata kuliah **Pemrograman Web Service (Tahun Akademik 2026/2027)**, Universitas Harkat Negeri:

---

## 👥 Tim Pengembang Resmi (Kelompok 2)

| No | Nama Lengkap | NIM | GitHub | Peran & Kontribusi Utama |
|---|---|---|---|---|
| 1 | **Eko Saputro** | 23215050 | [@EkoSaputro14](https://github.com/EkoSaputro14) | Lead Maintainer, DevOps & CI/CD Orchestration, Release Manager |
| 2 | **Imzy Zulijar Setiawan** | 23215022 | [@23215022-Imzy](https://github.com/23215022-Imzy) | Frontend Lead, UI/UX Designer, Testing Lab A11y & PWA |
| 3 | **Feldi Sanjaya** | 23215055 | [@FeldiSanJy](https://github.com/FeldiSanJy) | Database Architect, Relational Schema & Integrity Checker |
| 4 | **Intan Komalasari** | 23215008 | [@intannasr28](https://github.com/intannasr28) | QA Lead, Documentation Specialist, OpenAPI & Governance |
| 5 | **Zakky Fawwaz Mubarok** | 23215031 | [@zakyfawwaz](https://github.com/zakyfawwaz) | Code Quality Reviewer, OWASP Security Auditor & Testing |

---

## 🚀 Fitur Utama

- **Autentikasi Token Stateless (Laravel Sanctum)**: 3 Role terisolasi (`CUSTOMER`, `MECHANIC`, `ADMIN`).
- **Auto-Confirm Booking Instan**: Reservasi langsung berstatus `CONFIRMED` jika kuota slot tersedia tanpa menunggu approval manual admin.
- **Pessimistic Concurrency Lock**: Mencegah *overbooking* saat banyak pelanggan memesan slot jam yang sama secara bersamaan (`lockForUpdate()`).
- **Digital Service Logbook**: Rekam jejak servis, odometer, tindakan mekanik, dan daftar suku cadang/oli yang diganti dapat dilacak bebas nota fisik via nomor polisi motor.
- **Interactive Testing Lab (`/api-test`)**: Laboratorium pengujian langsung di browser dengan catalog 23 endpoint dan live feedback respons.
- **Relational Integrity Auditor (`db:verify-integrity`)**: Perintah diagnosa mandiri CLI untuk memvalidasi konsistensi foreign key dan batas kuota.
- **Responsive & PWA Ready**: Tampilan teroptimasi untuk Desktop, Tablet Mekanik, dan Smartphone Pelanggan dengan Web App Manifest & Service Worker.
- **Academic Testing Compliance**: 100% memenuhi modul pengujian Postman (24 skenario lulus) dan automated test suite Laravel (24 passed, 68 assertions).

---

## 🛠️ Arsitektur & Teknologi

- **Backend**: Laravel 12.x REST API (`/api/v1`)
- **Database**: SQLite (Development/Testing) / MySQL 8.0+ (Production)
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **PWA**: `vite-plugin-pwa` (Workbox Service Worker + Web App Manifest)
- **CI/CD**: GitHub Actions Multi-Platform Runner (Linux PHP 8.3 & Windows Node 20)
- **Dokumentasi & Standar**: OpenAPI 3.0, Postman Collection v2.1, MIT License, [CONTRIBUTING.md](CONTRIBUTING.md)

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
touch database/database.sqlite
php artisan migrate --seed
php artisan serve --port=8000
```
*Backend aktif di `http://127.0.0.1:8000` (API endpoint: `http://127.0.0.1:8000/api/v1`)*.

### 3. Setup Frontend (React 19)
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

## 🧪 Pengujian Otomatis & Verifikasi

### Menjalankan Test Suite Backend
```bash
cd backend
php artisan test
```
*Hasil:* **Tests: 24 passed (68 assertions)**.

### Menjalankan Audit Integritas Basis Data
```bash
cd backend
php artisan db:verify-integrity
```

### Menjalankan Audit Keamanan OWASP API
```bash
python scripts/audit_api_security.py
```

---

## 📄 Lisensi & Hak Cipta
Didistribusikan di bawah lisensi open source **MIT License**. Lihat [LICENSE](LICENSE) untuk informasi lebih lanjut.  
Copyright (c) 2026 Kelompok 2 - Pemrograman Web Service, Universitas Harkat Negeri.
