# DAFTAR AKUN PENGUJIAN & DATA DEMO (DEMO ACCOUNTS)

Seluruh akun di bawah ini telah disiapkan secara otomatis oleh Database Seeder (`php artisan migrate:fresh --seed`).

---

## 1. Akun Pengguna Berdasarkan Role

| No | Role | Nama Lengkap | Email | Password | No. HP / WhatsApp |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **CUSTOMER** | Eko Saputro | `eko@bengkelmotor.test` | `password123` | `081234567890` |
| 2 | **CUSTOMER** | Siti Rahma | `siti@bengkelmotor.test` | `password123` | `081987654321` |
| 3 | **MECHANIC** | Agus Prasetyo (Mekanik Senior) | `mechanic@bengkelmotor.test` | `password123` | `081233334444` |
| 4 | **ADMIN** | Budi Santoso (Admin Bengkel) | `admin@bengkelmotor.test` | `password123` | `081211112222` |

---

## 2. Data Kendaraan Terdaftar

| ID | Pemilik | Nomor Polisi | Merk | Model | Tahun |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Eko Saputro | **G 1234 ABC** | Honda | Vario 160 ABS | 2023 |
| 2 | Eko Saputro | **G 5678 XYZ** | Yamaha | NMAX 155 Connected | 2022 |
| 3 | Siti Rahma | **B 9999 KKK** | Honda | Beat Deluxe 110 | 2021 |

---

## 3. Data Booking Awal

1. **Booking Riwayat Lampau (`COMPLETED`)**:
   - **Kode Booking**: `BK-20260924-00101`
   - **Motor**: `G 1234 ABC` (Eko Saputro)
   - **Odometer**: 8.450 KM
   - **Tindakan**: Pembersihan filter udara, penyetelan celah katup, ganti oli mesin dan oli gardan.
   - **Suku Cadang**: Oli MPX2 (1x), Oli Gardan (1x), Busi NGK (1x).
   - **Status**: `COMPLETED` (Dapat dilihat di menu Cari Riwayat Plat).

2. **Booking Antrean Hari Ini (`CONFIRMED`)**:
   - **Kode Booking**: `BK-20261004-00201`
   - **Motor**: `G 5678 XYZ` (Eko Saputro)
   - **Jadwal**: Hari Ini • Jam 08:00 WIB
   - **Keluhan**: Tarikan motor gredek di RPM rendah saat akselerasi awal.
   - **Status**: `CONFIRMED` (Tampil di Antrean Servis Mekanik).
