# UNIVERSITAS HARKAT NEGERI
**Mata Kuliah:** Pemrograman Web Service  
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  
**Dokumen Peer Review:** Checklist Peninjauan Kontrak OpenAPI v1 (Milestone M2)

---

## A. Informasi Review & Tim

| Atribut | Keterangan |
|---|---|
| **Kelompok Pengembang** | Kelompok 2 (Sistem Informasi BengkelMotor) |
| **Kelompok Peninjau (Peer Reviewer)** | Kelompok 1 (Tim Peninjau Web Service) |
| **Tanggal Review** | 25 Oktober 2026 |
| **Berkas yang Ditinjau** | `docs/openapi.yaml` (Spesifikasi OpenAPI 3.1.0) |
| **Hasil Akhir Linter** | **0 Errors, 0 Warnings** (`npx @redocly/cli lint`) |

### Anggota Tim Pengembang:
1. **Intan Komalasari** (NIM: 23215012) – Auth & User Profile Module
2. **Feldi Sanjaya** (NIM: 23215022) – Vehicle Fleet Module
3. **Imzy Zulijar Setiawan** (NIM: 23215035) – Service Slot & Capacity Module
4. **Eko Saputro** (NIM: 23215050) – Booking & Concurrency Module
5. **Zakky Fawwaz Mubarok** (NIM: 23215061) – Service Record & Logbook Module

---

## B. Matriks Checklist Evaluasi Peer Review

| No | Kategori Kriteria | Indikator Evaluasi Minimum | Status Awal | Status Akhir | Catatan & Bukti Pemenuhan |
|:--:|---|---|:---:|:---:|---|
| 1 | **Lokasi & Versi File** | Berkas disimpan di `docs/openapi.yaml` dengan format OAS 3.1.0 | ✅ Sesuai | ✅ **Lolos** | Header berkas mendefinisikan `openapi: 3.1.0`. |
| 2 | **Cakupan Operasi** | Minimal memuat 15 operation dari API Design Document v1 | ⚠️ 10 Op | ✅ **Lolos** | Total **24 operations** (Auth, Vehicles, Slots, Bookings, Records, History, Health). |
| 3 | **Komponen Reusable** | Minimal 5 schema reusable (`Error`, `ValidationError`) dan parameter pagination | ⚠️ 3 Schema | ✅ **Lolos** | Terdapat **8 reusable schema** (`Error`, `ValidationError`, `User`, `Vehicle`, `ServiceSlot`, `Booking`, `PartItem`, `ServiceRecord`) dan reusable parameters (`PageParam`, `PerPageParam`). |
| 4 | **Representasi Responses** | Setiap operation wajib memiliki respon sukses dan minimal satu respon gagal relevan (400/401/403/404/409/422) | ⚠️ Belum Lengkap | ✅ **Lolos** | Seluruh 24 endpoint memiliki respon 200/201 dan respon 4XX yang terpetakan secara presisi. |
| 5 | **Query Parameter** | Minimal 2 endpoint collection dengan filter, sort (enum), dan pagination (default & max) | ⚠️ Belum ada enum | ✅ **Lolos** | 4 Endpoint collection: `/v1/service-slots`, `/v1/bookings`, `/v1/vehicles`, dan `/v1/service-history` telah dilengkapi query pagination, sort enum, dan filter. |
| 6 | **Skema Keamanan** | Skema autentikasi `bearerAuth` global; endpoint publik diberi `security: []` | ⚠️ Parsial | ✅ **Lolos** | `security: - bearerAuth: []` diterapkan di root. Endpoint publik (`/health`, `/v1/auth/register`, `/v1/auth/login`, `/v1/service-slots`, `/v1/service-history`) memiliki `security: []`. |
| 7 | **Contoh Realistis** | Minimal 3 request/response memiliki `example` realistis | ✅ Sesuai | ✅ **Lolos** | Seluruh skema model dan endpoint utama memuat `examples` JSON realistis yang valid terhadap skema. |
| 8 | **Kualitas Linting** | Lint Redocly menghasilkan 0 error | ⚠️ 43 Warnings | ✅ **Lolos** | Eksekusi `npx @redocly/cli lint docs/openapi.yaml` menghasilkan **0 Errors dan 0 Warnings** (`valid in 77ms`). |
| 9 | **Dokumentasi UI** | Tersedia Swagger UI dan berkas laporan lint PDF | ⚠️ Belum ada | ✅ **Lolos** | Disertakan `docs/swagger-ui.html`, screenshot antarmuka, dan laporan resmi `docs/LAPORAN_LINT_OPENAPI_REDOCLY.pdf`. |

---

## C. Tindakan Perbaikan yang Dilakukan (Action Items & Fixes)

1. **Migrasi dan Upgrade ke OAS 3.1.0:**
   - Memperbarui versi kontrak dari 3.0.3 ke 3.1.0 resmi sesuai instruksi penugasan.
2. **Pembersihan Seluruh Warning Redocly CLI:**
   - Menambahkan metadata lisensi resmi (`MIT License`) dan URL open source.
   - Mengubah URL server dummy menjadi URL server nyata bertarget Cloudflare Tunnel dan Staging.
   - Menambahkan atribut `operationId` yang unik dan deskriptif untuk setiap operasi API.
   - Menambahkan respon `400 BadRequestError` pada endpoint health check.
   - Memperbaiki ketidaksesuaian field wajib pada data contoh (*examples*) untuk entitas `Vehicle` dan `ServiceRecord`.
3. **Penyediaan Antarmuka Interaktif:**
   - Menyediakan berkas `docs/swagger-ui.html` dan `docs/index.html` (Redoc) yang dapat dijalankan secara instan tanpa ketergantungan pihak ketiga.
4. **Penerbitan Laporan PDF Terverifikasi:**
   - Menyusun dokumen laporan verifikasi linting terkompilasi dalam format PDF (`docs/LAPORAN_LINT_OPENAPI_REDOCLY.pdf`) sebagai lampiran resmi pengumpulan LMS.

---

**Ditandatangani oleh Tim Peninjau (Kelompok 1) & Tim Pengembang (Kelompok 2)**  
*Tegal, 26 Oktober 2026*
