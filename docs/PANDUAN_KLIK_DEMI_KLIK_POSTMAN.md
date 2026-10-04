# PANDUAN PRAKTIKUM KLIK-DEMI-KLIK PENGUJIAN API DENGAN POSTMAN (WINDOWS)
## Tutorial Visual & Langkah Teknis untuk Pemula — Kelompok 2 (Sistem Informasi Bengkel Motor)

**Penulis:** Eko Saputro (NIM: 23215050) & Tim Kelompok 2  
**Mata Kuliah:** Pemrograman Web Service  
**Dosen Pengampu:** Zaenul Arif, S.Kom., M.Kom  
**Target Pembaca:** Pemula yang baru pertama kali menggunakan Postman Desktop di Windows.

---

## 7 LANGKAH EMAS: CARA MENGUJI SETIAP REQUEST DI POSTMAN

### Langkah 1: Buka Tab Request Baru
1. Buka aplikasi **Postman** dari Desktop Windows atau Start Menu.
2. Klik tombol **"+" (New Tab)** di bagian tab atas layar kerja Postman.

### Langkah 2: Pilih Method HTTP (GET / POST / PATCH)
1. Di samping kiri kolom URL, klik dropdown yang bertuliskan **`GET`**.
2. Pilih method sesuai petunjuk tugas:
   - Pilih **`POST`** jika ingin mendaftar akun, login, menambah motor, membuat booking, atau mencatat logbook.
   - Pilih **`GET`** jika ingin mengambil data (melihat motor, melihat slot, cek riwayat).
   - Pilih **`PATCH`** jika ingin membatalkan booking.

### Langkah 3: Masukkan Alamat URL Endpoint
1. Klik pada kolom teks bertuliskan **"Enter URL or paste text"**.
2. Masukkan alamat URL API:
   - Jika memakai server lokal: `http://127.0.0.1:8000/api/v1/...`
   - Jika memakai internet publik: `https://bengkel.ekohomelab.online/api/v1/...`

### Langkah 4: Pasang Header Wajib (Accept & Content-Type)
1. Klik tab **"Headers"** (terletak di bawah kolom URL).
2. Di baris pertama:
   - Klik kolom **Key** -> ketik: `Accept`
   - Klik kolom **Value** -> ketik: `application/json`
3. Di baris kedua (wajib jika mengirim data POST/PATCH):
   - Klik kolom **Key** -> ketik: `Content-Type`
   - Klik kolom **Value** -> ketik: `application/json`

### Langkah 5: Mengisi Body JSON (Khusus Request POST / PATCH)
1. Klik tab **"Body"** (di sebelah tab Headers).
2. Klik bulatan radio button bertuliskan **"raw"**.
3. Di ujung kanan tulisan *raw*, klik dropdown yang bertuliskan *Text*, lalu ubah menjadi **"JSON"**.
4. Klik di area kotak kosong editor di bawahnya, lalu ketik atau tempel (*Paste*) format JSON yang diminta.

### Langkah 6: Memasang Bearer Token (Khusus Request yang Butuh Login)
1. Jalankan request Login terlebih dahulu.
2. Pada panel response bawah, blok string token di dalam `"token": "1|abc..."` lalu tekan `Ctrl + C`.
3. Buka request yang ingin diuji (misal: POST `/vehicles` atau POST `/bookings`).
4. Klik tab **"Authorization"** (di samping kiri tab Headers).
5. Klik dropdown **Type** (default bertuliskan *Inherit auth from parent* atau *No Auth*), lalu klik pilihan **"Bearer Token"**.
6. Klik pada kolom **Token** di sebelah kanan, lalu tekan `Ctrl + V` untuk menempelkan token Anda.

### Langkah 7: Klik Tombol SEND & Catat Hasilnya
1. Klik tombol biru besar bertuliskan **"Send"** di pojok kanan atas.
2. Amati panel respon di bagian bawah:
   - **Status Code**: Lihat angka status di kanan bawah (contoh: `201 Created` warna hijau, `200 OK` hijau, atau `422 Unprocessable` merah).
   - **Response Time**: Lihat durasi waktu proses (contoh: `25 ms`).
   - **Response Body**: Pastikan tab **Pretty** dan format **JSON** aktif untuk membaca struktur data hasil respons server.
3. Salin angka **Status**, **Time**, dan amati pesannya untuk mengisi formulir Lembar Kerja Praktikum.

---

## PANDUAN PRAKTEK KLIK-DEMI-KLIK 15 REQUEST (PER MAHASISWA)

### MAHASISWA 1: INTAN KOMALASARI — Autentikasi Pelanggan & Validasi

#### Request 1: Registrasi Akun Pelanggan Baru
1. Buat tab baru di Postman.
2. Ubah method dropdown menjadi **`POST`**.
3. Ketik URL: `http://127.0.0.1:8000/api/v1/auth/register`
4. Buka tab **Body** -> klik **raw** -> pilih **JSON**.
5. Paste isi JSON berikut:
```json
{
  "nama": "Intan Komalasari",
  "email": "intan.pelanggan@bengkelmotor.test",
  "no_hp": "081234567891",
  "password": "password123",
  "role": "CUSTOMER"
}
```
6. Klik tombol **Send**.
7. **Hasil Pengamatan:** Status `201 Created`, Waktu `~25 ms`. Respon berisi data user dan token Sanctum.

