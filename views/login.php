<?php $title = 'Masuk — Bengkel Motor API'; $pageScript = 'login'; require __DIR__ . '/partials/header.php'; ?>
<div class="form-card card">
  <h2>Masuk</h2>
  <form id="form-login">
    <label>Email<input type="email" name="email" required></label>
    <label>Password<input type="password" name="password" required minlength="8"></label>
    <button class="btn btn-primary" type="submit">Masuk</button>
  </form>
  <p id="login-msg" class="msg"></p>
  <p>Belum punya akun? <a href="/register">Daftar di sini</a>.</p>
</div>
<?php require __DIR__ . '/partials/footer.php'; ?>
