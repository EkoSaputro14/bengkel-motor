# Bengkel Motor API - Project Harness

## Project Identity
- **Nama Proyek**: Sistem Informasi Layanan Penjadwalan Servis dan Manajemen Riwayat Perawatan Berkala Bengkel Motor
- **Kelompok**: Kelompok 2 (Pemrograman Web Service)
- **Anggota**: Intan Komalasari, Feldi Sanjaya, Imzy Zulijar Setiawan, Eko Saputro (23215050), Zakky Fawwaz Mubarok
- **Baseline Framework**: **Laravel 12.x (PHP 8.3+) + Laravel Sanctum**
- **Frontend Target**: React 18 + TypeScript + Vite + Tailwind CSS (PWA-Ready)

## Directory Structure
```
bengkel-motor/
├── backend/                    # Laravel 12.x REST API
│   ├── app/Models/             # Eloquent Models (User, HasApiTokens)
│   ├── routes/api.php          # API routes (/api/v1/...)
│   └── tests/Feature/          # PHPUnit / Pest API Tests
├── docs/                       # Project Documentation & Specifications
│   ├── PROJECT_SPEC.md         # Single Source of Truth (SSOT - Laravel 12)
│   ├── REQUIREMENTS.md         # Detailed FR, NFR, Business Rules
│   ├── ARCHITECTURE.md         # System & Software Architecture
│   ├── API_DESIGN.md           # API Contracts & Practicum Mapping
│   ├── DECISIONS.md            # Architecture Decision Records (ADR-001 revised: Laravel 12)
│   └── IMPLEMENTATION_ROADMAP.md # Step-by-step implementation phases
├── HARNESS.md                  # Project state tracker & session harness
└── .gitignore
```

## Milestone Status
- [x] **Phase 0 (Specification & Planning)**: Selesai. Dokumen `PROJECT_SPEC.md` disahkan berbasis Laravel 12.
- [x] **Phase 1 (Repository Bootstrap)**: Selesai. Struktur monorepo `backend/` dan `docs/` terstruktur.
- [x] **Phase 2 (Laravel 12 Foundation & Sanctum)**: Selesai. Laravel 12.12.2 + Framework v12.69.3 + Sanctum v4.3.3 terpasang, Health check test PASSED (3/3).
- [ ] **Phase 3 (Database Schema 5 Tabel & Auth Controller)**: Next.