#### Request 2: Login Pelanggan & Ambil Token
1. Buat tab baru di Postman.
2. Ubah method menjadi **`POST`**.
3. Ketik URL: `http://127.0.0.1:8000/api/v1/auth/login`
4. Buka tab **Body** -> klik **raw** -> pilih **JSON**.
5. Paste JSON berikut:
```json
{
  "email": "intan.pelanggan@bengkelmotor.test",
  "password": "password123"
}
```
6. Klik tombol **Send**.
7. **Hasil Pengamatan:** Status `200 OK`, Waktu `~18 ms`. Blok dan copy string pada `"token": "..."` untuk dipakai pada request selanjutnya.

#### Request 3: Error Testing — Password Kurang dari 6 Karakter
1. Buat tab baru di Postman.
2. Ubah method menjadi **`POST`**.
3. Ketik URL: `http://127.0.0.1:8000/api/v1/auth/register`
4. Buka tab **Body** -> klik **raw** -> pilih **JSON**.
5. Paste JSON yang salah ini:
```json
{
  "nama": "Intan Error",
  "email": "err@gmail.com",
  "no_hp": "081299998888",
  "password": "123",
  "role": "CUSTOMER"
}
```
6. Klik tombol **Send**.
7. **Hasil Pengamatan:** Status `422 Unprocessable Content`, Waktu `~12 ms`. Server menolak registrasi dan memberitahu bahwa field password minimal 6 karakter.

---

### MAHASISWA 2: FELDI SANJAYA — Manajemen Motor & Hak Akses

#### Request 4: Daftarkan Sepeda Motor Baru
1. Buat tab baru di Postman, pilih method **`POST`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/vehicles`
3. Buka tab **Authorization** -> pilih Type **Bearer Token** -> paste Token Pelanggan Anda.
4. Buka tab **Body** -> klik **raw** -> pilih **JSON**.
5. Paste JSON berikut:
```json
{
  "no_polisi": "G 2222 KL",
  "merk": "Yamaha",
  "model": "Aerox 155 Connected",
  "tahun": 2023
}
```
6. Klik tombol **Send**.
7. **Hasil Pengamatan:** Status `201 Created`, Waktu `~22 ms`. Motor berhasil tersimpan dengan `id: 1` dan terikat ke user Anda.

#### Request 5: Ambil Daftar Motor Milik Sendiri
1. Buat tab baru di Postman, pilih method **`GET`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/vehicles`
3. Buka tab **Authorization** -> pilih Type **Bearer Token** -> paste Token Pelanggan Anda.
4. Tab Body biarkan kosong (*none*).
5. Klik tombol **Send**.
6. **Hasil Pengamatan:** Status `200 OK`, Waktu `~15 ms`. Server menampilkan daftar sepeda motor milik Anda dalam array data.

#### Request 6: Error Testing — Akses Motor Milik Orang Lain (Ownership Policy)
1. Buat tab baru di Postman, pilih method **`GET`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/vehicles/999`
3. Buka tab **Authorization** -> pilih Type **Bearer Token** -> paste Token Pelanggan Anda.
4. Klik tombol **Send**.
5. **Hasil Pengamatan:** Status `403 Forbidden` / `404 Not Found`, Waktu `~14 ms`. Sistem menolak akses karena data bukan milik Anda.

---

### MAHASISWA 3: IMZY ZULIJAR SETIAWAN — Cek Slot Servis & Validasi

#### Request 7: Cek Ketersediaan Slot Real-Time per Tanggal
1. Buat tab baru di Postman, pilih method **`GET`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/service-slots?tanggal=2026-10-06`
3. Tab Body biarkan kosong (*none*).
4. Klik tombol **Send**.
5. **Hasil Pengamatan:** Status `200 OK`, Waktu `~18 ms`. Menampilkan jam operasional (08:00 - 16:00), kapasitas terisi, sisa kuota, dan flag `is_available: true`.

#### Request 8: Cek Kuota Hari Ini secara Safe & Idempotent
1. Buat tab baru di Postman, pilih method **`GET`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/service-slots`
3. Klik tombol **Send**.
4. **Hasil Pengamatan:** Status `200 OK`, Waktu `~16 ms`. Menampilkan kuota tanggal hari ini tanpa mengubah data apapun di database.

#### Request 9: Error Testing — Parameter Tanggal Tidak Valid
1. Buat tab baru di Postman, pilih method **`GET`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/service-slots?tanggal=besok-pagi`
3. Klik tombol **Send**.
4. **Hasil Pengamatan:** Status `422 Unprocessable Content`, Waktu `~11 ms`. Server memberi pesan error bahwa format tanggal harus `YYYY-MM-DD`.

