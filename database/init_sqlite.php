<?php
/**
 * Inisialisasi skema SQLite saat pertama kali dijalankan.
 * Skema identik dengan database/schema.sql (versi MySQL).
 */
$pdo = App\Core\Database::pdo();

$pdo->exec('
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT "pelanggan" CHECK (role IN ("pelanggan","mekanik","admin")),
    api_token TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    no_polisi TEXT NOT NULL UNIQUE,
    merk TEXT NOT NULL,
    model TEXT NOT NULL,
    tahun INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS service_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tanggal TEXT NOT NULL,
    jam_mulai TEXT NOT NULL,
    kuota_maksimal INTEGER NOT NULL DEFAULT 5,
    terisi INTEGER NOT NULL DEFAULT 0,
    UNIQUE (tanggal, jam_mulai)
);
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL,
    slot_id INTEGER NOT NULL,
    keluhan TEXT,
    status TEXT NOT NULL DEFAULT "booked" CHECK (status IN ("booked","checked_in","in_progress","completed","cancelled")),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES service_slots(id)
);
CREATE TABLE IF NOT EXISTS service_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL UNIQUE,
    odometer_km INTEGER NOT NULL,
    tindakan TEXT NOT NULL,
    suku_cadang TEXT,
    catatan_mekanik TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
');

// Seed: slot contoh (hari ini & besok) + akun contoh (password: password123)
$hash = password_hash('password123', PASSWORD_DEFAULT);
$today = date('Y-m-d');
$tomorrow = date('Y-m-d', strtotime('+1 day'));

$stmt = $pdo->prepare('SELECT COUNT(*) FROM users');
$stmt->execute();
if (!$stmt->fetchColumn()) {
    $ins = $pdo->prepare('INSERT INTO users (nama, no_hp, email, password, role) VALUES (?,?,?,?,?)');
    $ins->execute(['Admin Bengkel', '081200000001', 'admin@bengkel.test', $hash, 'admin']);
    $ins->execute(['Mekanik Andi', '081200000002', 'mekanik@bengkel.test', $hash, 'mekanik']);
    $ins->execute(['Budi Pelanggan', '081200000003', 'budi@mail.test', $hash, 'pelanggan']);
}

$stmt = $pdo->prepare('SELECT COUNT(*) FROM service_slots');
$stmt->execute();
if (!$stmt->fetchColumn()) {
    $ins = $pdo->prepare('INSERT INTO service_slots (tanggal, jam_mulai, kuota_maksimal) VALUES (?,?,?)');
    foreach ([$today, $tomorrow] as $tgl) {
        foreach ([['08:00:00', 4], ['10:00:00', 4], ['13:00:00', 3]] as [$jam, $kuota]) {
            $ins->execute([$tgl, $jam, $kuota]);
        }
    }
}
