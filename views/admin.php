<?php $title = 'Panel Admin — Bengkel Motor API'; $pageScript = 'admin'; require __DIR__ . '/partials/header.php'; ?>
<h1>Panel Admin Bengkel</h1>
<p class="hint">Masuk sebagai admin (admin@bengkel.test).</p>

<section class="card">
  <h2>📅 Kelola Kuota Slot Harian</h2>
  <form id="form-slot" class="inline-form">
    <input name="tanggal" type="date" required>
    <input name="jam_mulai" type="time" required>
    <input name="kuota_maksimal" type="number" min="1" placeholder="Kuota" required>
    <button class="btn btn-primary" type="submit">Buat Slot</button>
  </form>
  <div class="inline-form">
    <input id="slot-view-date" type="date">
    <button id="btn-load-slots-admin" class="btn" type="button">Lihat Slot</button>
  </div>
  <div id="slot-list-admin"></div>
</section>

<section class="card">
  <h2>🗂️ Semua Reservasi</h2>
  <button id="btn-load-bookings-admin" class="btn" type="button">Muat Semua Booking</button>
  <div id="booking-list-admin"></div>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
