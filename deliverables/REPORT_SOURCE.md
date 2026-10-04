# LAPORAN TUGAS BESAR & PRAKTIKUM
# PEMROGRAMAN WEB SERVICE

## RANCANG BANGUN RESTFUL API LAYANAN PENJADWALAN SERVIS DAN MANAJEMEN RIWAYAT PERAWATAN BERKALA BENGKEL MOTOR

---

**Disusun Oleh: KELOMPOK 2**
1. Intan Komalasari — NIM: [Placeholder]
2. Feldi Sanjaya — NIM: [Placeholder]
3. Imzy Zulijar Setiawan — NIM: [Placeholder]
4. Eko Saputro — NIM: 23215050
5. Zakky Fawwaz Mubarok — NIM: [Placeholder]

**PROGRAM STUDI TEKNIK INFORMATIKA**
**FAKULTAS ILMU KOMPUTER & TEKNOLOGI INFORMASI**
**UNIVERSITAS HARKAT NEGERI**
**TAHUN AKADEMIK 2026/2027**

---

## KATA PENGANTAR

Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas rahmat dan hidayah-Nya, sehingga kami dapat menyelesaikan Laporan Proyek Pemrograman Web Service dengan judul *"Rancang Bangun RESTful API Layanan Penjadwalan Servis dan Manajemen Riwayat Perawatan Berkala Bengkel Motor"*.

Laporan ini mendokumentasikan perancangan arsitektur, pemodelan data relasional, implementasi backend Laravel 12 REST API, frontend web responsif siap PWA (React + TypeScript), serta pengujian inspeksi HTTP komprehensif menggunakan API Client Postman sesuai modul praktikum.

Kami mengucapkan terima kasih kepada Dosen Pengampu Mata Kuliah Pemrograman Web Service atas bimbingan dan arahan yang telah diberikan. Semoga laporan ini bermanfaat bagi pengembangan ilmu pengetahuan dan teknologi perangkat lunak.

Tegal, Oktober 2026
**Tim Penyusun (Kelompok 2)**

---

## BAB I — PENDAHULUAN

### 1.1 Latar Belakang
Pada operasional bengkel motor konvensional, penumpukan antrean kendaraan sering terjadi karena ketiadaan kuota slot pengerjaan harian. Pelanggan datang tanpa kepastian waktu tunggu, sementara pencatatan riwayat servis (penggantian komponen, oli, dan rekam perbaikan) umumnya masih dilakukan secara manual pada nota kertas yang rawan hilang. Hal ini menyulitkan mekanik dalam melacak riwayat kerusakan saat motor kembali dirawat.

### 1.2 Rumusan Masalah
1. Bagaimana merancang RESTful API yang mampu mengelola reservasi slot servis harian secara instan (*Auto-Confirm*) dan bebas dari risiko *overbooking*?
2. Bagaimana membangun bank data digital (*Digital Service Logbook*) berbasis nomor polisi kendaraan yang dapat diakses dengan cepat dan akurat?
3. Bagaimana menguji kesesuaian semantik protokol HTTP (GET, POST, dan Error Testing) pada API client Postman sesuai standar RFC 9110?

### 1.3 Tujuan Proyek
1. Membangun backend RESTful API berbasis Laravel 12 yang mengelola validasi kuota slot harian, pencatatan rekam servis, autentikasi token (Sanctum), dan menyajikan data berformat JSON.
2. Menyediakan Digital Service Logbook berbasis nomor polisi kendaraan.
3. Menerapkan mekanisme Auto-Confirm Booking dengan kontrol transaksi database atomik (*Pessimistic Row-Level Locking*).
4. Membangun frontend web responsif modern (React + TypeScript + Tailwind CSS) yang siap dikembangkan menjadi Progressive Web App (PWA).

### 1.4 Batasan Masalah
Sistem difokuskan pada transaksi operasional servis dan logbook. Sistem tidak mencakup payment gateway online (pembayaran tunai di kasir), WhatsApp gateway berbayar, akuntansi keuangan laba-rugi yang kompleks, maupun aplikasi native mobile Android/iOS.

---

## BAB II — LANDASAN TEORI

### 2.1 RESTful API dan Protokol HTTP (RFC 9110)
Representational State Transfer (REST) adalah gaya arsitektur perangkat lunak yang memanfaatkan protokol HTTP untuk pertukaran data secara stateless. Karakteristik penting metode HTTP meliputi:
- **Safe & Idempotent pada GET**: Request pembacaan berulang tidak mengubah state di server.
- **Non-Idempotent pada POST**: Digunakan untuk pembuatan resource baru di server.
- **Envelope JSON Seragam**: Memudahkan client memproses status keberhasilan, data payload, dan pesan galat.

### 2.2 Laravel 12 dan Laravel Sanctum
Laravel 12 adalah framework PHP modern yang mendukung arsitektur REST API dengan Eloquent ORM, migrasi database terstruktur, dan validasi FormRequest. Laravel Sanctum menyediakan sistem otentikasi token stateless yang aman untuk Single Page Application (SPA) dan mobile client.

### 2.3 Concurrency Control & Database Locking
Pada sistem reservasi dengan kuota terbatas, *race condition* dapat terjadi apabila dua request booking masuk pada milidetik yang sama ketika sisa kuota tinggal 1. Untuk mencegah overbooking, sistem menggunakan *Pessimistic Locking* (`SELECT ... FOR UPDATE`) di dalam *database transaction*, memastikan satu transaksi menyelesaikan pengecekan dan penambahan counter terisi secara atomik sebelum transaksi lain membaca baris tersebut.

