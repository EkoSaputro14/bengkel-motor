# Panduan Kontribusi (Contributing Guidelines)

Terima kasih telah tertarik untuk berkontribusi pada proyek **Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor**! Dokumen ini menguraikan pedoman kontribusi kode, pelaporan bug, dan alur kerja kolaborasi Git.

---

## 1. Kode Etik Kolaborasi
- Bersikap profesional, menghargai sesama kontributor, dan konstruktif dalam memberikan saran saat proses *Code Review*.
- Menggunakan bahasa yang sopan dan jelas (Bahasa Indonesia atau Bahasa Inggris teknis).

---

## 2. Alur Kerja Git (Git Workflow)
Kami menggunakan alur kerja berbasis *feature branch* dan *Pull Request*:

1. **Sinkronisasi**: Pastikan branch `master` lokal selalu up-to-date sebelum membuat branch baru.
   ```bash
   git checkout master
   git pull origin master
   ```
2. **Buat Branch**: Gunakan format penamaan branch yang deskriptif:
   - `feat/nama-fitur` (untuk penambahan fungsionalitas baru)
   - `fix/nama-bug` (untuk perbaikan bug atau error)
   - `docs/nama-dokumen` (untuk pembaruan dokumentasi)
   - `test/nama-pengujian` (untuk penambahan skenario test)
   - `refactor/nama-modul` (untuk refactoring kualitas kode)
3. **Commit Sesuai Standar**: Terapkan standar *Conventional Commits*:
   - `feat:` Menambahkan fitur baru.
   - `fix:` Memperbaiki bug.
   - `docs:` Perubahan dokumentasi.
   - `test:` Penambahan atau perbaikan unit/feature tests.
   - `ci:` Perubahan pada skrip workflow GitHub Actions.
   - `chore:` Tugas pemeliharaan rutin.
4. **Verifikasi Lokal**: Pastikan seluruh pengujian lolos sebelum push:
   ```bash
   # Backend Test
   cd backend && php artisan test

   # Frontend Build
   cd frontend && npm run build
   ```
5. **Buat Pull Request**: Buka PR ke branch `master` dengan menyertakan deskripsi lengkap dan referensi issue terkait (`Closes #ID`).

---

## 3. Standar Code Review
- Setiap PR wajib melewati tahap *Peer Code Review* minimal 1 anggota tim sebelum diperbolehkan untuk di-merge.
- Reviewer memeriksa kebenaran logika, keamanan (validasi input & otentikasi), konsistensi arsitektur, dan lulusnya pipeline CI.

---

## 4. Tim Pengembang Resmi (Kelompok 2)
1. **Intan Komalasari** (23215008) — QA & Documentation Lead
2. **Feldi Sanjaya** (23215055) — Database Architect & Backend Engineer
3. **Imzy Zulijar Setiawan** (23215022) — Frontend Lead & UI/UX Specialist
4. **Eko Saputro** (23215050) — Lead Maintainer & DevOps Engineer
5. **Zakky Fawwaz Mubarok** (23215031) — Code Quality & Security Reviewer
