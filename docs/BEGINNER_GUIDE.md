# PANDUAN PEMULA LENGKAP (BEGINNER'S GUIDE)
**Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor**

Panduan ini ditulis secara ramah pemula dalam Bahasa Indonesia untuk membantu siapa saja menjalankan aplikasi fullstack **Laravel 12 (Backend REST API) + React TypeScript (Frontend Web & PWA)** dari awal hingga siap digunakan.

---

## 1. Konsep Dasar yang Perlu Diketahui

Sebelum mulai menjalankan kode, mari pahami konsep arsitektur yang digunakan:

1. **Frontend**: Bagian tampilan visual (antarmuka web) yang dilihat dan diklik oleh pengguna di browser. Pada proyek ini dibangun menggunakan **React + TypeScript + Tailwind CSS**.
2. **Backend**: Bagian server logika bisnis yang memproses aturan data, keamanan, dan kuota slot. Pada proyek ini dibangun menggunakan **Laravel 12 REST API**.
3. **Database**: Tempat penyimpanan data permanen (tabel akun pengguna, kendaraan, kuota slot, booking, dan rekam servis).
4. **REST API**: Jembatan komunikasi antara Frontend dan Backend menggunakan protokol HTTP standar. Backend menyajikan data dalam bentuk teks terstruktur berformat **JSON**.
5. **JSON (JavaScript Object Notation)**: Format pertukaran data ringan berbentuk pasangan kunci-nilai (contoh: `{"status": "success", "data": {...}}`).
6. **HTTP Method**:
   - `GET`: Membaca atau mengambil data dari server tanpa mengubah data tersebut.
   - `POST`: Mengirimkan data baru ke server (misal: pendaftaran akun atau reservasi booking).
   - `PUT` / `PATCH`: Memperbarui data yang sudah ada (misal: edit motor atau batalkan booking).
   - `DELETE`: Menghapus data dari server.
7. **HTTP Status Code**:
   - `200 OK`: Permintaan berhasil diproses.
   - `201 Created`: Data baru berhasil dibuat di database.
   - `401 Unauthorized`: Gagal masuk atau token belum disertakan.
   - `403 Forbidden`: Akun Anda tidak berhak mengakses data milik pengguna lain.
   - `404 Not Found`: Halaman atau data yang dicari tidak ada.
   - `409 Conflict`: Terjadi benturan data (misal: slot servis sudah penuh).
   - `422 Unprocessable Content`: Ada data form yang belum diisi atau salah format.
8. **Auto-Confirm Booking**: Sistem secara otomatis mengunci dan menyetujui pemesanan servis motor seketika jika kuota jam tersebut masih ada, tanpa perlu konfirmasi manual dari admin.

---

## 2. Prasyarat Perangkat Lunak (Instalasi Awal)

Pastikan komputer Windows Anda telah terpasang:
1. **PHP 8.2 atau lebih baru** (Bisa melalui Laragon, XAMPP, atau instalasi PHP manual).
2. **Composer** (Alat pengelola paket PHP).
3. **Node.js (Versi 18 atau 20+)** (Termasuk perintah `npm`).
4. **Git** (Opsional, untuk clone repository).

---

## 3. Langkah Demi Langkah Menjalankan Aplikasi

Buka aplikasi **Windows PowerShell** atau **Terminal**, lalu ikuti langkah-langkah berikut:

### Langkah A: Masuk ke Direktori Proyek
```powershell
cd bengkel-motor
```

---

### Langkah B: Menjalankan Backend (Laravel 12)

1. **Masuk ke folder backend**:
   ```powershell
   cd backend
   ```

2. **Pasang dependensi PHP**:
   ```powershell
   composer install
   ```

3. **Buat file konfigurasi `.env`**:
   ```powershell
   copy .env.example .env
   ```

4. **Generate Application Key**:
   ```powershell
   php artisan key:generate
   ```

5. **Inisialisasi Database dan Data Demo Awal**:
   ```powershell
   php artisan migrate:fresh --seed
   ```
   *Perintah ini akan membuat 5 tabel inti dan mengisi data akun demo, jadwal slot servis, serta contoh riwayat servis motor.*

6. **Nyalakan Server Backend**:
   ```powershell
   php artisan serve
   ```
   *Server backend akan aktif di: `http://127.0.0.1:8000`*
   *Biarkan jendela terminal ini tetap terbuka.*

---

### Langkah C: Menjalankan Frontend (React + Vite)

