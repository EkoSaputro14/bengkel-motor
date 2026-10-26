-- =========================================================
-- Skema MySQL - Rancang Bangun RESTful API Layanan Penjadwalan
-- Servis dan Manajemen Riwayat Perawatan Berkala Bengkel Motor
-- =========================================================
CREATE DATABASE IF NOT EXISTS bengkel_api CHARACTER SET utf8mb4;
USE bengkel_api;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,          -- password_hash()
    role ENUM('pelanggan','mekanik','admin') NOT NULL DEFAULT 'pelanggan',
    api_token VARCHAR(80) NULL UNIQUE,       -- token autentikasi (pengganti Sanctum)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    no_polisi VARCHAR(15) NOT NULL UNIQUE,   -- kunci digital service logbook
    merk VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    tahun YEAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    kuota_maksimal INT NOT NULL DEFAULT 5,
    terisi INT NOT NULL DEFAULT 0,
    UNIQUE KEY uq_slot (tanggal, jam_mulai)  -- cegah slot ganda (mitigasi overbooking)
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    slot_id INT NOT NULL,
    keluhan TEXT NULL,
    status ENUM('booked','checked_in','in_progress','completed','cancelled') NOT NULL DEFAULT 'booked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES service_slots(id)
);

CREATE TABLE IF NOT EXISTS service_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,          -- satu record per booking
    odometer_km INT NOT NULL,
    tindakan TEXT NOT NULL,                  -- jenis perawatan/perbaikan
    suku_cadang TEXT NULL,                   -- komponen yang diganti
    catatan_mekanik TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Data contoh slot (admin bisa menambah lewat POST /api/slots)
INSERT INTO service_slots (tanggal, jam_mulai, kuota_maksimal) VALUES
 (CURDATE(), '08:00:00', 4), (CURDATE(), '10:00:00', 4), (CURDATE(), '13:00:00', 3),
 (CURDATE() + INTERVAL 1 DAY, '08:00:00', 4), (CURDATE() + INTERVAL 1 DAY, '10:00:00', 4);

-- Akun contoh (password: password123)
INSERT INTO users (nama, no_hp, email, password, role) VALUES
 ('Admin Bengkel', '081200000001', 'admin@bengkel.test', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFx4IKBxJQzFjkuFVdJFrVkueBT8Cw0S', 'admin'),
 ('Mekanik Andi', '081200000002', 'mekanik@bengkel.test', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFx4IKBxJQzFjkuFVdJFrVkueBT8Cw0S', 'mekanik'),
 ('Budi Pelanggan', '081200000003', 'budi@mail.test', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHeFx4IKBxJQzFjkuFVdJFrVkueBT8Cw0S', 'pelanggan');
