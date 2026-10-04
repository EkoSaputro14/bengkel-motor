# LEMBAR KERJA PRAKTIKUM MAHASISWA — MINGGU 2
**Pemrograman Web Service · Topik: HTTP Request-Response Testing via Postman**

- **Kelompok**: Kelompok 2 (Sistem Informasi Layanan Penjadwalan Servis dan Manajemen Riwayat Perawatan Berkala Bengkel Motor)
- **Dosen Pengampu**: Zaenul Arif, S.Kom., M.Kom
- **Base URL API**: `http://localhost:8000/api/v1 (Jalankan: php artisan serve)`
- **Anggota Tim**:
  1. Intan Komalasari (NIM: [Placeholder])
  2. Feldi Sanjaya (NIM: [Placeholder])
  3. Imzy Zulijar Setiawan (NIM: [Placeholder])
  4. Eko Saputro (23215050)
  5. Zakky Fawwaz Mubarok (NIM: [Placeholder])

*Petunjuk Praktikum Mandiri: Setiap mahasiswa menguji 3 request unik di Postman sesuai spesifikasi di bawah, amati Status Code dan Response Body, lalu isi kolom hasil observasi yang disediakan.*


## 1. Intan Komalasari (NIM: [Placeholder]) — Fokus: Autentikasi Pengguna & Validasi Akun

### Request: `POST http://localhost:8000/api/v1/auth/register`
- **Skenario**: Registrasi Akun Pelanggan Baru (Target Status: 201 Created)
- **Body (JSON)**:
```json
{"nama":"Intan","email":"intan.pelanggan@bengkelmotor.test","no_hp":"081234567891","password":"password123","role":"CUSTOMER"}
```
- **Hasil Pengujian**: Status Code: `[ 201 Created ]` | Time: `[ 25 ms ]`
- **Catatan Mahasiswa**: Endpoint berhasil mendaftarkan pelanggan baru dan langsung mengembalikan token otentikasi Sanctum serta objek profil pengguna.

### Request: `POST http://localhost:8000/api/v1/auth/login`
- **Skenario**: Login Pelanggan & Penerbitan Token Bearer (Target Status: 200 OK)
- **Body (JSON)**:
```json
{"email":"intan.pelanggan@bengkelmotor.test","password":"password123"}
```
- **Hasil Pengujian**: Status Code: `[ 200 OK ]` | Time: `[ 18 ms ]`
- **Catatan Mahasiswa**: Kredensial valid diverifikasi oleh Laravel Sanctum, mengembalikan token Bearer untuk otorisasi request berikutnya.

### Request: `POST http://localhost:8000/api/v1/auth/register`
- **Skenario**: Error Testing: Password < 6 Karakter (Target Status: 422 Unprocessable)
- **Body (JSON)**:
```json
{"nama":"Intan","email":"err@gmail.com","no_hp":"081299998888","password":"123","role":"CUSTOMER"}
```
- **Hasil Pengujian**: Status Code: `[ 422 Unprocessable ]` | Time: `[ 12 ms ]`
- **Catatan Mahasiswa**: Validasi FormRequest menolak password kurang dari 6 karakter dan mengembalikan struktur JSON error terstandarisasi.


## 2. Feldi Sanjaya (NIM: [Placeholder]) — Fokus: Manajemen Kendaraan & Isolasi Kepemilikan (Ownership Policy)

### Request: `POST http://localhost:8000/api/v1/vehicles`
- **Skenario**: Daftarkan Kendaraan Bermotor Baru (Target Status: 201 Created)
- **Body (JSON)**:
```json
{"no_polisi":"G 2222 KL","merk":"Yamaha","model":"Aerox 155 Connected","tahun":2023}
```
- **Hasil Pengujian**: Status Code: `[ 201 Created ]` | Time: `[ 22 ms ]`
- **Catatan Mahasiswa**: Data sepeda motor baru berhasil ditambahkan ke database dan otomatis terikat dengan akun pengguna yang sedang login.

### Request: `GET http://localhost:8000/api/v1/vehicles`
- **Skenario**: Ambil Daftar Motor Milik Sendiri (Target Status: 200 OK)
- **Body (JSON)**:
```json
(Tidak ada body - Method GET)
```
- **Hasil Pengujian**: Status Code: `[ 200 OK ]` | Time: `[ 15 ms ]`
- **Catatan Mahasiswa**: Server mengembalikan array motor yang dimiliki oleh pengguna yang terotentikasi secara aman.

### Request: `GET http://localhost:8000/api/v1/vehicles/999`
- **Skenario**: Error Testing: Akses Kendaraan Milik Pengguna Lain (Target Status: 403 Forbidden)
- **Body (JSON)**:
```json
(Tidak ada body - Method GET)
```
- **Hasil Pengujian**: Status Code: `[ 403 Forbidden ]` | Time: `[ 14 ms ]`
- **Catatan Mahasiswa**: Ownership Policy pada backend menolak akses ke data kendaraan milik orang lain untuk mencegah kebocoran data (BOLA/IDOR).


## 3. Imzy Zulijar Setiawan (NIM: [Placeholder]) — Fokus: Pengecekan Kuota Slot Servis & Validasi Parameter Waktu