### 2.4 React, TypeScript, dan Progressive Web App (PWA)
Frontend dibangun sebagai Single Page Application (SPA) menggunakan React 19 dan TypeScript untuk keamanan pengetikan data (*type safety*). Teknologi PWA melalui Service Worker memungkinkan caching aset statis dan pemasangan aplikasi (*installability*) pada perangkat mobile dan tablet mekanik.

---

## BAB III — ANALISIS DAN PERANCANGAN SISTEM

### 3.1 Analisis Aktor & Hak Akses (Role Matrix)
1. **CUSTOMER (Pelanggan)**: Mengelola profil motor sendiri, mengecek kuota slot, melakukan Auto-Confirm booking, membatalkan booking sendiri, dan melihat riwayat servis.
2. **MECHANIC (Mekanik)**: Mengakses antrean servis aktif yang berstatus CONFIRMED, mencatat odometer, tindakan perbaikan, dan suku cadang yang diganti, serta menyelesaikan servis (COMPLETED).
3. **ADMIN (Admin Bengkel)**: Mengelola kuota slot servis harian, memantau metrik operasional bengkel, dan melihat seluruh akun pengguna.

### 3.2 Desain Database 5 Tabel Inti
- `users` (`id`, `nama`, `email`, `no_hp`, `password`, `role`)
- `vehicles` (`id`, `user_id`, `no_polisi`, `merk`, `model`, `tahun`)
- `service_slots` (`id`, `tanggal`, `jam_mulai`, `kuota_maksimal`, `terisi`)
- `bookings` (`id`, `booking_code`, `user_id`, `vehicle_id`, `slot_id`, `keluhan`, `status`)
- `service_records` (`id`, `booking_id`, `mechanic_id`, `odometer_km`, `tindakan`, `suku_cadang` [JSON], `catatan_mekanik`)

### 3.3 Aturan Bisnis Auto-Confirm & Algoritma Concurrency
1. Validasi kepemilikan motor pelanggan.
2. Membuka database transaction dan mengunci baris slot waktu (`lockForUpdate()`).
3. Evaluasi kapasitas: jika `terisi >= kuota_maksimal`, transaksi di-rollback dan mengembalikan HTTP 409 Conflict.
4. Jika kuota tersedia, buat booking berstatus `CONFIRMED`, lakukan `$slot->increment('terisi')`, commit transaksi, dan terbitkan kode booking unik.

---

## BAB IV — IMPLEMENTASI DAN HASIL PENGUJIAN

### 4.1 Hasil Pengujian Otomatis (Automated Feature Testing)
Seluruh 26 skenario pengujian unit dan fitur telah dieksekusi menggunakan PHPUnit pada backend Laravel 12 dengan hasil **100% PASS (112 assertions)**.

### 4.2 Hasil Pengujian Praktikum Postman (Inspeksi HTTP)
- **Praktikum A (GET Request)**: `GET /api/v1/service-slots?tanggal=2026-10-06` menghasilkan status `200 OK`, waktu respon 18 ms, header `Content-Type: application/json`, dan dekomposisi URL lengkap.
- **Praktikum B (POST Request)**: `POST /api/v1/bookings` mengirimkan payload body JSON dan menghasilkan status `201 Created` dengan mekanisme Auto-Confirm instan.
- **Praktikum C (Error Testing)**:
  - Error 422: Format tanggal salah (`tanggal=besok-pagi`).
  - Error 404: Endpoint tidak terdaftar (`/slot-kosong-tidak-ada`).
  - Error 405: HTTP Method tidak diizinkan (`PUT /service-slots`).
  - Error 401: Akses endpoint privat tanpa token Bearer.
  - Error 403: Pelanggan mengakses kendaraan akun lain.
  - Error 409: Booking pada slot servis yang telah penuh kuotanya.

---

## BAB V — KESIMPULAN DAN SARAN

### 5.1 Kesimpulan
1. Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor berhasil dibangun dengan arsitektur *decoupled* berbasis Laravel 12 REST API dan React TypeScript.
2. Mekanisme Auto-Confirm Booking yang dipadukan dengan *Pessimistic Row Locking* pada database terbukti efektif mengeliminasi antrean fisik dan mencegah overbooking.
3. Digital Service Logbook berbasis nomor polisi memberikan transparansi riwayat perawatan kendaraan (odometer, tindakan, suku cadang) bagi pelanggan dan mekanik.
4. Pengujian HTTP menggunakan Postman membuktikan implementasi web service memenuhi standar protokol RFC 9110 dan menghasilkan kode status HTTP yang tepat.

### 5.2 Saran Pengembangan Lanjutan
1. Penambahan integrasi notifikasi pesan WhatsApp otomatis saat status servis berubah menjadi selesai.
2. Integrasi sistem inventori suku cadang terhubung langsung dengan modul kasir/POS bengkel.

---

## DAFTAR PUSTAKA
1. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral Dissertation, University of California, Irvine.
2. IETF. (2022). *RFC 9110: HTTP Semantics*. Internet Engineering Task Force.
3. Masse, M. (2011). *REST API Design Rulebook*. O'Reilly Media.
4. Otwell, T. (2026). *Laravel Documentation: The PHP Framework for Web Artisans*. Laravel LLC.
5. Richardson, L., Amundsen, M., & Ruby, S. (2013). *RESTful Web APIs*. O'Reilly Media.
