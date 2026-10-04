# INDEKS BUKTI PENGUJIAN SISTEM (EVIDENCE INDEX)

Berikut adalah daftar verifikasi dan bukti eksekusi pengujian sistem:

1. **Hasil Feature Tests Backend (PHPUnit)**:
   - Total Tests: 26 Tests
   - Total Assertions: 112 Assertions
   - Hasil: 100% Passed (0 Failures, 0 Errors)

2. **Pengujian Praktikum A (GET Request)**:
   - Request: `GET /api/v1/service-slots?tanggal=2026-10-06`
   - Status: `200 OK` (Safe, Idempotent, response time <50ms)

3. **Pengujian Praktikum B (POST Request)**:
   - Request: `POST /api/v1/bookings`
   - Status: `201 Created` (Auto-Confirmed status, Booking Code generated)

4. **Pengujian Praktikum C (Error Testing)**:
   - 422 Unprocessable Content: `GET /api/v1/service-slots?tanggal=besok-pagi`
   - 404 Not Found: `GET /api/v1/slot-kosong-tidak-ada`
   - 405 Method Not Allowed: `PUT /api/v1/service-slots`
   - 401 Unauthorized: Request tanpa Bearer Token
   - 403 Forbidden: Pelanggan booking menggunakan motor milik akun lain
   - 409 Conflict: Booking pada slot yang kuotanya telah penuh

5. **Frontend Build**:
   - Bundled size: 421 kB JS, 41 kB CSS
   - PWA Service Worker: `dist/sw.js` precache 5 entries
   - TypeScript Check: 0 Errors
