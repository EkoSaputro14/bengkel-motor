# LAPORAN TEKNIS IMPLEMENTASI PROYEK (IMPLEMENTATION REPORT)

---

## 1. Identitas Proyek & Kelompok

- **Nama Proyek**: Rancang Bangun RESTful API Layanan Penjadwalan Servis dan Manajemen Riwayat Perawatan Berkala Bengkel Motor
- **Kelompok**: Kelompok 2
- **Mata Kuliah**: Pemrograman Web Service (Tahun Akademik 2026/2027)
- **Institusi**: Universitas Harkat Negeri
- **Anggota Tim**:
  1. Intan Komalasari
  2. Feldi Sanjaya
  3. Imzy Zulijar Setiawan
  4. Eko Saputro (NIM: 23215050)
  5. Zakky Fawwaz Mubarok

---

## 2. Arsitektur Teknis yang Diimplementasikan

Aplikasi dibangun menggunakan model **Decoupled 3-Tier Architecture**:
1. **Tier Data (Database)**: 5 tabel relasional terstruktur dengan foreign key cascades/restrictions, indeks unik nomor polisi dan kombinasi slot waktu, serta kolom JSON untuk suku cadang.
2. **Tier Aplikasi (Laravel 12 Backend API)**: Melayani 26 endpoint RESTful `/api/v1` dengan autentikasi token stateless Laravel Sanctum, FormRequest validation, transaksi database atomik dengan *Pessimistic Row-Level Locking* (`SELECT ... FOR UPDATE`), dan penanganan exception terstandarisasi.
3. **Tier Presentasi (React 19 + TypeScript Frontend)**: Single Page Application responsif berbasis Vite dan Tailwind CSS dengan modul terpisah untuk Pelanggan (Customer), Mekanik (Mechanic Tablet), dan Admin Bengkel, serta kapabilitas Progressive Web App (PWA).

---

## 3. Hasil Pengujian dan Evaluasi Kepatuhan Akademik

1. **Pengujian Fungsional**: 26 Test cases otomatis (112 assertions) diuji menggunakan PHPUnit dengan hasil 100% PASS.
2. **Kepatuhan Modul Praktikum**:
   - **Praktikum A (GET)**: Terbukti aman (*safe*), *idempotent*, menyajikan dekomposisi URL lengkap dan response time <50ms.
   - **Praktikum B (POST)**: Membuktikan pengiriman payload JSON melalui request body, pengembalian status `201 Created`, dan mekanisme *Auto-Confirm*.
   - **Praktikum C (Error Testing)**: Menguji ketahanan sistem terhadap error `404 Not Found`, `405 Method Not Allowed`, `422 Unprocessable Content`, `401 Unauthorized`, `403 Forbidden`, dan `409 Conflict` (slot penuh).
