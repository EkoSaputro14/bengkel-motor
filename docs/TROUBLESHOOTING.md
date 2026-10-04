# PANDUAN PENYELESAIAN MASALAH (TROUBLESHOOTING GUIDE)

---

## 1. Masalah Umum & Solusi Cepat

### A. Error: `Target class [RoleMiddleware] does not exist` atau Middleware Error
- **Penyebab**: Alias middleware belum terdaftar di `bootstrap/app.php`.
- **Solusi**: Pastikan `bootstrap/app.php` mendaftarkan middleware alias:
  ```php
  $middleware->alias(['role' => \App\Http\Middleware\RoleMiddleware::class]);
  ```

### B. Error: `SQLSTATE[HY000]: General error: 5 database is locked` (SQLite)
- **Penyebab**: Terjadi akses bersamaan saat transaksi atau file `.sqlite` sedang dibuka aplikasi database viewer.
- **Solusi**: Tutup SQLite viewer eksternal, atau pada production alihkan database ke MySQL 8.0 dengan mengatur file `.env`:
  ```env
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=bengkel_motor
  DB_USERNAME=root
  DB_PASSWORD=
  ```

### C. Error: `401 Unauthorized` di Frontend padahal sudah login
- **Penyebab**: Token di `localStorage` kadaluarsa atau database di-refresh via seeder baru.
- **Solusi**: Lakukan logout lalu login kembali menggunakan akun demo untuk memperbarui Bearer token aktif.

### D. Error: `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Penyebab**: Port frontend belum diizinkan oleh backend Laravel.
- **Solusi**: Pastikan `config/cors.php` atau `frontend/vite.config.ts` mengaktifkan reverse proxy `/api` ke `http://127.0.0.1:8000`.

### E. Error: Port 8000 atau Port 5173 Sedang Digunakan (Port in Use)
- **Solusi**:
  - Untuk Laravel: Jalankan pada port alternatif: `php artisan serve --port=8080`.
  - Untuk Vite: Vite akan otomatis memilih port berikutnya (contoh: 5174).
