# LAPORAN QUALITY ASSURANCE & HASIL PENGUJIAN OTOMATIS (QA REPORT)

---

## 1. Ringkasan Eksekutif

- **Total Automated Test Suites**: 8 Test Files
- **Total Tests Executed**: 26 Tests
- **Total Assertions**: 112 Assertions
- **Hasil Status**: **100% PASS (0 Failed, 0 Skipped)**
- **Test Framework**: PHPUnit 11.5 / Laravel Feature Testing (PHP 8.3.30)
- **Frontend Build Status**: **PASS (0 Errors)**

---

## 2. Matriks Pengujian Feature Tests Backend

| Test Class | Skenario yang Diuji | Status | Assertions |
| :--- | :--- | :--- | :--- |
| `HealthCheckTest` | `GET /api/v1/health` response structure & 200 OK | **PASS** | 2 |
| `AuthApiTest` | Register Customer valid (201 Created) | **PASS** | 5 |
| `AuthApiTest` | Register data cacat / duplikat email (422 Unprocessable) | **PASS** | 3 |
| `AuthApiTest` | Login kredensial benar (200 OK) & terbitkan token | **PASS** | 4 |
| `AuthApiTest` | Login password salah (401 Unauthorized) | **PASS** | 2 |
| `AuthApiTest` | Akses `/auth/me` & revoke token `/auth/logout` | **PASS** | 4 |
| `AuthApiTest` | Request tanpa token ditolak (401 Unauthorized) | **PASS** | 1 |
| `VehicleApiTest` | Pelanggan daftarkan & ambil daftar motor (201 & 200) | **PASS** | 6 |
| `VehicleApiTest` | Pelanggan dilarang akses/edit motor orang lain (403 Forbidden) | **PASS** | 4 |
| `VehicleApiTest` | Nomor polisi duplikat ditolak (422 Unprocessable) | **PASS** | 2 |
| `ServiceSlotApiTest`| Cek kuota slot tanggal (200 OK) & kalkulasi sisa kuota | **PASS** | 6 |
| `ServiceSlotApiTest`| Query tanggal invalid `tanggal=besok-pagi` (422 Unprocessable) | **PASS** | 3 |
| `ServiceSlotApiTest`| Pelanggan dilarang buat slot admin (403 Forbidden) | **PASS** | 1 |
| `ServiceSlotApiTest`| Admin berhasil buat slot baru (201 Created) | **PASS** | 2 |
| `BookingApiTest` | Auto-Confirm booking sukses (201 Created & status CONFIRMED) | **PASS** | 5 |
| `BookingApiTest` | Pelanggan dilarang booking pakai motor akun lain (403) | **PASS** | 3 |
| `BookingApiTest` | Booking ditolak saat kuota jam penuh (409 Conflict) | **PASS** | 2 |
| `BookingApiTest` | Batalkan booking & kuota terisi otomatis dipulihkan (200) | **PASS** | 4 |
| `ServiceRecordApiTest`| Mekanik rekam logbook & status booking jadi COMPLETED (201) | **PASS** | 4 |
| `ServiceRecordApiTest`| Pelanggan dilarang catat servis (403 Forbidden) | **PASS** | 2 |
| `ServiceRecordApiTest`| Cari riwayat servis via `no_polisi` (200 OK) | **PASS** | 4 |
| `ErrorHandlingApiTest`| Endpoint tidak ada mengembalikan 404 Not Found | **PASS** | 2 |
| `ErrorHandlingApiTest`| Method tidak didukung mengembalikan 405 Method Not Allowed | **PASS** | 2 |
| `ErrorHandlingApiTest`| Payload wajib hilang mengembalikan 422 Unprocessable | **PASS** | 3 |
| `ExampleTest (Unit)` | Unit test dasar PHPUnit | **PASS** | 1 |
| `ExampleTest (Feature)`| HTTP route homepage response | **PASS** | 1 |

---

## 3. Kepatuhan Praktikum HTTP RFC 9110

1. **Praktikum A (GET)**:
   - Menghasilkan status `200 OK`, waktu respon <50ms.
   - Idempotent dan Safe.
   - Menampilkan `Content-Type: application/json` dan dekomposisi URL lengkap.
2. **Praktikum B (POST)**:
   - Menghasilkan status `201 Created`.
   - Mengirimkan body berformat JSON dan diverifikasi tersimpan di database.
   - Menerapkan header otorisasi `Authorization: Bearer <TOKEN>`.
3. **Praktikum C (Error Testing)**:
   - Teruji sukses untuk `404 Not Found`, `405 Method Not Allowed`, `422 Unprocessable Content`, `401 Unauthorized`, `403 Forbidden`, dan `409 Conflict`.
