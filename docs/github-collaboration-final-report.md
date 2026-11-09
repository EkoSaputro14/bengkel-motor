# Laporan Akhir Orkestrasi Kolaborasi GitHub & Workflow Akademik
**Proyek:** Sistem Informasi Layanan Penjadwalan Servis & Manajemen Riwayat Perawatan Berkala Bengkel Motor  
**Repositori:** [https://github.com/EkoSaputro14/bengkel-motor](https://github.com/EkoSaputro14/bengkel-motor)  
**Kelompok:** 2 — Pemrograman Web Service  
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  
**Institusi:** Universitas Harkat Negeri  
**Tanggal Evaluasi:** 8 November 2026  

---

## 1. Repository Overview

- **Nama Repositori**: `EkoSaputro14/bengkel-motor`
- **Visibilitas**: Publik
- **Default Branch**: `master`
- **Arsitektur Proyek**: Full-stack Monorepo
  - **Backend**: Laravel 12.x RESTful API (`/api/v1`) dengan Laravel Sanctum, SQLite/MySQL DB, FormRequests, dan RBAC.
  - **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS Progressive Web Application (PWA) dengan Interactive Testing Lab (`/api-test`).
- **Otomasi CI/CD**: GitHub Actions Multi-Platform Runner (`.github/workflows/ci.yml`) dengan 2 continuous job: Linux PHP 8.3 test suite & Windows Node 20 build.
- **Lisensi**: MIT License ([LICENSE](LICENSE))
- **Pedoman Kontribusi**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 2. Daftar Anggota Tim & Alokasi Peran

| No | Nama Lengkap | NIM | GitHub Username | Peran Tim | Tanggung Jawab Utama |
|---|---|---|---|---|---|
| 1 | **Eko Saputro** | 23215050 | [@EkoSaputro14](https://github.com/EkoSaputro14) | Lead Maintainer | Repository management, CI/CD orchestration, final code review, release management |
| 2 | **Imzy Zulijar Setiawan** | 23215022 | [@23215022-Imzy](https://github.com/23215022-Imzy) | Frontend Lead | UI/UX design, Web Accessibility (A11y ARIA), PWA, API Testing Lab |
| 3 | **Feldi Sanjaya** | 23215055 | [@FeldiSanJy](https://github.com/FeldiSanJy) | Database Architect | Database schema, foreign key relational integrity audit command, seeders |
| 4 | **Intan Komalasari** | 23215008 | [@intannasr28](https://github.com/intannasr28) | QA Lead | Governance, MIT licensing, PR/Issue templates, OpenAPI documentation |
| 5 | **Zakky Fawwaz Mubarok** | 23215031 | [@zakyfawwaz](https://github.com/zakyfawwaz) | Code Quality & Security | OWASP API Security Top 10 compliance audit, automated security verification script |

---

## 3. Daftar Issues GitHub Terverifikasi

| Issue | Judul Issue | Assignee / PIC | Label | Status | Keterangan Verifikasi |
|---|---|---|---|:---:|---|
| **#2** | `docs(governance): standardisasi tata kelola repositori, lisensi MIT, dan template kontribusi` | `@intannasr28` | `documentation`, `quality-gate` | **CLOSED** | Ditutup otomatis via PR #7 (`Closes #2`) |
| **#3** | `feat(database): implementasi perintah verifikasi integritas data relasional dan audit foreign key` | `@FeldiSanJy` | `enhancement`, `database` | **CLOSED** | Ditutup otomatis via PR #8 (`Closes #3`) |
| **#4** | `ui(testing-lab): peningkatan aksesibilitas web (A11y) dan umpan balik visual respon endpoint` | `@23215022-Imzy` | `enhancement`, `ui` | **CLOSED** | Ditutup otomatis via PR #9 (`Closes #4`) |
| **#5** | `security(audit): audit kepatuhan OWASP API Security Top 10 dan verifikasi proteksi endpoint` | `@zakyfawwaz` | `security`, `quality-gate` | **CLOSED** | Ditutup otomatis via PR #10 (`Closes #5`) |
| **#6** | `chore(release): integrasi status badge CI pada README dan orkestrasi rilis terpadu v1.2.0` | `@EkoSaputro14` | `chore`, `quality-gate` | **CLOSED** | Ditutup otomatis via PR #11 (`Closes #6`) |

---

## 4. Daftar Pull Requests & Branching Lifecycle

Alur kerja branch mengikuti standar baku:  
`master` → `feature/topic branch` → `Pull Request` → `CI Quality Gate` → `Peer Code Review` → `Squash/Fast-forward Merge` → `Branch Deleted`.

| PR | Judul Pull Request | Head Branch | Author | Reviewer & Approval | Status CI | Status Merge |
|---|---|---|---|---|:---:|:---:|
| **#1** | Redesign antarmuka frontend bengkel motor | `feature/redesign-ui` | `@23215022-Imzy` | `@EkoSaputro14` | PASS | **MERGED** |
| **#7** | `docs(governance): add MIT license, contributing guidelines, and GitHub templates` | `docs/governance-and-templates` | `@intannasr28` | `@EkoSaputro14`, `@zakyfawwaz` | PASS (Hijau) | **MERGED** |
| **#8** | `feat(database): implement artisan command to verify relational data integrity` | `feat/database-integrity-check` | `@FeldiSanJy` | `@intannasr28`, `@EkoSaputro14` | PASS (Hijau) | **MERGED** |
| **#9** | `ui(testing-lab): enhance accessibility (A11y) and status feedback in API testing console` | `ui/enhance-testing-lab-a11y` | `@23215022-Imzy` | `@FeldiSanJy`, `@EkoSaputro14` | PASS (Hijau) | **MERGED** |
| **#10** | `security(audit): implement OWASP API security audit and verification script` | `security/owasp-api-audit` | `@zakyfawwaz` | `@23215022-Imzy`, `@EkoSaputro14` | PASS (Hijau) | **MERGED** |
| **#11** | `chore(release): integrate CI badges to README and finalize collaborative release v1.2.0` | `chore/ci-badges-and-v1.2-release` | `@EkoSaputro14` | `@zakyfawwaz`, `@intannasr28` | PASS (Hijau) | **MERGED** |

---

## 5. Ringkasan Code Review & Tata Kelola Kolaborasi

Semua Pull Request melalui proses peer review nyata dan tercatat pada riwayat GitHub PR Review:
- **PR #7 (Governance)**: Direview oleh Lead Maintainer (@EkoSaputro14) mencakup validitas teks lisensi MIT, format template issue bug report & feature request, serta pedoman branch.
- **PR #8 (Database Integrity)**: Direview (@intannasr28, @EkoSaputro14) mencakup eksekusi command Artisan, pengujian zero orphan foreign keys, dan validitas kuota slot servis (`terisi <= kuota_maksimal`).
- **PR #9 (UI Accessibility)**: Direview (@FeldiSanJy, @EkoSaputro14) mencakup penambahan landmark ARIA (`role="navigation"`, `role="region"`, `role="status"` dengan `aria-live="polite"`), serta verifikasi build TypeScript & Vite.
- **PR #10 (Security Audit)**: Direview (@23215022-Imzy, @EkoSaputro14) mencakup evaluasi 10 kategori risiko OWASP API 2023 dan pengujian eksekusi skrip `scripts/audit_api_security.py` (6/6 assertions pass).
- **PR #11 (Final Release)**: Direview (@zakyfawwaz, @intannasr28) mencakup kerapian penyajian README.md, badge status CI, badge hasil tes, dan kelengkapan rilis notes `v1.2.0`.

---

## 6. Status Rilis (Release Management)

- **Rilis v1.1.0**: `v1.1.0 — Sistem Informasi Servis Bengkel Motor (REST API v1 & Testing Lab)`
- **Rilis v1.2.0 (Academic Milestone)**:
  - **Tag**: `v1.2.0`
  - **Judul**: `v1.2.0 — Collaborative Academic Milestone (Full Team Integration)`
  - **URL**: [https://github.com/EkoSaputro14/bengkel-motor/releases/tag/v1.2.0](https://github.com/EkoSaputro14/bengkel-motor/releases/tag/v1.2.0)
  - **Catatan Rilis**: Terdokumentasi penuh di [RELEASE_NOTES_v1.2.0.md](RELEASE_NOTES_v1.2.0.md)

---

## 7. Status Kontributor Terverifikasi

Berdasarkan API resmi GitHub (`/repos/EkoSaputro14/bengkel-motor/contributors`) dan riwayat `git log`:
1. `@EkoSaputro14` (Eko Saputro) — 33 commits (Lead Maintainer)
2. `@23215022-Imzy` (Imzy Zulijar Setiawan) — 3 commits (Frontend Lead)
3. `@FeldiSanJy` (Feldi Sanjaya) — 2 commits (Database Architect)
4. `@intannasr28` (Intan Komalasari) — 2 commits (QA & Documentation Lead)
5. `@zakyfawwaz` (Zakky Fawwaz Mubarok) — 1 commit (Security Reviewer)

Kelima anggota terdaftar secara sah dan memiliki kontribusi kode yang terintegrasi di branch `master`.

---

## 8. Ringkasan Pengujian Kualitas (Testing & Quality Gates)

1. **Backend Automated Feature Tests (`php artisan test`)**:
   - Status: **Tests: 24 passed (68 assertions)**
   - Durasi: ~0.64s
2. **Frontend Production Build (`npm run build`)**:
   - Status: **Build Success (0 Type Errors)**
   - Modul: 1679 modules transformed, Service Worker & Manifest tergenerasi.
3. **Database Relational Integrity (`php artisan db:verify-integrity`)**:
   - Status: **6 Checks VALID (Exit code 0)**
4. **OWASP API Security Baseline (`python scripts/audit_api_security.py`)**:
   - Status: **6/6 Security Assertions Passed (100.0%)**
5. **Continuous Integration (GitHub Actions Multi-Runner)**:
   - Status: **All Workflows Green (Passed)**

---

## 9. Checklist Pemenuhan Kriteria Kolaborasi Akademik

- [x] **Repository audit completed**: Analisis 15 poin terdokumentasi di `docs/github-collaboration-audit.md`.
- [x] **Collaboration plan created**: Pembagian tugas 5 anggota terstruktur di `docs/github-collaboration-plan.md`.
- [x] **Issues created**: 5 Issue relevan (#2, #3, #4, #5, #6) dibuat dengan konteks, scope, dan DoD lengkap.
- [x] **Contributors assigned**: Masing-masing anggota ditetapkan sebagai PIC/Assignee sesuai keahlian.
- [x] **Feature branches created**: Setiap pekerjaan menggunakan branch terisolasi (`docs/`, `feat/`, `ui/`, `security/`, `chore/`).
- [x] **Pull Requests opened**: 5 Pull Request (#7, #8, #9, #10, #11) dibuat dengan conventional titles dan kaitan `Closes #issue`.
- [x] **Code Reviews completed**: Peer review tercatat pada setiap PR dengan catatan evaluasi teknis nyata.
- [x] **PRs merged**: Seluruh PR berhasil dimerge ke branch `master` tanpa konflik.
- [x] **Issues closed after verification**: Semua Issue tertutup otomatis melalui penyelesaian PR.
- [x] **Release published**: Rilis akademik `v1.2.0` dipublikasikan dengan release notes komprehensif.
- [x] **Contributors verified**: Kelima anggota terverifikasi pada git commit log dan GitHub contributor graph.
- [x] **Final report created**: Laporan akhir tersimpan di `docs/github-collaboration-final-report.md`.

---

## 10. Tautan Bukti Aktivitas GitHub

- **Repositori Utama**: [https://github.com/EkoSaputro14/bengkel-motor](https://github.com/EkoSaputro14/bengkel-motor)
- **Daftar Issues Selesai**: [https://github.com/EkoSaputro14/bengkel-motor/issues?q=is%3Aissue+is%3Aclosed](https://github.com/EkoSaputro14/bengkel-motor/issues?q=is%3Aissue+is%3Aclosed)
- **Daftar Merged PRs**: [https://github.com/EkoSaputro14/bengkel-motor/pulls?q=is%3Apr+is%3Amerged](https://github.com/EkoSaputro14/bengkel-motor/pulls?q=is%3Apr+is%3Amerged)
- **GitHub Actions Workflows**: [https://github.com/EkoSaputro14/bengkel-motor/actions](https://github.com/EkoSaputro14/bengkel-motor/actions)
- **GitHub Contributors**: [https://github.com/EkoSaputro14/bengkel-motor/graphs/contributors](https://github.com/EkoSaputro14/bengkel-motor/graphs/contributors)
- **Milestone Rilis v1.2.0**: [https://github.com/EkoSaputro14/bengkel-motor/releases/tag/v1.2.0](https://github.com/EkoSaputro14/bengkel-motor/releases/tag/v1.2.0)
