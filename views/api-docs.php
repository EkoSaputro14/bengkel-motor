<?php $title = 'Dokumentasi API — Bengkel Motor API'; $pageScript = 'home'; require __DIR__ . '/partials/header.php'; ?>
<h1>Dokumentasi Endpoint API</h1>
<p class="hint">Semua respons berformat JSON. Autentikasi memakai header <code>Authorization: Bearer &lt;token&gt;</code> (diperoleh dari Register/Login). Kode status HTTP standar dipakai: 200 OK, 201 Created, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Validation Error.</p>

<section class="card"><h2>🔐 Autentikasi</h2>
<table class="table">
<tr><th>Metode</th><th>Endpoint</th><th>Body</th><th>Deskripsi</th></tr>
<tr><td>POST</td><td>/api/auth/register</td><td>nama, no_hp, email, password</td><td>Registrasi akun (default role pelanggan), mengembalikan token</td></tr>
<tr><td>POST</td><td>/api/auth/login</td><td>email, password</td><td>Login, mengembalikan token</td></tr>
<tr><td>GET</td><td>/api/auth/me</td><td>—</td><td>Profil pengguna yang sedang login <em>(token)</em></td></tr>
<tr><td>POST</td><td>/api/auth/logout</td><td>—</td><td>Cabut token <em>(token)</em></td></tr>
</table></section>

<section class="card"><h2>🏍️ Kendaraan</h2>
<table class="table">
<tr><th>Metode</th><th>Endpoint</th><th>Body</th><th>Deskripsi</th></tr>
<tr><td>GET</td><td>/api/vehicles</td><td>—</td><td>Daftar kendaraan milik pelanggan <em>(token)</em></td></tr>
<tr><td>POST</td><td>/api/vehicles</td><td>no_polisi, merk, model, tahun</td><td>Tambah kendaraan <em>(token)</em></td></tr>
<tr><td>PUT</td><td>/api/vehicles/{id}</td><td>merk, model, tahun</td><td>Ubah kendaraan <em>(token, pemilik)</em></td></tr>
<tr><td>DELETE</td><td>/api/vehicles/{id}</td><td>—</td><td>Hapus kendaraan <em>(token, pemilik)</em></td></tr>
</table></section>

<section class="card"><h2>📅 Slot &amp; Reservasi</h2>
<table class="table">
<tr><th>Metode</th><th>Endpoint</th><th>Body / Query</th><th>Deskripsi</th></tr>
<tr><td>GET</td><td>/api/slots?tanggal=YYYY-MM-DD</td><td>—</td><td>Daftar slot &amp; sisa kuota pada tanggal</td></tr>
<tr><td>GET</td><td>/api/slots/available</td><td>—</td><td>Tanggal-tanggal 14 hari ke depan yang masih tersedia</td></tr>
<tr><td>POST</td><td>/api/slots</td><td>tanggal, jam_mulai, kuota_maksimal</td><td>Buat slot <em>(admin)</em></td></tr>
<tr><td>GET</td><td>/api/bookings</td><td>—</td><td>Daftar booking <em>(token; admin = semua)</em></td></tr>
<tr><td>POST</td><td>/api/bookings</td><td>vehicle_id, slot_id, keluhan</td><td>Reservasi slot <em>(token, pemilik kendaraan)</em></td></tr>
<tr><td>GET</td><td>/api/bookings/{id}</td><td>—</td><td>Detail booking <em>(token)</em></td></tr>
<tr><td>DELETE</td><td>/api/bookings/{id}</td><td>—</td><td>Batalkan booking; kuota dikembalikan <em>(token, pemilik)</em></td></tr>
<tr><td>PUT</td><td>/api/bookings/{id}/status</td><td>status: booked|checked_in|in_progress|completed|cancelled</td><td>Ubah status pengerjaan <em>(mekanik/admin)</em></td></tr>
</table></section>

<section class="card"><h2>🔧 Logbook Servis</h2>
<table class="table">
<tr><th>Metode</th><th>Endpoint</th><th>Body / Query</th><th>Deskripsi</th></tr>
<tr><td>POST</td><td>/api/service-records</td><td>booking_id, odometer_km, tindakan, suku_cadang, catatan_mekanik</td><td>Catat tindakan &amp; suku cadang; booking otomatis <em>completed</em> <em>(mekanik/admin)</em></td></tr>
<tr><td>GET</td><td>/api/history?no_polisi=...</td><td>—</td><td>Riwayat servis per nomor polisi <em>(token)</em></td></tr>
</table></section>

<section class="card"><h2>🧾 Contoh Respons 409 (kuota penuh)</h2>
<pre>{
  "error": "Kuota slot pada jam tersebut sudah penuh. Silakan pilih jam lain.",
  "detail": []
}</pre></section>
<?php require __DIR__ . '/partials/footer.php'; ?>
