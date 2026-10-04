# ROADMAP IMPLEMENTASI TEKNIS (IMPLEMENTATION ROADMAP)

Roadmap ini disusun secara modular agar dapat dieksekusi secara bertahap oleh AI coding agent maupun pengembang manusia. Prioritas diarahkan pada penyelesaian kontrak API inti terlebih dahulu sebelum antarmuka pengguna.

---

### Phase 0 — Spesifikasi & Perencanaan Teknis (SELESAI)
- **Tujuan**: Menetapkan spesifikasi tunggal, aturan bisnis, kontrak API, dan skema database.
- **Deliverables**: Dokumen `PROJECT_SPEC.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`, `API_DESIGN.md`, `DECISIONS.md`.
- **Status**: Completed.

---

### Phase 1 — Repository Bootstrap & Struktur Direktori
- **Tujuan**: Mempersiapkan workspace monorepo terstruktur yang memisahkan backend dan frontend.
- **Deliverables**:
  - Direktori `backend/` (Laravel application skeleton).
  - Direktori `frontend/` (React + Vite + Tailwind skeleton).
  - File `.gitignore`, `README.md`, dan konfigurasi environment.
- **Dependencies**: Phase 0.
- **Acceptance Criteria**: Backend dan frontend dapat dijalankan pada port lokal masing-masing (`:8000` dan `:5173`).
- **Testing**: Perintah `php artisan --version` dan `npm run dev` berjalan tanpa error.

---

### Phase 2 — Laravel Backend Foundation & Sanctum Setup
- **Tujuan**: Mengonfigurasi middleware, CORS, format response JSON terpadu, dan Laravel Sanctum.
- **Deliverables**:
  - Konfigurasi `config/sanctum.php` & `config/cors.php`.
  - Base API Controller dengan helper response terstandarisasi (`successResponse`, `errorResponse`).
  - Global Exception Handler untuk merapikan error 404, 405, 422, dan 500 menjadi JSON seragam.
- **Dependencies**: Phase 1.
- **Acceptance Criteria**: Request yang salah endpoint otomatis mengembalikan format JSON error standar.

---

### Phase 3 — Migrasi Database 5 Tabel Inti & Seeders
- **Tujuan**: Membangun skema fisik database relasional dan data awal pengujian.
- **Deliverables**:
  - Migrations: `users`, `vehicles`, `service_slots`, `bookings`, `service_records`.
  - Database Seeder untuk 3 user role: Admin, Mekanik, Customer serta data awal slot waktu.
- **Dependencies**: Phase 2.
- **Acceptance Criteria**: `php artisan migrate:fresh --seed` berjalan sukses dengan seluruh foreign key dan constraint valid.

---

### Phase 4 — Modul Autentikasi & Profil Pengguna
- **Tujuan**: Menyediakan endpoint registrasi, login, me, dan logout.
- **Deliverables**:
  - `AuthController.php`, Form Request classes (`RegisterRequest`, `LoginRequest`).
  - Token generation via Sanctum.
- **Dependencies**: Phase 3.
- **Acceptance Criteria**: Klien dapat melakukan registrasi, login untuk memperoleh token, dan memanggil `GET /api/v1/auth/me` menggunakan Bearer token.
- **Testing**: Feature Test `AuthTest.php` mencakup skenario sukses dan gagal (401, 422).

---

### Phase 5 — Modul Manajemen Kendaraan Pelanggan (CRUD)
- **Tujuan**: Mengelola data motor milik pelanggan dengan otorisasi kepemilikan ketat.
- **Deliverables**:
  - `VehicleController.php`, `VehiclePolicy.php`.
  - Endpoint CRUD `/api/v1/vehicles`.
- **Dependencies**: Phase 4.
- **Acceptance Criteria**: Customer A tidak dapat melihat atau mengubah kendaraan milik Customer B (HTTP 403 Forbidden).
- **Testing**: Feature Test `VehiclePolicyTest.php`.

---

### Phase 6 — Modul Slot Servis & Pengecekan Kuota
- **Tujuan**: Menyajikan data ketersediaan slot servis per tanggal untuk pelanggan (Objek Praktikum A).
- **Deliverables**:
  - `ServiceSlotController.php`.
  - Endpoint `GET /api/v1/service-slots?tanggal=YYYY-MM-DD`.
  - Endpoint Admin untuk generate slot servis harian.
