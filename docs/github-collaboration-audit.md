# Laporan Audit Repositori & Kolaborasi GitHub
**Proyek:** Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor  
**Repositori:** [https://github.com/EkoSaputro14/bengkel-motor](https://github.com/EkoSaputro14/bengkel-motor)  
**Kelompok:** 2 — Pemrograman Web Service (UAS / Praktikum Terpadu)  
**Institusi:** Universitas Harkat Negeri  
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  
**Tanggal Audit:** 8 November 2026  
**Auditor / Lead Maintainer:** Eko Saputro (`@EkoSaputro14`)

---

## 1. Metadata Repositori & Visibility
- **Nama Repositori:** `bengkel-motor`
- **Owner:** `EkoSaputro14`
- **Visibilitas:** `PUBLIC`
- **Tipe:** Repositori Mandiri (Bukan Fork, `isFork: false`)
- **Deskripsi:** "Sistem Informasi Layanan Penjadwalan Servis dan Manajemen Riwayat Perawatan Berkala Bengkel Motor (Laravel 12 + React TypeScript)"
- **URL Resmi:** `https://github.com/EkoSaputro14/bengkel-motor`

---

## 2. Default Branch & Struktur Branching
- **Default Branch:** `master`
- **Daftar Branch Remote:**
  - `origin/master` (Default, aktif)
  - `origin/main` (Legacy initial branch)
  - `origin/feature/hero-360-carousel-safe-haven` (Feature branch eksperimen carousel)
- **Status Sinkronisasi:** Branch lokal `master` sinkron dengan `origin/master` (HEAD: `18f054c`).

---

## 3. Struktur Direktori Proyek
Repositori tersusun dalam struktur **Full-Stack Monorepo**:
```text
bengkel-motor/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI (Backend PHP 8.3 & Frontend Node 20)
├── backend/                    # Laravel 12.69.3 REST API Engine
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/  # Auth, Vehicle, Slot, Booking, ServiceRecord, Health
│   │   ├── Http/Requests/V1/         # FormRequest validation rules
│   │   └── Models/                   # Eloquent models (5 core entities)
│   ├── database/migrations/          # Skema basis data 5 tabel
│   ├── database/seeders/             # Demo seeder akun Customer, Mekanik, Admin
│   ├── routes/api.php                # Endpoint versi /api/v1/
│   └── tests/Feature/                # 24 automated tests (68 assertions)
├── frontend/                   # React 19 + TypeScript + Vite + Tailwind CSS PWA
│   ├── src/
│   │   ├── components/               # Navbar, HeroCarousel, BookingModal, ApiTester
│   │   ├── context/                  # AuthContext & session management
│   │   ├── pages/                    # LandingPage, ApiTestPage
│   │   └── services/                 # Axios HTTP client & API service layer
│   └── public/                       # Aset publik & manifest PWA
├── docs/                       # Dokumentasi arsitektur, OpenAPI, pedoman, checklist
├── deliverables/               # Laporan akademik (PDF 12 halaman, ERD, dokumen resmi)
├── postman/                    # Postman Collection & Environment JSON (24 skenario)
├── README.md                   # Dokumentasi instalasi dan arsitektur repositori
├── HARNESS.md                  # Harness status dan checkpoint pengembangan
└── RELEASE_NOTES_v1.1.0.md     # Catatan rilis v1.1.0
```

---

## 4. Analisis README & Dokumentasi
- **Dokumentasi Utama:** `README.md` telah memuat ringkasan arsitektur, daftar endpoint, akun demo pengujian, dan instruksi deployment lokal.
- **Dokumentasi Teknis di `docs/`:**
  - `API_DESIGN.md` & `REST_API_DESIGN_WORKSHEET_BENGKEL_MOTOR.md`
  - `ARCHITECTURE.md` (Pola arsitektur Clean Controller & FormRequest)
  - `DECISIONS.md` (ADR keputusan arsitektur)
  - `openapi.yaml` (Spesifikasi OpenAPI 3.0 tervalidasi Redocly)
  - `PANDUAN_TESTING_POSTMAN_WINDOWS.md`
  - `TUGAS_MINGGU_4_API_DESIGN_BENGKEL_MOTOR.md`
- **Kekurangan Dokumentasi yang Ditemukan:**
  1. Belum ada panduan kontribusi resmi (`CONTRIBUTING.md`).
  2. Belum ada template Issue dan Pull Request (`.github/ISSUE_TEMPLATE/` dan `.github/pull_request_template.md`).
  3. Belum ada badge CI GitHub Actions di `README.md`.

---

## 5. Source Code & Fitur yang Tersedia
- **Backend API (Laravel 12):**
  - Autentikasi token Sanctum (Register, Login, Me, Logout).
  - RBAC (Role-Based Access Control) untuk 3 role: `CUSTOMER`, `MECHANIC`, `ADMIN`.
  - Manajemen Kendaraan (CRUD plat nomor unik dengan pembatasan hak milik).
  - Penjadwalan Slot Servis (Pengecekan kuota harian & validasi kapasitas).
  - Reservasi Booking Servis (Auto-confirmed, proteksi konflik slot penuh, pembatalan & pemulihan kuota).
  - Rekam Medis Servis (Pencatatan riwayat pengerjaan mekanik).
  - Health check endpoint `/api/v1/health`.
- **Frontend PWA (React 19 + TypeScript):**
  - Desain responsif Tailwind CSS.
  - Interactive Testing Lab di `/api-test` untuk pengujian 24 endpoint langsung dari browser.
  - PWA Offline-ready dengan Service Worker (Vite PWA).

---

## 6. Riwayat Commit (Commit History)
- Total Commit di `master`: 36+ commits.
- Format Commit: Mengikuti standar Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `ci:`, `chore:`).
- Commit teratur dan memiliki pesan deskriptif.

