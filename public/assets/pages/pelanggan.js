document.addEventListener('DOMContentLoaded', () => {
  if (!requireLogin()) return;
  const vList = document.getElementById('vehicle-list');
  const slotList = document.getElementById('slot-list');

  // ---- Kendaraan ----
  async function loadVehicles() {
    const res = await API.get('/api/vehicles');
    if (res.status === 401) { API.clear(); window.location.href = '/login'; return; }
    const rows = res.data.data || [];
    vList.innerHTML = rows.length === 0 ? '<p class="hint">Belum ada kendaraan.</p>' :
      '<table class="table"><tr><th>ID</th><th>No. Polisi</th><th>Merk</th><th>Model</th><th>Tahun</th><th></th></tr>' +
      rows.map(v => `<tr><td>${v.id}</td><td><b>${esc(v.no_polisi)}</b></td><td>${esc(v.merk)}</td><td>${esc(v.model)}</td><td>${esc(v.tahun)}</td>
        <td><button class="btn btn-sm btn-danger" data-del="${v.id}">Hapus</button></td></tr>`).join('') + '</table>';
  }

  document.getElementById('form-vehicle').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const res = await API.post('/api/vehicles', {
      no_polisi: f.no_polisi.value, merk: f.merk.value, model: f.model.value, tahun: f.tahun.value,
    });
    if (res.status === 201) { f.reset(); loadVehicles(); }
    else alert(res.data.error + ' ' + Object.values(res.data.detail || {}).join(' '));
  });

  vList.addEventListener('click', async e => {
    const id = e.target.dataset && e.target.dataset.del;
    if (!id) return;
    if (!confirm('Hapus kendaraan ini?')) return;
    const res = await API.del('/api/vehicles/' + id);
    if (!res.ok) alert(res.data.error);
    loadVehicles();
  });

  // ---- Slot ----
  async function loadAvailableDates() {
    const res = await API.get('/api/slots/available');
    const sel = document.getElementById('slot-date');
    sel.innerHTML = (res.data.data || []).map(d =>
      `<option value="${d.tanggal}">${d.tanggal} (sisa ${d.sisa} slot)</option>`).join('');
  }

  async function loadSlots() {
    const tanggal = document.getElementById('slot-date').value;
    if (!tanggal) return;
    const res = await API.get('/api/slots?tanggal=' + tanggal);
    const rows = res.data.data || [];
    slotList.innerHTML = rows.length === 0 ? '<p class="hint">Tidak ada slot pada tanggal ini.</p>' :
      rows.map(s => {
        const full = Number(s.sisa_kuota) <= 0;
        return `<div class="slot ${full ? 'full' : ''}"><b>${esc((s.jam_mulai || '').slice(0,5))}</b>
          <span>kuota ${s.kuota_maksimal} · terisi ${s.terisi}</span>
          ${full ? '<span class="pill cancelled">penuh</span>'
            : `<button class="btn btn-sm btn-primary" data-slot="${s.id}">Pesan</button>`}</div>`;
      }).join('');
  }

  slotList.addEventListener('click', e => {
    const slotId = e.target.dataset && e.target.dataset.slot;
    if (!slotId) return;
    document.getElementById('booking-slot-id').value = slotId;
    document.getElementById('form-booking').classList.remove('hidden');
    showMsg('booking-result', 'Slot ' + slotId + ' dipilih. Isi ID kendaraan lalu tekan Pesan Slot.', false);
  });

  document.getElementById('btn-load-slots').addEventListener('click', loadSlots);

  document.getElementById('form-booking').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const res = await API.post('/api/bookings', {
      vehicle_id: f.vehicle_id.value, slot_id: f.slot_id.value, keluhan: f.keluhan.value,
    });
    if (res.status === 201) {
      showMsg('booking-result', '✔ Reservasi berhasil (ID booking ' + res.data.data.id + ').', false);
      f.classList.add('hidden');
      loadSlots();
    } else {
      showMsg('booking-result', res.data.error || 'Gagal reservasi.', true);
    }
  });

  // ---- Booking saya ----
  async function loadBookings() {
    const res = await API.get('/api/bookings');
    const rows = res.data.data || [];
    document.getElementById('booking-list').innerHTML = rows.length === 0 ? '<p class="hint">Belum ada booking.</p>' :
      '<table class="table"><tr><th>ID</th><th>No. Polisi</th><th>Jadwal</th><th>Keluhan</th><th>Status</th><th></th></tr>' +
      rows.map(b => `<tr><td>${b.id}</td><td>${esc(b.no_polisi)}</td><td>${fmtDateTime(b.tanggal, b.jam_mulai)}</td>
        <td>${esc(b.keluhan || '-')}</td><td><span class="pill ${b.status}">${STATUS_LABEL[b.status] || esc(b.status)}</span></td>
        <td>${b.status === 'booked' ? `<button class="btn btn-sm btn-danger" data-cancel="${b.id}">Batalkan</button>` : ''}</td></tr>`).join('') + '</table>';
  }

  document.getElementById('booking-list').addEventListener('click', async e => {
    const id = e.target.dataset && e.target.dataset.cancel;
    if (!id) return;
    if (!confirm('Batalkan booking ini?')) return;
    const res = await API.del('/api/bookings/' + id);
    if (!res.ok) alert(res.data.error);
    loadBookings();
  });
  document.getElementById('btn-load-bookings').addEventListener('click', loadBookings);

  // ---- Riwayat ----
  document.getElementById('form-history').addEventListener('submit', async e => {
    e.preventDefault();
    const no = e.target.no_polisi.value.trim();
    const res = await API.get('/api/history?no_polisi=' + encodeURIComponent(no));
    const box = document.getElementById('history-result');
    if (!res.ok) { box.innerHTML = '<p class="msg err">' + esc(res.data.error) + '</p>'; return; }
    const d = res.data;
    box.innerHTML = `<p><b>${esc(d.kendaraan.merk)} ${esc(d.kendaraan.model)} (${esc(d.kendaraan.tahun)})</b> — ${esc(d.kendaraan.no_polisi)} · ${d.jumlah_riwayat} catatan</p>` +
      (d.data.length === 0 ? '<p class="hint">Belum ada riwayat servis.</p>' :
      '<table class="table"><tr><th>Tanggal</th><th>Odometer</th><th>Tindakan</th><th>Suku Cadang</th><th>Catatan Mekanik</th></tr>' +
      d.data.map(r => `<tr><td>${esc(r.tanggal)}</td><td>${r.odometer_km} km</td><td>${esc(r.tindakan)}</td><td>${esc(r.suku_cadang || '-')}</td><td>${esc(r.catatan_mekanik || '-')}</td></tr>`).join('') + '</table>');
  });

  loadVehicles();
  loadAvailableDates();
});
