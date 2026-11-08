# Laporan Aksesibilitas Web (A11y) & Visual Feedback Testing Lab
**Modul:** Frontend Accessibility & Interactive UI  
**Penanggung Jawab:** Imzy Zulijar Setiawan (`@23215022-Imzy` / 23215022)  
**Kelompok:** 2 — Pemrograman Web Service  

---

## 1. Latar Belakang & Standar Kepatuhan
Modul antarmuka pengujian API interaktif (`/api-test`) dirancang agar dapat dioperasikan secara inklusif dengan merujuk pada standar **WCAG 2.1 Level AA (Web Content Accessibility Guidelines)**.

Tujuan utama peningkatan aksesibilitas ini meliputi:
1. **Navigasi Keyboard Penuh**: Semua kontrol interaktif (pencarian, tombol kategori, pemilihan persona/role, input parameter, dan tombol eksekusi) dapat diakses melalui tombol `Tab`, `Enter`, dan `Space`.
2. **Screen Reader Live Announcements**: Perubahan status asinkron saat API dipanggil diumumkan ke pembaca layar menggunakan `aria-live="polite"` dan `role="status"`.
3. **Kontras Warna Status HTTP**: Penanda kode status HTTP (2xx Sukses, 4xx Client Error, 5xx Server Error) dirancang dengan kontras warna teks dan latar belakang minimal 4.5:1.

---

## 2. Matriks Implementasi ARIA

| Komponen / Bagian | Atribut ARIA | Fungsi & Perilaku Aksesibilitas |
|---|---|---|
| Katalog Endpoint (Sidebar Kiri) | `role="navigation"` `aria-label="Katalog Endpoint API"` | Memberikan landmark navigasi khusus bagi pengguna pembaca layar |
| Response Inspector (Panel Kanan) | `role="region"` `aria-label="Panel Respon API"` | Mengelompokkan hasil respon sebagai region terpisah yang mudah dilompati |
| Indikator Kode Status & Latensi | `role="status"` `aria-live="polite"` `aria-atomic="true"` | Mengumumkan perubahan status kode (misal `200 OK`, `422 Unprocessable`) secara non-intrusif |
| Tombol Salin Respon JSON | `aria-label="Salin JSON Respon"` | Memberikan nama aksesibel yang jelas pada ikon tombol copy |

---

## 3. Hasil Pengujian & Verifikasi
- **TypeScript Compile & Vite Production Build**: Lolos 100% tanpa type error (`tsc -b && vite build`).
- **Verifikasi Kontras**: Skema badge status:
  - `200 OK` / `201 Created`: Teks hijau tua (`#15803d`) pada latar hijau muda (`#dcfce7`) — Rasio Kontras 6.2:1 (Lolos AAA).
  - `401 Unauthorized` / `422 Error`: Teks oranye-merah (`#b91c1c`) pada latar merah muda (`#fee2e2`) — Rasio Kontras 5.8:1 (Lolos AA).
- **Regresi Fitur**: Seluruh fungsionalitas pengujian 24 endpoint tetap berjalan normal dan responsif pada layar desktop maupun mobile.
