# Panduan Verifikasi Integritas Relasional Basis Data
**Modul:** Database Architecture & Consistency Check  
**Penanggung Jawab:** Feldi Sanjaya (`@FeldiSanJy` / 23215055)  
**Kelompok:** 2 — Pemrograman Web Service  

---

## 1. Latar Belakang & Tujuan
Sistem Informasi Servis Bengkel Motor memiliki 5 entitas inti yang saling berelasi erat:
1. `users` (Pengguna dengan role `CUSTOMER`, `MECHANIC`, `ADMIN`)
2. `vehicles` (Kendaraan milik customer)
3. `service_slots` (Kapasitas dan kuota slot waktu servis harian)
4. `bookings` (Reservasi antrean servis berkala)
5. `service_records` (Catatan hasil diagnosa dan pengerjaan servis mekanik)

Untuk memastikan tidak terjadi anomali integritas data (seperti *orphan records*, kuota slot melebihi kapasitas maksimal, atau kuota bernilai negatif), dibuat perintah diagnostik internal:
```bash
php artisan db:verify-integrity
```

---

## 2. Cakupan Pemeriksaan (Audit Matrix)

| Entitas | Parameter Audit | Kriteria Sukses (Valid) | Keterangan |
|---|---|---|---|
| `users` | Role Distribution | Total akun > 0, role terdaftar valid | Memastikan akun demo Customer, Mekanik, dan Admin tersedia |
| `vehicles` | Foreign Key `user_id` | `whereNotIn('user_id', users.id) == 0` | Mencegah kendaraan tanpa pemilik yang sah |
| `service_slots` | Capacity Overflow | `terisi <= kuota_maksimal` | Mencegah overbooking pada slot waktu servis |
| `bookings` | Foreign Key `vehicle_id` & `slot_id` | Semua FK valid ke entitas induk | Menjamin booking selalu terikat ke unit motor dan jadwal valid |
| `service_records` | Foreign Key `booking_id` | Semua riwayat terikat ke booking | Memastikan rekam servis tidak terisolasi |
| `service_slots` | Non-negative Guard | `terisi >= 0` | Menjamin pembatalan booking tidak menyebabkan kuota minus |

---

## 3. Cara Menjalankan Perintah
Jalankan melalui terminal di direktori `backend/`:
```bash
cd backend
php artisan db:verify-integrity
```

Contoh keluaran saat database sehat:
```text
====================================================
  BENGKEL MOTOR — RELATIONAL DATA INTEGRITY AUDIT   
====================================================
+-----------------+---------+---------------------------+-------------------------------------------+--------+
| Entity          | Records | Check                     | Details                                   | Status |
+-----------------+---------+---------------------------+-------------------------------------------+--------+
| Users           | 8       | Role Distribution         | Cust: 6 | Mech: 1 | Admin: 1              | VALID  |
| Vehicles        | 10      | Foreign Key (user_id)     | Zero orphan records                       | VALID  |
| Service Slots   | 123     | Capacity Consistency      | terisi <= kuota_maksimal across all slots | VALID  |
| Bookings        | 8       | FK (vehicle_id & slot_id) | All FK references intact                  | VALID  |
| Service Records | 7       | FK (booking_id)           | All records tied to valid booking         | VALID  |
| Slot Guard      | 123     | Non-negative Quota Guard  | All slot terisi >= 0                      | VALID  |
+-----------------+---------+---------------------------+-------------------------------------------+--------+

[SUCCESS] All relational integrity checks passed. Database is consistent and clean.
```
Exit code `0` menandakan seluruh relasi valid. Jika ditemukan kegagalan, sistem mengembalikan exit code `1` sehingga dapat digunakan dalam skrip CI/CD atau cronjob berkala.