---

## 7. Kontributor & Identitas Tim (5 Anggota)
Berdasarkan data GitHub API (`/repos/EkoSaputro14/bengkel-motor/contributors`), kelima anggota kelompok telah terdaftar dengan kontribusi nyata:

| No | Nama Lengkap | NIM | GitHub Username | Role Akademik | Kontribusi Riwayat |
|---|---|---|---|---|---|
| 1 | **Eko Saputro** | 23215050 | `@EkoSaputro14` | Lead Maintainer / Lead Backend & DevOps | 32 commits (Arsitektur, Sanctum, CI/CD, Releases) |
| 2 | **Imzy Zulijar Setiawan** | 23215022 | `@23215022-Imzy` | Frontend Lead & UI/UX | 3 commits, PR #1 Author (Redesign UI & Testing Lab) |
| 3 | **Feldi Sanjaya** | 23215055 | `@FeldiSanJy` | API Design & Database Architect | 2 commits (Skema ERD, Migration, DB Seeders) |
| 4 | **Intan Komalasari** | 23215008 | `@intannasr28` | QA Engineer & Documentation Lead | 2 commits (OpenAPI YAML, Postman Collection, QA Docs) |
| 5 | **Zakky Fawwaz Mubarok** | 23215031 | `@zakyfawwaz` | Code Reviewer & Integration Specialist | 1 commit (Review PR #1, Integration Tests) |

---

## 8. Status Existing Issues
- **Jumlah Issue Aktif:** 0 Open, 0 Closed.
- **Temuan:** Belum ada rekam jejak formal Issue pada GitHub Issues tracker. Seluruh pekerjaan sebelumnya dikerjakan berbasis task internal.
- **Rekomendasi:** Perlu dibuat GitHub Issues yang merefleksikan modul-modul nyata untuk mendasari kolaborasi antaranggota.

---

## 9. Status Existing Pull Requests
- **PR #1:** `Redesign antarmuka frontend bengkel motor`
  - Author: `@23215022-Imzy` (`feature/redesign-ui`)
  - Status: **MERGED**
  - Review Status: **APPROVED** oleh `@EkoSaputro14`
  - Isi Perubahan: Implementasi antarmuka landing page responsif dan testing lab.

---

## 10. Status Existing Releases & Tags
- **Releases:**
  - `v1.1.0` (Latest): *Sistem Informasi Servis Bengkel Motor (REST API v1 & Testing Lab)*
- **Git Tags:**
  - `v1.1.0` (Production release)
  - `v1.0.0-academic-release` (Milestone akademik)
  - `v0.5.0-mvp` (Frontend & Backend integration)
  - `v0.1.0-backend` (Core API)
  - `save-haven-hero-360` (Tag checkpoint)

---

## 11. GitHub Actions / Continuous Integration (CI)
- **Workflow:** `.github/workflows/ci.yml` (*CI / Automated Tests & Quality Gate*)
- **Trigger:** Push & Pull Request ke branch `master`.
- **Jobs:**
  1. `backend-tests` (Ubuntu Latest, PHP 8.3, Composer, SQLite, `php artisan test`)
  2. `frontend-build` (Windows Latest, Node 20, `npm run build`, Vite Typecheck)
- **Status Terkini:** **100% SUKSES (HIJAU)** pada seluruh run terbaru.

---

## 12. Build & Test Status Aktual
- **Backend Test Suite:**
  - Perintah: `php artisan test`
  - Hasil: **24 passed, 68 assertions** (Durasi: 0.64s).
  - Rincian Suite:
    * `AuthApiTest`: 6 tests
    * `BookingApiTest`: 4 tests
    * `ErrorHandlingApiTest`: 3 tests
    * `HealthCheckTest`: 1 test
    * `ServiceRecordApiTest`: 3 tests
    * `ServiceSlotApiTest`: 4 tests
    * `VehicleApiTest`: 3 tests
- **Frontend Build:**
  - Perintah: `npm run build`
  - Hasil: `tsc -b && vite build` sukses menghasilkan bundel produksi PWA tanpa error.

---

## 13. Status Berkas Lisensi (LICENSE)
- **Status:** **BELUM ADA (`No such file or directory`)**.
- **Kebutuhan:** Perlu ditambahkan file lisensi standar open source (MIT License) untuk melengkapi kelayakan repository publik.

---

## 14. Status Working Tree Lokal
- Working tree git pada branch `master` berstatus bersih (*up to date with origin/master*).
- File sementara/screenshot lokal telah diabaikan secara aman oleh `.gitignore`.

---

## 15. Kesimpulan & Rencana Aksi Kolaborasi
Aktivitas yang perlu dilengkapi untuk memenuhi rubrik kolaborasi akademik:
1. **Pemberian Lisensi & Standar Repositori:** Pembuatan file `LICENSE` (MIT) dan template GitHub (`CONTRIBUTING.md`, Issue Templates, PR Template).
2. **Issue Management:** Pembuatan 5 Issue terstruktur yang merepresentasikan modul kerja nyata dari ke-5 anggota.
3. **Branching & PR Workflow:** Eksekusi workflow branch per-fitur/kontribusi, review antar-anggota (cross-review), dan merge ke master.
4. **Validasi & Laporan Akhir:** Pembuatan laporan penutup kolaborasi di `docs/github-collaboration-final-report.md`.
