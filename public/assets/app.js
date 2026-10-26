/* Utilitas umum: token, fetch API, render, nav */
const API = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  save(token, user) {
    this.token = token; this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    renderNav();
  },
  clear() {
    this.token = null; this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    renderNav();
  },

  async request(method, path, body) {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
    const res = await fetch(path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = {};
    try { data = await res.json(); } catch (e) { /* respons bukan JSON */ }
    return { status: res.status, ok: res.ok, data };
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body) { return this.request('PUT', path, body); },
  del(path) { return this.request('DELETE', path); },
};

function requireLogin() {
  if (!API.token) {
    alert('Silakan masuk terlebih dahulu.');
    window.location.href = '/login';
    return false;
  }
  return true;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderNav() {
  const el = document.getElementById('nav-user');
  const btn = document.getElementById('btn-logout');
  if (API.token && API.user) {
    el.textContent = API.user.nama + ' (' + API.user.role + ')';
    btn.classList.remove('hidden');
  } else {
    el.textContent = '';
    btn.classList.add('hidden');
  }
}

function showMsg(id, text, isError) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'msg ' + (isError ? 'err' : 'ok');
}

const STATUS_LABEL = {
  booked: 'Dipesan', checked_in: 'Datang', in_progress: 'Dikerjakan',
  completed: 'Selesai', cancelled: 'Dibatalkan',
};
const STATUS_ACTION = {
  booked: [['checked_in', 'Datang']],
  checked_in: [['in_progress', 'Mulai Kerja']],
  in_progress: [['completed', 'Selesai']],
};

document.addEventListener('DOMContentLoaded', renderNav);
document.addEventListener('click', e => {
  if (e.target && e.target.id === 'btn-logout') {
    API.post('/api/auth/logout').finally(() => { API.clear(); window.location.href = '/'; });
  }
});

function fmtDateTime(tanggal, jam) {
  return esc(tanggal) + ' ' + esc((jam || '').slice(0, 5));
}
