<?php $title = 'Portal Pelanggan — Bengkel Motor API'; $pageScript = 'pelanggan'; require __DIR__ . '/partials/header.php'; ?>
<h1>Portal Pelanggan</h1>
<p class="hint">Halaman ini memakai REST API dengan token. Masuk terlebih dahulu pada menu <a href="/login">Masuk</a> bila belum.</p>

<section class="card">
  <h2>🏍️ Kendaraan Saya</h2>
  <form id="form-vehicle" class="inline-form">
    <input name="no_polisi" placeholder="No. polisi (B1234XYZ)" required>
    <input name="merk" placeholder="Merk (Honda)" required>
    <input name="model" placeholder="Model (Beat)" required>
    <input name="tahun" type="number" min="1970" max="2027" placeholder="Tahun" required>
    <button class="btn btn-primary" type="submit">Tambah</button>
  </form>
  <div id="vehicle-list"></div>
</section>

<section class="card">
  <h2>📅 Reservasi Slot Servis</h2>
  <div class="inline-form">
    <label>Tanggal <select id="slot-date"></select></label>
    <button id="btn-load-slots" class="btn" type="button">Tampilkan Slot</button>
  </div>
  <div id="slot-list"></div>
  <form id="form-booking" class="inline-form hidden">
    <input type="hidden" name="slot_id" id="booking-slot-id">
    <input name="vehicle_id" type="number" placeholder="ID Kendaraan" required>
    <input name="keluhan" placeholder="Keluhan (opsional)">
    <button class="btn btn-primary" type="submit">Pesan Slot</button>
  </form>
  <div id="booking-result"></div>
</section>

<section class="card">
  <h2>📋 Booking Saya</h2>
  <button id="btn-load-bookings" class="btn" type="button">Muat Booking</button>
  <div id="booking-list"></div>
</section>

<section class="card">
  <h2>🔎 Riwayat Servis (Logbook Digital)</h2>
  <form id="form-history" class="inline-form">
    <input name="no_polisi" placeholder="Cari riwayat per no. polisi" required>
    <button class="btn btn-primary" type="submit">Cari Riwayat</button>
  </form>
  <div id="history-result"></div>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
