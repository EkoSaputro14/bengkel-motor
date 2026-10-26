document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;
  if (API.user && API.user.role === 'pelanggan') { window.location.href = '/pelanggan'; return; }

  async function loadQueue() {
    const res = await API.get('/api/bookings');
    const rows = res.data.data || [];
    document.getElementById('queue-list').innerHTML = rows.length === 0 ? '<p class="hint">Tidak ada booking.</p>' :
      '<table class="table"><tr><th>ID</th><th>No. Polisi</th><th>Jadwal</th><th>Keluhan</th><th>Status</th><th>Ubah Status</th></tr>' +
      rows.map(b => {
        const actions = (STATUS_ACTION[b.status] || [])
          .map(([st, label]) => `<button class="btn btn-sm ok" data-status="${st}" data-id="${b.id}">${label}</button>`)
          .join(' ');
        return `<tr><td>${b.id}</td><td><b>${esc(b.no_polisi)}</b></td><td>${fmtDateTime(b.tanggal, b.jam_mulai)}</td>
          <td>${esc(b.keluhan || '-')}</td><td><span class="pill ${b.status}">${STATUS_LABEL[b.status] || esc(b.status)}</span></td>
          <td>${actions}</td></tr>`;
      }).join('') + '</table>';
  }

  document.getElementById('queue-list').addEventListener('click', async e => {
    const id = e.target.dataset && e.target.dataset.id;
    const status = e.target.dataset && e.target.dataset.status;
    if (!id || !status) return;
    const res = await API.put('/api/bookings/' + id + '/status', { status });
    if (!res.ok) alert(res.data.error);
    loadQueue();
  });
  document.getElementById('btn-load-queue').addEventListener('click', loadQueue);

  document.getElementById('form-record').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const res = await API.post('/api/service-records', {
      booking_id: f.booking_id.value,
      odometer_km: f.odometer_km.value,
      tindakan: f.tindakan.value,
      suku_cadang: f.suku_cadang.value,
      catatan_mekanik: f.catatan_mekanik.value,
    });
    if (res.status === 201) {
      showMsg('record-result', '✔ Catatan servis disimpan, booking ditandai selesai.', false);
      f.reset();
      loadQueue();
    } else {
      showMsg('record-result', res.data.error + ' ' + Object.values(res.data.detail || {}).join(' '), true);
    }
  });

  loadQueue();
});