---

### MAHASISWA 4: EKO SAPUTRO (23215050) — Booking Servis & Concurrency Lock

#### Request 10: Buat Booking Servis Instan (Auto-Confirm)
1. Buat tab baru di Postman, pilih method **`POST`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/bookings`
3. Buka tab **Authorization** -> pilih Type **Bearer Token** -> paste Token Pelanggan Anda.
4. Buka tab **Body** -> klik **raw** -> pilih **JSON**.
5. Paste JSON berikut:
```json
{
  "vehicle_id": 1,
  "slot_id": 1,
  "keluhan": "Ganti oli mesin MPX2 dan setel rantai roda"
}
```
6. Klik tombol **Send**.
7. **Hasil Pengamatan:** Status `201 Created`, Waktu `~28 ms`. Terbit kode booking unik (misal: `BK-20261004-A1B2`) dengan status langsung `CONFIRMED`.

#### Request 11: Error Testing — Uji Anti Overbooking Saat Slot Penuh
1. Tetap pada tab booking di atas atau buka tab baru dengan data slot yang sama saat kuotanya sudah habis.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/bookings`
3. Buka tab **Authorization** -> pastikan Bearer Token aktif.
4. Buka tab **Body** -> JSON -> kirim request lagi ke slot yang sudah penuh.
5. Klik tombol **Send**.
6. **Hasil Pengamatan:** Status `409 Conflict`, Waktu `~19 ms`. Backend menolak transaksi melalui *Pessimistic Row Lock* dan mengembalikan pesan bahwa kuota slot telah habis.

#### Request 12: Pembatalan Booking & Pemulihan Kuota Otomatis
1. Buat tab baru di Postman, pilih method **`PATCH`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/bookings/1/cancel`
3. Buka tab **Authorization** -> pilih Type **Bearer Token** -> paste Token Pelanggan Anda.
4. Buka tab **Body** -> klik **raw** -> pilih **JSON**.
5. Paste JSON alasan pembatalan:
```json
{
  "reason": "Perubahan rencana jadwal kesibukan pelanggan"
}
```
6. Klik tombol **Send**.
7. **Hasil Pengamatan:** Status `200 OK`, Waktu `~20 ms`. Status booking berubah jadi `CANCELLED` dan counter kuota terisi pada slot jam terkait otomatis berkurang 1.

---

### MAHASISWA 5: ZAKKY FAWWAZ MUBAROK — Logbook Mekanik & Riwayat Digital

#### Request 13: Lihat Antrean Motor di Pit Servis
1. Lakukan login terlebih dahulu dengan akun mekanik:
   - POST `/auth/login` dengan email `mechanic@bengkelmotor.test` dan password `password123`.
   - Copy token mekanik yang dihasilkan.
2. Buat tab baru di Postman, pilih method **`GET`**.
3. Masukkan URL: `http://127.0.0.1:8000/api/v1/mechanic/bookings`
4. Buka tab **Authorization** -> Type **Bearer Token** -> paste **Token Mekanik**.
5. Klik tombol **Send**.
6. **Hasil Pengamatan:** Status `200 OK`, Waktu `~17 ms`. Menampilkan daftar kendaraan berstatus `CONFIRMED` yang siap diservis di pit bengkel.

#### Request 14: Catat Tindakan Servis & Suku Cadang (Logbook Selesai)
1. Buat tab baru di Postman, pilih method **`POST`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/service-records`
3. Buka tab **Authorization** -> Type **Bearer Token** -> paste **Token Mekanik**.
4. Buka tab **Body** -> klik **raw** -> pilih **JSON**.
5. Paste JSON catatan servis berikut:
```json
{
  "booking_id": 1,
  "odometer_km": 10500,
  "tindakan": "Ganti oli mesin MPX2, busi racing, dan pembersihan CVT",
  "suku_cadang": [
    { "nama": "Oli MPX2 0.8L", "qty": 1, "keterangan": "Rutin" },
    { "nama": "Busi CPR9EA", "qty": 1, "keterangan": "Penggantian" }
  ],
  "catatan_mekanik": "Kondisi mesin prima, tekanan angin ban disesuaikan"
}
```
6. Klik tombol **Send**.
7. **Hasil Pengamatan:** Status `201 Created`, Waktu `~30 ms`. Logbook tersimpan dan status booking otomatis berubah menjadi `COMPLETED`.

#### Request 15: Pelacakan Riwayat Servis Digital via Plat Nomor
1. Buat tab baru di Postman, pilih method **`GET`**.
2. Masukkan URL: `http://127.0.0.1:8000/api/v1/service-history?no_polisi=G 1234 ABC`
3. Tab Body biarkan kosong (*none*).
4. Klik tombol **Send**.
5. **Hasil Pengamatan:** Status `200 OK`, Waktu `~15 ms`. Menampilkan riwayat rekam jejak kilometer odometer, tanggal servis, tindakan mekanik, dan daftar sparepart yang pernah diganti secara transparan.