- **Dependencies**: Phase 3.
- **Acceptance Criteria**: Endpoint mengembalikan daftar slot, kuota maksimal, terisi, dan sisa kuota dengan HTTP 200 OK.
- **Testing**: Feature Test `ServiceSlotTest.php`.

---

### Phase 7 — Mesin Booking Auto-Confirm & Concurrency Control
- **Tujuan**: Memproses pemesanan servis secara otomatis dengan pencegahan overbooking (Objek Praktikum B).
- **Deliverables**:
  - `BookingController.php`, `BookingService.php`.
  - Transaksi database atomik dengan `DB::transaction()` dan `lockForUpdate()`.
  - Endpoint `POST /api/v1/bookings` dan `POST /api/v1/bookings/{id}/cancel`.
- **Dependencies**: Phase 5, Phase 6.
- **Acceptance Criteria**: Booking otomatis berstatus `CONFIRMED`. Jika kuota habis, sistem mengembalikan `409 Conflict`.
- **Testing**: Concurrency test simulasi 2 request serentak ke 1 kuota sisa.

---

### Phase 8 — Modul Rekam Servis Mekanik & Suku Cadang
- **Tujuan**: Mencatat hasil perbaikan dan suku cadang yang diganti oleh mekanik.
- **Deliverables**:
  - `ServiceRecordController.php`.
  - Endpoint `POST /api/v1/service-records` dan transisi status booking menjadi `COMPLETED`.
- **Dependencies**: Phase 7.
- **Acceptance Criteria**: Hanya booking `IN_PROGRESS` yang dapat diinput rekam servisnya. Data suku cadang tersimpan rapi dalam format JSON.
- **Testing**: Feature Test `ServiceRecordTest.php`.

---

### Phase 9 — Modul Riwayat Servis & Pencarian Nomor Polisi
- **Tujuan**: Menyediakan bank data riwayat servis digital per kendaraan dan fitur pencarian plat nomor.
- **Deliverables**:
  - Endpoint `GET /api/v1/vehicles/{id}/service-history`.
  - Endpoint `GET /api/v1/service-history/search?no_polisi=G1234ABC`.
- **Dependencies**: Phase 8.
- **Acceptance Criteria**: Riwayat servis menampilkan catatan masa lalu, odometer, tindakan mekanik, dan rincian sparepart.

---

### Phase 10 — Frontend Dashboards (Customer, Mekanik, Admin)
- **Tujuan**: Membangun antarmuka web SPA yang adaptif dan terhubung penuh ke API.
- **Deliverables**:
  - Halaman Customer: Katalog slot, form booking, daftar motor, riwayat servis.
  - Halaman Mekanik: Tampilan antrean motor bengkel, modal input tindakan servis & sparepart.
  - Halaman Admin: Manajemen slot servis harian, monitoring antrean.
- **Dependencies**: Phase 4 - 9.
- **Acceptance Criteria**: Antarmuka responsif di layar HP, tablet, dan laptop tanpa overflow horizontal.

---

### Phase 11 — PWA Enhancement (Aplikasi Web Progresif)
- **Tujuan**: Menambahkan kapabilitas installability dan caching aset statis.
- **Deliverables**:
  - File `manifest.webmanifest` & icon aplikasi.
  - Konfigurasi Service Worker (Workbox / Vite PWA Plugin).
- **Dependencies**: Phase 10.
- **Acceptance Criteria**: Audit Chrome Lighthouse PWA valid; banner "Install App" muncul di browser mobile/desktop.

---

### Phase 12 — Postman Collection & Verifikasi Praktikum HTTP
- **Tujuan**: Menyiapkan artefak siap pakai untuk demonstrasi tugas praktikum perkuliahan.
- **Deliverables**:
  - File `postman_collection.json` dan `postman_environment.json`.
  - Pengujian lengkap Praktikum A (GET), Praktikum B (POST), dan Praktikum C (Error Testing 404, 422, 405, 401, 409).
- **Dependencies**: Phase 4 - 9.
- **Acceptance Criteria**: Seluruh request di Postman Collection sukses dijalankan dengan 1-klik runner.

---

### Phase 13 — Quality Assurance, Polish & Final Handover
- **Tujuan**: Pengujian menyeluruh akhir dan penyusunan panduan operasional.
- **Deliverables**:
  - Full test suite report (Green).
  - Panduan instalasi dan pengujian di `README.md`.
- **Dependencies**: Phase 11, Phase 12.
- **Acceptance Criteria**: Sistem siap dipresentasikan dan diuji oleh dosen tanpa kendala teknis.