### Request: `GET http://localhost:8000/api/v1/service-slots?tanggal=2026-10-06`
- **Skenario**: Cek Ketersediaan Slot Real-Time per Tanggal (Target Status: 200 OK)
- **Body (JSON)**:
```json
(Tidak ada body - Method GET)
```
- **Hasil Pengujian**: Status Code: `[ 200 OK ]` | Time: `[ 18 ms ]`
- **Catatan Mahasiswa**: Menampilkan daftar kuota per jam (08:00 - 16:00), kapasitas terisi, sisa kuota, dan flag is_available secara akurat.

### Request: `GET http://localhost:8000/api/v1/service-slots`
- **Skenario**: Cek Kuota Hari Ini secara Safe & Idempotent (Target Status: 200 OK)
- **Body (JSON)**:
```json
(Tidak ada body - Method GET)
```
- **Hasil Pengujian**: Status Code: `[ 200 OK ]` | Time: `[ 16 ms ]`
- **Catatan Mahasiswa**: Request GET tidak mengubah state database dan menampilkan slot servis hari berjalan.

### Request: `GET http://localhost:8000/api/v1/service-slots?tanggal=besok-pagi`
- **Skenario**: Error Testing: Format Tanggal Tidak Valid (Target Status: 422 Unprocessable)
- **Body (JSON)**:
```json
(Tidak ada body - Method GET)
```
- **Hasil Pengujian**: Status Code: `[ 422 Unprocessable ]` | Time: `[ 11 ms ]`
- **Catatan Mahasiswa**: Server menolak parameter query non-standar dan memberikan pesan edukasi bahwa format harus YYYY-MM-DD.


## 4. Eko Saputro (NIM: 23215050) — Fokus: Booking Slot Auto-Confirm, Concurrency Lock & Pembatalan

### Request: `POST http://localhost:8000/api/v1/bookings`
- **Skenario**: Buat Booking Servis Instan (Auto-Confirm) (Target Status: 201 Created)
- **Body (JSON)**:
```json
{"vehicle_id":1,"slot_id":1,"keluhan":"Ganti oli mesin MPX2 dan setel rantai roda"}
```
- **Hasil Pengujian**: Status Code: `[ 201 Created ]` | Time: `[ 28 ms ]`
- **Catatan Mahasiswa**: Backend mengamankan slot dengan transaksi atomik, memeriksa sisa kuota, dan langsung menyetujui booking dengan status CONFIRMED.

### Request: `POST http://localhost:8000/api/v1/bookings`
- **Skenario**: Error Testing: Uji Anti Overbooking Saat Kuota Penuh (Target Status: 409 Conflict)
- **Body (JSON)**:
```json
{"vehicle_id":1,"slot_id":1,"keluhan":"Mencoba pesan slot yang sudah penuh"}
```
- **Hasil Pengujian**: Status Code: `[ 409 Conflict ]` | Time: `[ 19 ms ]`
- **Catatan Mahasiswa**: Pessimistic Row Locking (lockForUpdate) mencegah race condition dan menolak booking dengan pesan bahwa kuota jam tersebut telah habis.

### Request: `PATCH http://localhost:8000/api/v1/bookings/1/cancel`
- **Skenario**: Pembatalan Booking & Pemulihan Kuota Slot Otomatis (Target Status: 200 OK)
- **Body (JSON)**:
```json
{"reason":"Perubahan jadwal kesibukan"}
```
- **Hasil Pengujian**: Status Code: `[ 200 OK ]` | Time: `[ 20 ms ]`
- **Catatan Mahasiswa**: Booking berhasil dibatalkan (status CANCELLED) dan counter kapasitas terisi pada slot jam terkait otomatis dikurangi 1.


## 5. Zakky Fawwaz Mubarok (NIM: [Placeholder]) — Fokus: Rekam Logbook Servis Mekanik & Riwayat Digital

### Request: `GET http://localhost:8000/api/v1/mechanic/bookings`
- **Skenario**: Lihat Antrean Motor Siap Servis di Pit (Target Status: 200 OK)
- **Body (JSON)**:
```json
(Tidak ada body - Method GET)
```
- **Hasil Pengujian**: Status Code: `[ 200 OK ]` | Time: `[ 17 ms ]`
- **Catatan Mahasiswa**: Mekanik melihat daftar kendaraan berstatus CONFIRMED beserta keluhan pelanggan yang siap dikerjakan.

### Request: `POST http://localhost:8000/api/v1/service-records`
- **Skenario**: Pencatatan Tindakan Servis & Suku Cadang (Target Status: 201 Created)
- **Body (JSON)**:
```json
{"booking_id":1,"odometer_km":10500,"tindakan":"Ganti oli mesin & bersihkan CVT","suku_cadang":[{"nama":"Oli MPX2","qty":1,"keterangan":"Rutin"}],"catatan_mekanik":"Kondisi baik"}
```
- **Hasil Pengujian**: Status Code: `[ 201 Created ]` | Time: `[ 30 ms ]`
- **Catatan Mahasiswa**: Logbook pengerjaan tersimpan dan status booking otomatis diperbarui menjadi COMPLETED.

### Request: `GET http://localhost:8000/api/v1/service-history?no_polisi=G 1234 ABC`
- **Skenario**: Pencarian Riwayat Servis Digital via Plat Nomor (Target Status: 200 OK)
- **Body (JSON)**:
```json
(Tidak ada body - Method GET)
```
- **Hasil Pengujian**: Status Code: `[ 200 OK ]` | Time: `[ 15 ms ]`
- **Catatan Mahasiswa**: Menampilkan seluruh rekam jejak kilometer odometer, tindakan mekanik, dan daftar sparepart yang pernah diganti.