1. **Buka jendela Windows PowerShell / Terminal baru**.
2. **Masuk ke folder frontend**:
   ```powershell
   cd frontend
   ```

3. **Pasang dependensi Node.js**:
   ```powershell
   npm install
   ```

4. **Nyalakan Server Frontend**:
   ```powershell
   npm run dev
   ```
   *Server frontend akan aktif di: `http://localhost:5173`*

5. **Buka browser Anda (Google Chrome / Edge)** dan kunjungi:
   👉 **`http://localhost:5173`**

---

## 4. Cara Mencoba dan Menguji Aplikasi Berdasarkan Role

Aplikasi menyediakan 3 jenis akun demo siap pakai:

### A. Sebagai Pelanggan (Customer)
- **Login**: `eko@bengkelmotor.test` | Password: `password123`
- **Aksi yang bisa dicoba**:
  1. Masuk ke menu **"Motor Saya"** (`/customer/vehicles`) → Tambahkan motor baru Anda (isi Nomor Polisi, Merk, Model, dan Tahun).
  2. Masuk ke menu **"Booking Servis"** (`/customer/booking`) → Pilih tanggal, pilih jam slot servis (lihat indikator sisa kuota), pilih motor Anda, ketik keluhan, lalu klik **"Konfirmasi Booking Instan"**.
  3. Dapatkan **Kode Booking Unik** seketika (Auto-Confirmed).
  4. Lihat status pemesanan di menu **"Riwayat Booking"** (`/customer/bookings`).

### B. Sebagai Mekanik (Mechanic)
- **Login**: `mechanic@bengkelmotor.test` | Password: `password123`
- **Aksi yang bisa dicoba**:
  1. Masuk ke menu **"Antrean Servis"** (`/mechanic`).
  2. Lihat motor pelanggan yang berstatus `CONFIRMED` dan siap dikerjakan.
  3. Klik tombol **"Mulai & Catat Servis"**.
  4. Masukkan angka kilometer **Odometer**, tuliskan **tindakan perbaikan**, tambahkan daftar **suku cadang/oli yang diganti**, lalu klik **"Selesaikan Servis"**.
  5. Status booking otomatis berubah menjadi `COMPLETED` dan tersimpan ke buku riwayat digital.

### C. Sebagai Admin Bengkel (Admin)
- **Login**: `admin@bengkelmotor.test` | Password: `password123`
- **Aksi yang bisa dicoba**:
  1. Masuk ke menu **"Ringkasan"** (`/admin`) → Lihat total pelanggan, kendaraan, dan grafik persentase okupansi kuota hari ini.
  2. Masuk ke menu **"Kelola Slot"** (`/admin/slots`) → Generate jadwal slot massal atau ubah kuota maksimal per jam.
  3. Masuk ke menu **"Pengguna"** (`/admin/users`) → Pantau daftar seluruh akun yang terdaftar.

### D. Pencarian Riwayat Digital Publik (Tanpa Login)
- Di halaman utama (Beranda), masukkan nomor polisi motor (contoh: `G 1234 ABC`), lalu klik **"Cari"**.
- Anda akan melihat lini masa digital rekam servis, riwayat odometer, tindakan mekanik, dan daftar oli/sparepart yang pernah diganti.

---

## 5. Menjalankan Pengujian Otomatis (Automated Testing)

Untuk memastikan seluruh API dan keamanan hak akses berjalan normal tanpa error:
1. Buka terminal di folder `backend`.
2. Jalankan perintah:
   ```powershell
   php artisan test
   ```
3. Seluruh 26 skenario pengujian akan dieksekusi secara otomatis dan menampilkan tanda centang hijau (`PASS`).

---

## 6. Pertanyaan yang Sering Diajukan (FAQ)

- **Q: Mengapa booking langsung terkonfirmasi tanpa ada tombol setuju dari admin?**
  *A: Ini adalah fitur utama Auto-Confirm. Selama kuota pengerjaan di jam tersebut masih tersisa, sistem mempermudah pelanggan mendapatkan kepastian waktu secara instan.*
- **Q: Bagaimana jika kuota di jam tersebut habis?**
  *A: Tombol jam tersebut akan otomatis terkunci (`KUOTA PENUH`) dan server menolak booking dengan kode HTTP 409 Conflict.*
- **Q: Apakah pelanggan bisa mengubah data servis mekanik?**
  *A: Tidak bisa. Backend menerapkan sistem otorisasi ketat (Role Policy) yang hanya mengizinkan akun role MECHANIC untuk mencatat dan mengubah logbook servis.*
