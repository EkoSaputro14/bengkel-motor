# Rencana Kolaborasi Repositori GitHub (Academic Collaboration Plan)
**Proyek:** Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor  
**Repositori:** [https://github.com/EkoSaputro14/bengkel-motor](https://github.com/EkoSaputro14/bengkel-motor)  
**Kelompok:** 2 — Pemrograman Web Service  
**Institusi:** Universitas Harkat Negeri  
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  

---

## 1. Roster Tim & Alokasi Peran (5 Anggota)

| No | Anggota | NIM | GitHub Username | Peran Utama | Fokus Kontribusi Nyata |
|---|---|---|---|---|---|
| 1 | **Eko Saputro** | 23215050 | `@EkoSaputro14` | Lead Maintainer | Manajemen repositori, orkestrasi CI/CD, review akhir, dan rilis rilis v1.2.0 |
| 2 | **Imzy Zulijar Setiawan** | 23215022 | `@23215022-Imzy` | Frontend & UI/UX Contributor | Peningkatan aksesibilitas (A11y), keyboard nav, dan status feedback di Testing Lab |
| 3 | **Feldi Sanjaya** | 23215055 | `@FeldiSanJy` | Database & Backend Contributor | Script verifikasi integritas data relasional 5 entitas dan dokumentasi seeders |
| 4 | **Intan Komalasari** | 23215008 | `@intannasr28` | QA & Documentation Contributor | Standardisasi tata kelola (LICENSE MIT, CONTRIBUTING.md, Issue/PR Templates) |
| 5 | **Zakky Fawwaz Mubarok** | 23215031 | `@zakyfawwaz` | Code Quality & Security Contributor | Audit keamanan OWASP API Security Checklist dan verifikasi sanitasi endpoint |

---

## 2. Alur Kerja Branching & PR (Branching Strategy)
Setiap kontribusi menerapkan workflow standar Git flow kolaboratif:
```text
master (protected base)
  │
  ├──> [Branch Fitur] ──> [Commit Nyata] ──> [Pull Request]
  │                                                │
  │                                          [Code Review]
  │                                                │
  │<── [Squash / Merge PR] <───────────────────────┘
  │
  └──> [Issue Closed Otomatis via "Closes #X"]
```

Aturan Eksekusi:
1. **Tidak ada commit langsung ke `master`**: Setiap penambahan kode/dokumen dilakukan via branch terisolasi.
2. **Keterkaitan Issue dan PR**: Setiap PR wajib mencantumkan referensi `Closes #ISSUE_ID`.
3. **CI Mandatory**: PR hanya boleh di-merge apabila GitHub Actions CI berstatus hijau (success).
4. **Peer Review**: Review dilakukan secara silang antarmember untuk menjamin objektivitas.

---

## 3. Matriks Rotasi Code Review (Cross-Review)

| Pull Request | Penulis (Author) | Reviewer Primer | Reviewer Sekunder | Aspek yang Diperiksa |
|---|---|---|---|---|
| **PR #2** (Governance & Templates) | `@intannasr28` | `@EkoSaputro14` | `@zakyfawwaz` | Kelengkapan lisensi MIT, kejelasan template issue/PR |
| **PR #3** (Database Integrity Script) | `@FeldiSanJy` | `@intannasr28` | `@EkoSaputro14` | Kebenaran logika relasi foreign key, performa query |
| **PR #4** (Testing Lab A11y & UI) | `@23215022-Imzy` | `@FeldiSanJy` | `@EkoSaputro14` | Standar aksesibilitas WCAG, responsivitas antarmuka |
| **PR #5** (Security & OWASP Audit) | `@zakyfawwaz` | `@23215022-Imzy` | `@EkoSaputro14` | Validasi input, penanganan token Sanctum, proteksi 403 |
| **PR #6** (CI Badges & Milestone v1.2) | `@EkoSaputro14` | `@zakyfawwaz` | `@intannasr28` | Keabsahan build badge, ringkasan rilis, catatan akademik |

---

## 4. Rincian Modul & Deliverable Kolaborasi

### Modul 1: Tata Kelola & Standardisasi Repositori
- **Penanggung Jawab:** Intan Komalasari (`@intannasr28`)
- **Issue:** *#2 — Standardisasi Tata Kelola Proyek: LICENSE MIT, Panduan Kontribusi, dan Template Issue/PR*
- **Branch:** `docs/governance-and-templates`
- **Deliverables:**
  - `LICENSE` (MIT License)
  - `CONTRIBUTING.md`
  - `.github/ISSUE_TEMPLATE/bug_report.md`
  - `.github/ISSUE_TEMPLATE/feature_request.md`
  - `.github/pull_request_template.md`

### Modul 2: Integritas Basis Data Relasional
- **Penanggung Jawab:** Feldi Sanjaya (`@FeldiSanJy`)
- **Issue:** *#3 — Skrip Verifikasi Integritas Relasional Basis Data dan Validasi Foreign Key*
- **Branch:** `feat/database-integrity-check`
- **Deliverables:**
  - `backend/app/Console/Commands/VerifyDatabaseIntegrity.php` (Artisan command `db:verify-integrity`)
  - Dokumentasi penggunaan di `docs/DATABASE_INTEGRITY.md`

### Modul 3: Peningkatan Aksesibilitas & Umpan Balik UI Testing Lab
- **Penanggung Jawab:** Imzy Zulijar Setiawan (`@23215022-Imzy`)
- **Issue:** *#4 — Aksesibilitas Web (A11y) dan Visual Feedback Status HTTP pada Interactive Testing Lab*
- **Branch:** `ui/enhance-testing-lab-a11y`
- **Deliverables:**
  - Penambahan ARIA attributes (`aria-label`, `role="status"`, `aria-live="polite"`) pada `frontend/src/pages/ApiTestPage.tsx`
  - Visual status pill yang adaptif terhadap kode status HTTP 2xx, 4xx, dan 5xx.

### Modul 4: Audit Keamanan & Kepatuhan OWASP API Security
- **Penanggung Jawab:** Zakky Fawwaz Mubarok (`@zakyfawwaz`)
- **Issue:** *#5 — Verifikasi Keamanan REST API dan Audit Kepatuhan OWASP API Security Top 10*
- **Branch:** `security/owasp-api-audit`
- **Deliverables:**
  - `docs/SECURITY_AUDIT_OWASP.md`
  - Script otomatisasi pengecekan sanitasi header CORS & Token Guard `scripts/audit_api_security.py`

### Modul 5: Orkestrasi Rilis & Dokumentasi Akhir
- **Penanggung Jawab:** Eko Saputro (`@EkoSaputro14`)
- **Issue:** *#6 — Integrasi CI Status Badges pada README dan Persiapan Rilis Terpadu v1.2.0*
- **Branch:** `chore/ci-badges-and-v1.2-release`
- **Deliverables:**
  - Update `README.md` dengan status badges GitHub Actions CI, Laravel 12, React 19, dan License MIT
  - `RELEASE_NOTES_v1.2.0.md` dan publikasi GitHub Release `v1.2.0`
  - Laporan akhir kolaborasi di `docs/github-collaboration-final-report.md`
