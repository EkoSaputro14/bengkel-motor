# CATATAN RILIS PERANGKAT LUNAK (RELEASE REPORT v1.0.0)

- **Versi Rilis**: `v1.0.0-academic-release`
- **Tanggal Rilis**: 4 Oktober 2026
- **Status Proyek**: Production Ready / Academic Submission Ready
- **Repository**: `bengkel-motor` (Kelompok 2 - Pemrograman Web Service)

---

## 1. Daftar Komponen yang Dirilis

### A. Backend REST API (Laravel 12.x)
- Arsitektur 5 Tabel Inti Relasional (`users`, `vehicles`, `service_slots`, `bookings`, `service_records`).
- Autentikasi stateless Bearer Token dengan Laravel Sanctum.
- Transaksi database atomik dengan *Pessimistic Row-Level Locking* (`lockForUpdate()`) untuk Auto-Confirm booking dan pencegahan overbooking.
- 26 Endpoint RESTful API dengan struktur envelope JSON konsisten.
- 26 Automated Feature Tests (112 assertions) lulus 100%.

### B. Frontend Web & PWA (React 19 + TypeScript + Vite + Tailwind CSS)
- Dashboard terpisah untuk 3 Role:
  1. **Customer**: Kelola motor, pilih slot jam interaktif dengan meter kapasitas, Auto-Confirm booking, riwayat reservasi.
  2. **Mechanic**: Antrean motor di pit bengkel, modal pencatatan logbook servis, input dinamis suku cadang/oli, status otomatis `COMPLETED`.
  3. **Admin**: Metrik operasional bengkel, grafik persentase okupansi slot harian, generator jadwal massal (batch), manajemen akun pengguna.
- Fitur Pencarian Riwayat Digital Publik berdasarkan Nomor Polisi kendaraan.
- PWA Ready dengan Web App Manifest dan Service Worker caching.

### C. Artefak Pengujian & Praktikum
- `postman/Bengkel_Motor_API.postman_collection.json` (17 Request siap import).
- `postman/Bengkel_Motor_Local.postman_environment.json`.
- Modul demonstrasi Praktikum A (GET), Praktikum B (POST), dan Praktikum C (Error Testing).

### D. Dokumen Akademik & Panduan
- `deliverables/Laporan_Proyek_Bengkel.docx` & `.pdf` (Laporan resmi lengkap Bab I - Bab V).
- `docs/BEGINNER_GUIDE.md` (Panduan pemula lengkap Bahasa Indonesia).
- `docs/POSTMAN_TUTORIAL.md` (Tutorial Postman).
- `docs/PROJECT_SPEC.md` (Single Source of Truth spesifikasi proyek).
- `docs/API_REFERENCE.md` & `docs/DEMO_ACCOUNTS.md`.

---

## 2. Verifikasi Kriteria Selesai (Definition of Done)

- [x] Backend boots & migrations succeed.
- [x] Frontend builds cleanly with zero TypeScript errors.
- [x] 100% Automated Backend Tests Passed (26/26).
- [x] Role-based access control (RBAC) enforced on backend.
- [x] Auto-Confirm booking & Concurrency lock verified.
- [x] Postman Collection & Environment verified.
- [x] Academic Report generated in DOCX & PDF.
- [x] Git repository clean, secrets excluded.
