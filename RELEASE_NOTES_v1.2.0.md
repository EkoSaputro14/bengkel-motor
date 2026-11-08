# Release Notes v1.2.0 — Collaborative Academic Milestone
**Sistem Informasi Layanan Penjadwalan Servis & Manajemen Riwayat Perawatan Berkala Bengkel Motor**  
**Versi:** `v1.2.0`  
**Tanggal Rilis:** 8 November 2026  
**Repositori:** [https://github.com/EkoSaputro14/bengkel-motor](https://github.com/EkoSaputro14/bengkel-motor)  
**Kelompok:** 2 — Pemrograman Web Service  
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  
**Institusi:** Universitas Harkat Negeri  

---

## 🌟 Ringkasan Rilis v1.2.0
Rilis `v1.2.0` menandai pencapaian tonggak kolaborasi akademik (*Collaborative Academic Milestone*) penuh di mana seluruh 5 anggota tim telah mengintegrasikan modul tanggung jawab masing-masing melalui alur kerja Git flow resmi (*Issues → Branches → Pull Requests → Peer Code Reviews → CI Quality Gate → Merged*).

Pada versi ini, sistem telah diperkuat dengan tata kelola lisensi open source resmi (MIT), perintah audit integritas relasional basis data, peningkatan aksesibilitas web (WCAG 2.1 AA) pada Testing Lab, audit kepatuhan OWASP API Security Top 10, dan badge status Continuous Integration (CI).

---

## 👥 Kontributor & Modul yang Dimerge

| Pull Request | Modul / Fitur | Kontributor Utama | Reviewer & Approval | Status |
|---|---|---|---|:---:|
| **PR #1** | Redesign Antarmuka Frontend & Testing Lab PWA | Imzy Zulijar Setiawan (`@23215022-Imzy`) | Eko Saputro (`@EkoSaputro14`) | **MERGED** |
| **PR #7** | Tata Kelola Open Source (LICENSE MIT, CONTRIBUTING, Templates) | Intan Komalasari (`@intannasr28`) | Eko Saputro (`@EkoSaputro14`), Zakky Fawwaz M. (`@zakyfawwaz`) | **MERGED** |
| **PR #8** | Artisan Command Verifikasi Integritas Relasional Basis Data (`db:verify-integrity`) | Feldi Sanjaya (`@FeldiSanJy`) | Intan Komalasari (`@intannasr28`), Eko Saputro (`@EkoSaputro14`) | **MERGED** |
| **PR #9** | Aksesibilitas Web (A11y ARIA) & Visual Status Feedback Testing Lab | Imzy Zulijar Setiawan (`@23215022-Imzy`) | Feldi Sanjaya (`@FeldiSanJy`), Eko Saputro (`@EkoSaputro14`) | **MERGED** |
| **PR #10** | Audit Kepatuhan OWASP API Security Top 10 & Script Verifikasi Keamanan | Zakky Fawwaz Mubarok (`@zakyfawwaz`) | Imzy Zulijar S. (`@23215022-Imzy`), Eko Saputro (`@EkoSaputro14`) | **MERGED** |
| **PR #11** | Integrasi CI Badges pada README & Orkestrasi Rilis v1.2.0 | Eko Saputro (`@EkoSaputro14`) | Zakky Fawwaz M. (`@zakyfawwaz`), Intan Komalasari (`@intannasr28`) | **MERGED** |

---

## 🛠️ Rincian Fitur Baru & Peningkatan

### 1. Tata Kelola & Standardisasi Repositori (Lead: Intan Komalasari)
- Penambahan file `LICENSE` (MIT License) dengan atribusi resmi kepada 5 anggota tim.
- Penambahan `CONTRIBUTING.md` yang memuat panduan Git branch, konvensi pesan commit, dan etika kontribusi.
- Template issue pelaporan bug (`.github/ISSUE_TEMPLATE/bug_report.md`) dan permintaan fitur (`feature_request.md`).
- Template pull request (`.github/pull_request_template.md`).

### 2. Diagnostik Integritas Basis Data Relasional (Lead: Feldi Sanjaya)
- Penambahan custom command: `php artisan db:verify-integrity`.
- Memvalidasi 6 aspek kesehatan database:
  1. Distribusi akun dan role user (`CUSTOMER`, `MECHANIC`, `ADMIN`).
  2. Pemeriksaan *orphan records* pada foreign key `user_id` di tabel `vehicles`.
  3. Pemeriksaan konsistensi kapasitas slot (`terisi <= kuota_maksimal`).
  4. Pemeriksaan integritas referensial foreign key pada tabel `bookings`.
  5. Pemeriksaan keterikatan rekam medis servis pada tabel `service_records`.
  6. Pemeriksaan kuota non-negatif (`terisi >= 0`).

### 3. Peningkatan Aksesibilitas UI/UX Testing Lab (Lead: Imzy Zulijar Setiawan)
- Penambahan atribut `role="navigation"` dan `aria-label="Katalog Endpoint API"`.
- Implementasi `role="status"` dan `aria-live="polite"` pada panel inspeksi respon agar perubahan status asinkron dapat dibaca oleh pembaca layar (*screen reader*).
- Penyesuaian kontras warna status kode HTTP sesuai standar WCAG 2.1 Level AA.

### 4. Audit Keamanan OWASP API Security Top 10 (Lead: Zakky Fawwaz Mubarok)
- Dokumen komprehensif `docs/SECURITY_AUDIT_OWASP.md` yang mengevaluasi BOLA, Broken Auth, Mass Assignment, Resource Consumption, dan Function Level Authorization.
- Skrip audit mandiri `scripts/audit_api_security.py` yang menguji penolakan unauthenticated request, proteksi endpoint admin, dan isolasi objek.

### 5. Integrasi CI & Visibilitas Status (Lead: Eko Saputro)
- Badge status GitHub Actions CI tersemat di `README.md`.
- Badge kelulusan pengujian (24 passed, 68 assertions) dan lisensi MIT.

---

## 📊 Hasil Pengujian & Verifikasi Kualitas

- **Laravel Test Suite (`php artisan test`)**:
  - `Tests: 24 passed (68 assertions)`
  - Durasi: 0.69s (100% Pass)
- **Frontend PWA Production Build (`npm run build`)**:
  - 1679 modules transformed, 0 type errors.
  - Service worker dan Web App Manifest ter-precache secara optimal.
- **Relational Integrity Audit (`php artisan db:verify-integrity`)**:
  - 6 entitas berstatus VALID (Exit code 0).
- **OWASP Security Audit (`python scripts/audit_api_security.py`)**:
  - 6/6 security assertions passed (100% Compliant).
- **GitHub Actions Continuous Integration**:
  - Job `Backend Test Suite (Laravel 12)`: **PASS** (Linux PHP 8.3)
  - Job `Frontend Build & Typecheck (React 19)`: **PASS** (Windows Node 20)

---

## 📌 Catatan Batasan & Lingkungan (Known Limitations)
- Database development menggunakan SQLite; untuk lingkungan produksi disarankan menggunakan MySQL 8.0+ dengan mengaktifkan InnoDB engine untuk menjamin transaksi *pessimistic lock* tetap optimal pada konkurensi tinggi.
- Testing lab di `/api-test` beroperasi pada domain lokal (`http://localhost:8000/api/v1`).
