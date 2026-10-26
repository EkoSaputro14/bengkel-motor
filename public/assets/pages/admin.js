document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;
  if (API.user && API.user.role !== 'admin') { alert('Halaman ini khusus admin.'); window.location.href = '/'; return; }

  document.getElementById('form-slot').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const res = await API.post('/api/slots', {
      tanggal: f.tanggal.value, jam_mulai: f.jam_mulai.value, kuota_maksimal: f.kuota_maksimal.value,
    });
    if (res.status === 201) { f.reset(); alert('Slot berhasil dibuat.'); }
    else alert(res.data.error);
  });

  async function loadSlotsAdmin() {
    const tanggal = document.getElementById('slot-view-date').value;
    if (!tanggal) { alert('Pilih tanggal dahulu.'); return; }
    const res = await API.get('/api/slots?tanggal=' + tanggal);
    const rows = res.data.data || [];
    document.getElementById('slot-list-admin').innerHTML = rows.length === 0 ? '<p class="hint">Tidak ada slot.</p>' :
      '<table class="table"><tr><th>ID</th><th>Jam</th><th>Kuota Maks</th><th>Terisi</th><th>Sisa</th></tr>' +
      rows.map(s => `<tr><td>${s.id}</td><td>${esc((s.jam_mulai || '').slice(0,5))}</td><td>${s.kuota_maksimal}</td><td>${s.terisi}</td><td>${s.sisa_kuota}</td></tr>`).join('') + '</table>';
  }
  document.getElementById('btn-load-slots-admin').addEventListener('click', loadSlotsAdmin);

  async function loadBookingsAdmin() {
    const res = await API.get('/api/bookings');
    const rows = res.data.data || [];
    document.getElementById('booking-list-admin').innerHTML = rows.length === 0 ? '<p class="hint">Belum ada booking.</p>' :
      '<table class="table"><tr><th>ID</th><th>No. Polisi</th><th>Merk/Model</th><th>Jadwal</th><th>Status</th></tr>' +
      rows.map(b => `<tr><td>${b.id}</td><td><b>${esc(b.no_polisi)}</b></td><td>${esc(b.merk)} ${esc(b.model)}</td>
        <td>${fmtDateTime(b.tanggal, b.jam_mulai)}</td><td><span class="pill ${b.status}">${STATUS_LABEL[b.status] || esc(b.status)}</span></td></tr>`).join('') + '</table>';
  }
  document.getElementById('btn-load-bookings-admin').addEventListener('click', loadBookingsAdmin);
});
