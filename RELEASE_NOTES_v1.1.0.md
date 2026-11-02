# Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor — v1.1.0

Aplikasi sistem informasi penjadwalan servis motor terintegrasi berbasis **Laravel 12 (REST API v1)** dan **React 19 + TypeScript + Vite (PWA)** dengan antarmuka pengujian API interaktif mandiri.

---

## 🚀 Fitur Utama & Pembaruan (Changelog v1.1.0)

1. **Laboratorium Pengujian REST API Interaktif (`/api-test`):**
   * Antarmuka pengujian bawaan di browser tanpa ketergantungan tool eksternal.
   * Switch persona instan 1-klik untuk **Pelanggan (`eko@bengkelmotor.test`)**, **Mekanik (`mechanic@bengkelmotor.test`)**, dan **Administrator (`admin@bengkelmotor.test`)**.
   * Eksekusi langsung ke 23 endpoint dengan Response Inspector JSON, status code badge, dan latency timer (ms).
   * Tata letak split grid 2-kolom responsif untuk desktop dan mobile.

2. **Backend REST API v1 (Laravel 12.69.3):**
   * **26 Backend Tests Passed (112 Assertions)**.
   * **Auto-Confirm Booking & Concurrency Control:** Transaksi database aman dari *race condition* dan *overbooking*.
   * **Autentikasi Token Sanctum:** Pengamanan berbasis role (*Customer*, *Mechanic*, *Admin*).
   * **Manajemen Slot Servis Dinamis:** Generate slot batch per tanggal dan kuota harian.

3. **Frontend Modern PWA (React 19 + Tailwind CSS):**
   * Desain Glassmorphism & Bento Grid modern.
   * Navigasi bersih dengan tautan langsung ke `/api-test`.
   * Integrasi visual servis motor dan riwayat servis transparan per nomor polisi.

4. **100% Localhost Architecture:**
   * Backend REST API: `http://localhost:8000/api/v1`
   * Frontend Client: `http://localhost:5173`

---

## 📦 Berkas Unduhan Rilis (Attached Release Assets)

| Berkas | Deskripsi |
| :--- | :--- |
| `Tugas_Minggu_4_API_Design_Bengkel_Motor_Clean.pdf` | Laporan akademik 12 halaman bersih bebas ghosting dengan diagram ERD resolusi tinggi |
| `Tugas_Minggu_4_API_Design_Bengkel_Motor.docx` | Dokumen Microsoft Word deliverable akademik dapat diedit |
| `Bengkel_Motor_API.postman_collection.json` | Postman Collection lengkap 17 skenario pengujian otomatis |
| `Bengkel_Motor_Local.postman_environment.json` | Postman Environment konfigurasi localhost port 8000 |
| `erd_bengkel_motor_fixed.png` | Diagram Entity Relationship (ERD) 5 entitas resolusi 1600x920 |
| `openapi.yaml` | Spesifikasi standar OpenAPI 3.1 REST API v1 |

---

## 👥 Tim Pengembang (Kelompok 2 — Pemrograman Web Service)
* **Intan Komalasari** (NIM: 23215008)
* **Feldi Sanjaya** (NIM: 23215055)
* **Imzy Zulijar Setiawan** (NIM: 23215022)
* **Eko Saputro** (NIM: 23215050)
* **Zakky Fawwaz Mubarok** (NIM: 23215031)
* **Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  
* **Institusi:** Universitas Harkat Negeri
