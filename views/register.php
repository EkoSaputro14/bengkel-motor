<?php $title = 'Daftar — Bengkel Motor API'; $pageScript = 'register'; require __DIR__ . '/partials/header.php'; ?>
<div class="form-card card">
  <h2>Daftar Akun Pelanggan</h2>
  <form id="form-register">
    <label>Nama Lengkap<input type="text" name="nama" required></label>
    <label>Nomor HP<input type="text" name="no_hp" required placeholder="0812xxxxxxx"></label>
    <label>Email<input type="email" name="email" required></label>
    <label>Password<input type="password" name="password" required minlength="8"></label>
    <button class="btn btn-primary" type="submit">Daftar</button>
  </form>
  <p id="register-msg" class="msg"></p>
  <p>Sudah punya akun? <a href="/login">Masuk</a>.</p>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
