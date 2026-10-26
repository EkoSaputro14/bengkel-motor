document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-register').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const res = await API.post('/api/auth/register', {
      nama: f.nama.value, no_hp: f.no_hp.value,
      email: f.email.value, password: f.password.value,
    });
    if (res.status === 201) {
      API.save(res.data.token, res.data.user);
      window.location.href = '/pelanggan';
    } else {
      const d = res.data.detail || {};
      showMsg('register-msg', res.data.error + ' ' + Object.values(d).join(' '), true);
    }
  });
});
