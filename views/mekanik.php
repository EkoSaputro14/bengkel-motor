<?php $title = 'Layar Mekanik — Bengkel Motor API'; $pageScript = 'mekanik'; require __DIR__ . '/partials/header.php'; ?>
<h1>Layar Mekanik / Teknisi</h1>
<p class="hint">Masuk sebagai mekanik (mekanik@bengkel.test) untuk mencatat pengerjaan servis.</p>

<section class="card">
  <h2>🗂️ Antrean Booking</h2>
  <button id="btn-load-queue" class="btn" type="button">Muat Antrean</button>
  <div id="queue-list"></div>
</section>

<section class="card">
  <h2>✏️ Catat Tindakan Servis</h2>
  <form id="form-record" class="inline-form">
    <input name="booking_id" type="number" placeholder="ID Booking" required>
    <input name="odometer_km" type="number" placeholder="Odometer (km)" required>
    <input name="tindakan" placeholder="Tindakan (ganti oli, tune-up...)" required>
    <input name="suku_cadang" placeholder="Suku cadang diganti (opsional)">
    <input name="catatan_mekanik" placeholder="Catatan mekanik (opsional)">
    <button class="btn btn-primary" type="submit">Simpan Catatan</button>
  </form>
  <div id="record-result"></div>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
