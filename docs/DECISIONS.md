# ARCHITECTURE DECISION RECORDS (ADR)

## ADR-001: Pemilihan Backend Framework & Arsitektur API (Penetapan Laravel 12)
- **Status**: Accepted (Revised: Laravel 12 Baseline)
- **Konteks**: Proyek perkuliahan membutuhkan backend yang cepat dikembangkan, memiliki dukungan ORM kuat, validasi request bawaan, dan fitur API modern.
- **Keputusan**: Menggunakan **Laravel 12 REST API** dengan endpoint berversi `/api/v1`.
- **Konsekuensi**: Mempercepat perancangan skema data, migrasi, dan pengujian fitur dengan fondasi framework LTS/terbaru yang kompatibel dengan PHP 8.2+ dan Laravel Sanctum. Tim dapat fokus pada logika bisnis dan kepatuhan HTTP tanpa merakit dependensi dari nol.

---

## ADR-002: Mekanisme Autentikasi Pengguna
- **Status**: Accepted
- **Konteks**: Aplikasi akan diakses oleh beragam antarmuka client (smartphone, tablet, desktop) dan disiapkan untuk PWA serta inspeksi tool API Client (Postman).
- **Keputusan**: Menggunakan **Laravel Sanctum API Tokens (Stateless Bearer Tokens)**.
- **Konsekuensi**: Klien menyimpan token di secure storage/local storage dan menyertakannya di header `Authorization: Bearer <token>`. Sangat mudah diinspeksi di Postman dan kompatibel dengan arsitektur frontend decoupled.

---

## ADR-003: Model Bisnis Reservasi Servis (Auto-Confirm vs Manual Admin Approval)
- **Status**: Accepted (Baseline Disepakati)
- **Konteks**: Antrean bengkel menumpuk karena ketidakpastian. Pelanggan membutuhkan kepastian instan saat memilih jam servis tanpa harus menunggu persetujuan manual admin yang lambat.
- **Keputusan**: Menerapkan model **AUTO-CONFIRM**. Ketika pelanggan mengirim request reservasi dan slot waktu masih tersedia (`terisi < kuota_maksimal`), sistem langsung mengonfirmasi booking (`CONFIRMED`) secara atomik.
- **Konsekuensi**: Wajib mengimplementasikan concurrency control ketat di tingkat basis data (`SELECT ... FOR UPDATE`) untuk mencegah overbooking saat banyak pelanggan melakukan pemesanan pada milidetik yang sama.

---

## ADR-004: Desain Skema Basis Data 5 Tabel Inti
- **Status**: Accepted
- **Konteks**: PDF tugas menetapkan 5 tabel utama: `users`, `vehicles`, `service_slots`, `bookings`, dan `service_records`. Kebutuhan mencakup pencatatan suku cadang yang diganti.
- **Alternatif**:
  1. *Normalisasi Penuh (10+ tabel)*: Membuat tabel `spare_parts`, `spare_part_categories`, `service_record_items`, dll. (Terlalu rumit untuk 1 semester, rawan terlambat selesai).
  2. *5 Tabel Inti dengan Kolom JSON*: Mempertahankan 5 tabel inti PDF, di mana suku cadang yang diganti disimpan di kolom `suku_cadang` berformat `JSON` pada tabel `service_records`.
- **Keputusan**: Memilih opsi 2 (**5 Tabel Inti dengan JSON Column untuk suku cadang**).
- **Konsekuensi**: Menjaga arsitektur tetap ramping, sesuai 100% dengan rancangan awal PDF acuan tugas, dan tetap fleksibel menyimpan rincian sparepart tanpa melanggar batasan waktu proyek.

---

## ADR-005: Penanganan Error Status Code Saat Kuota Penuh
- **Status**: Accepted
- **Konteks**: Saat pelanggan memesan slot yang kuotanya habis karena kalah cepat dalam race condition, status code apa yang paling tepat sesuai standar RFC 9110?
- **Keputusan**: Menggunakan **HTTP 409 Conflict**.
- **Konsekuensi**: Status 409 secara semantik tepat menandakan bahwa permintaan valid secara sintaksis dan data, namun tidak dapat diproses karena terjadi konflik dengan status sumber daya terkini di server (kuota slot telah habis).

---

## ADR-006: Strategi Frontend PWA-Ready
- **Status**: Accepted
- **Konteks**: Sistem harus responsif dan siap PWA tanpa membebani fase awal dengan kompleksitas sinkronisasi data offline dua arah yang rumit.
- **Keputusan**: Membangun frontend menggunakan **React 18 + Vite + Tailwind CSS**. Tahap 1 fokus pada UI responsif mobile/tablet/desktop dan integrasi API. PWA diaktifkan pada Tahap 2 untuk instalasi aplikasi dan caching aset statis. Fitur reservasi live wajib online demi integritas kuota.
- **Konsekuensi**: PWA bertindak sebagai app-shell yang cepat diakses pelanggan dan mekanik, namun transaksi kuota tetap terpusat dan konsisten di server.
