<?php $title = 'Bengkel Motor API — Beranda'; $pageScript = 'home'; require __DIR__ . '/partials/header.php'; ?>
<section class="hero">
  <h1>Penjadwalan Servis &amp; Logbook Digital Bengkel Motor</h1>
  <p>Reservasi slot servis harian tanpa antrean, dan riwayat perawatan kendaraan berbasis <strong>nomor polisi</strong> — tidak lagi dicatat di kertas nota manual.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="/pelanggan">Pesan Slot Servis</a>
    <a class="btn" href="/mekanik">Layar Mekanik</a>
    <a class="btn" href="/api-docs">Dokumentasi API</a>
  </div>
</section>

<section class="grid-3">
  <div class="card"><h3>🎫 Pelanggan</h3><p>Daftar akun, kelola kendaraan, lihat kuota slot harian, reservasi &amp; batalkan booking, cek riwayat servis per nomor polisi.</p></div>
  <div class="card"><h3>🔧 Mekanik</h3><p>Layar tablet bengkel: daftar antrean, ubah status pengerjaan, catat tindakan servis dan suku cadang yang diganti.</p></div>
  <div class="card"><h3>🛡️ Admin</h3><p>Kelola kuota slot harian, pantau seluruh reservasi, dan awasi operasional bengkel.</p></div>
</section>

<section class="card">
  <h3>Akun contoh (password: <code>password123</code>)</h3>
  <table class="table">
    <tr><th>Peran</th><th>Email</th></tr>
    <tr><td>Admin</td><td>admin@bengkel.test</td></tr>
    <tr><td>Mekanik</td><td>mekanik@bengkel.test</td></tr>
    <tr><td>Pelanggan</td><td>budi@mail.test</td></tr>
  </table>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
