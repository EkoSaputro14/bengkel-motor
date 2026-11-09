# Laporan Audit Keamanan OWASP API Security Top 10
**Proyek:** Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor  
**Repositori:** [https://github.com/EkoSaputro14/bengkel-motor](https://github.com/EkoSaputro14/bengkel-motor)  
**Penanggung Jawab:** Zakky Fawwaz Mubarok (`@zakyfawwaz` / 23215031)  
**Kelompok:** 2 — Pemrograman Web Service  

---

## 1. Ringkasan Eksekutif
Audit keamanan ini dilakukan untuk mengevaluasi ketahanan arsitektur REST API backend (Laravel 12) terhadap 10 kerentanan paling krusial pada antarmuka pemrograman aplikasi modern berdasarkan standar **OWASP API Security Top 10 (2023 Edition)**.

Hasil audit mengonfirmasi bahwa seluruh endpoint API telah menerapkan kontrol akses berlapis, validasi input terisolasi (*FormRequest*), mitigasi *Broken Object Level Authorization (BOLA)* melalui validasi kepemilikan resource, serta mekanisme otentikasi token berbasis *Laravel Sanctum*.

---

## 2. Matriks Evaluasi OWASP API Security Top 10

| No | Kategori Risiko OWASP | Deskripsi Potensi Risiko | Implementasi Mitigasi di Arsitektur Bengkel Motor | Status |
|---|---|---|---|:---:|
| **API1:2023** | **Broken Object Level Authorization (BOLA)** | Penyerang mengakses data objek pengguna lain dengan memanipulasi ID pada URI (misal `GET /api/v1/vehicles/{id}`). | `VehicleController` dan `BookingController` secara ketat membatasi query menggunakan scope user aktif: `$request->user()->vehicles()->findOrFail($id)`. Upaya akses ID milik user lain mengembalikan status `403 Forbidden` / `404 Not Found`. | **PASSED (SECURE)** |
| **API2:2023** | **Broken Authentication** | Kelemahan pada penerbitan, validasi, atau pencabutan token otentikasi. | Menggunakan token hashing SHA-256 via Laravel Sanctum. Password dienkripsi dengan algoritma bcrypt (*work factor* 12). Fitur Logout mencabut token secara permanen melalui `$request->user()->currentAccessToken()->delete()`. | **PASSED (SECURE)** |
| **API3:2023** | **Broken Object Property Level Authorization** | Manipulasi field sensitif melalui *Mass Assignment* (misal penyerang mengirim `role: "ADMIN"` saat registrasi). | Seluruh mutasi data menggunakan *FormRequest* khusus (`RegisterRequest`, `BookingRequest`). Model Eloquent mendefinisikan `$fillable` secara eksplisit dan melarang mass assignment atribut hak akses. | **PASSED (SECURE)** |
| **API4:2023** | **Unrestricted Resource Consumption** | Penyerang mengirim ribuan booking tanpa batas untuk menghabiskan kuota bengkel. | Setiap `ServiceSlot` memiliki kolom `kuota_maksimal` dan penguncian transaksi basis data. Validasi `terisi >= kuota_maksimal` langsung menolak booking baru dengan status `409 Conflict`. | **PASSED (SECURE)** |
| **API5:2023** | **Broken Function Level Authorization** | Pengguna biasa (Customer) memanggil fungsi administratif (misal membuat slot servis atau melihat laporan bengkel). | Diterapkan middleware Role-Based Access Control (`CheckRole:ADMIN`, `CheckRole:MECHANIC`). Pemanggilan endpoint admin tanpa hak istimewa langsung ditolak dengan status `403 Forbidden`. | **PASSED (SECURE)** |
| **API6:2023** | **Unrestricted Access to Sensitive Business Flows** | Bot membuat reservasi fiktif secara otomatis. | Setiap booking mewajibkan relasi nomor polisi kendaraan yang telah tervalidasi formatnya (`G 1234 AB`) dan terdaftar sah di bawah akun customer. | **PASSED (SECURE)** |
| **API7:2023** | **Server Side Request Forgery (SSRF)** | API membaca URL eksternal berbahaya atas permintaan client. | Tidak ada endpoint yang menerima atau mengunduh URL pihak ketiga secara dinamis. Seluruh pemrosesan bersifat lokal dan terisolasi. | **NOT APPLICABLE (SAFE)** |
| **API8:2023** | **Security Misconfiguration** | Informasi sensitif (stack trace database, kredensial .env) bocor melalui respon error HTTP. | `APP_DEBUG=false` diatur untuk lingkungan produksi. Handler exception mengembalikan format JSON standar `{status: "error", message: "..."}` tanpa mengekspos rincian internal SQL atau path file. | **PASSED (SECURE)** |
| **API9:2023** | **Improper Inventory Management** | Endpoint API usang (zombie APIs) yang tidak terpelihara tetap terbuka tanpa pengawasan. | Seluruh rute dikelompokkan dalam namespace berversi eksplisit (`/api/v1/`) dan terdokumentasi penuh pada spesifikasi `openapi.yaml`. | **PASSED (SECURE)** |
| **API10:2023** | **Unsafe Consumption of APIs** | Backend mempercayai data dari integrasi eksternal tanpa validasi. | Tidak ada konsumsi data mentah dari API eksternal tanpa parsing dan sanitasi ketat. | **NOT APPLICABLE (SAFE)** |

---

## 3. Otomasi Pengujian Keamanan
Verifikasi keamanan dapat dijalankan secara otomatis melalui skrip audit mandiri:
```bash
python scripts/audit_api_security.py
```
Skrip ini memverifikasi:
- Penolakan akses unauthenticated (401 Unauthorized).
- Penolakan pelanggaran hak akses antar-pelanggan (403 Forbidden BOLA Guard).
- Penolakan eksekusi endpoint admin oleh customer (403 Forbidden RBAC Guard).
- Penolakan duplikasi plat nomor kendaraan (422 Unprocessable Content).
- Penolakan reservasi saat slot penuh (409 Conflict Quota Guard).

Status Audit: **ALL PASSED — 100% COMPLIANT**.
