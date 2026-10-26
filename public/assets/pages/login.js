document.addEventListener('DOMContentLoaded', () => {
  if (API.token) { window.location.href = '/pelanggan'; return; }
  document.getElementById('form-login').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const res = await API.post('/api/auth/login', {
      email: f.email.value, password: f.password.value,
    });
    if (res.ok) {
      API.save(res.data.token, res.data.user);
      window.location.href = res.data.user.role === 'mekanik' ? '/mekanik'
        : res.data.user.role === 'admin' ? '/admin' : '/pelanggan';
    } else {
      showMsg('login-msg', res.data.error || 'Login gagal.', true);
    }
  });
});
