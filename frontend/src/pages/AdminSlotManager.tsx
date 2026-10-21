import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { ServiceSlot } from '../types/api';
import { Calendar, Plus, AlertCircle, CheckCircle2, Clock, Layers } from 'lucide-react';

export const AdminSlotManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<ServiceSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Batch generator state
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(7);
  const [kuotaPerSlot, setKuotaPerSlot] = useState(4);

  // Single Slot Create state
  const [newTanggal, setNewTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [newJam, setNewJam] = useState('08:00');
  const [newKuota, setNewKuota] = useState(4);

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchSlots = async (dateStr: string) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/service-slots?tanggal=${dateStr}`);
      if (res.data.status === 'success') {
        setSlots(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch slots', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/service-slots', {
        tanggal: newTanggal,
        jam_mulai: newJam,
        kuota_maksimal: Number(newKuota),
      });
      if (res.data.status === 'success') {
        setMessage({ text: 'Slot servis baru berhasil dibuat.', type: 'success' });
        if (newTanggal === selectedDate) fetchSlots(selectedDate);
      }
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Gagal membuat slot.', type: 'error' });
    }
  };

  const handleBatchGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/service-slots/batch', {
        start_date: startDate,
        days: Number(days),
        kuota_per_slot: Number(kuotaPerSlot),
      });
      if (res.data.status === 'success') {
        setMessage({ text: res.data.message, type: 'success' });
        fetchSlots(selectedDate);
      }
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Gagal generate batch slot.', type: 'error' });
    }
  };

  const handleUpdateCapacity = async (slotId: number, newCapacity: number) => {
    try {
      const res = await api.put(`/admin/service-slots/${slotId}`, {
        kuota_maksimal: newCapacity,
      });
      if (res.data.status === 'success') {
        setMessage({ text: 'Kapasitas slot berhasil diubah.', type: 'success' });
        fetchSlots(selectedDate);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah kapasitas.');
    }
  };

  const inputCls = 'w-full p-2.5 bg-slate-50 ring-1 ring-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-600 focus:bg-white transition';
  const labelCls = 'block font-bold text-slate-600 mb-1.5 text-xs';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <span className="p-2 bg-gradient-to-br from-brand-500 to-brand-800 text-white rounded-xl shadow-glow">
            <Calendar className="h-5 w-5" />
          </span>
          <span>Manajemen Jadwal Slot Servis Harian</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">
          Atur kapasitas kuota pengerjaan per jam dan generate jadwal otomatis untuk beberapa hari ke depan.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-2.5 animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 ring-1 ring-emerald-200 text-emerald-800'
              : 'bg-rose-50 ring-1 ring-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Generator */}
        <div className="bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-ink-950 text-white rounded-lg">
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">Generate Jadwal Massal (Batch)</h3>
          </div>
          <p className="text-xs text-slate-500">Membuat slot jam 08:00 - 16:00 otomatis untuk rentang hari tertentu.</p>

          <form onSubmit={handleBatchGenerate} className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Mulai Tanggal</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Jumlah Hari</label>
              <input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Kuota / Jam</label>
              <input type="number" min={1} max={20} value={kuotaPerSlot} onChange={(e) => setKuotaPerSlot(Number(e.target.value))} className={inputCls} />
            </div>
            <div className="col-span-3 pt-2">
              <button
                type="submit"
                className="w-full bg-ink-950 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-slate-900/20 transition active:scale-[0.98]"
              >
                + Eksekusi Batch Slot
              </button>
            </div>
          </form>
        </div>

        {/* Single Slot Creator */}
        <div className="bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-50 text-brand-700 ring-1 ring-brand-100 rounded-lg">
              <Plus className="h-4 w-4" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">Tambah Slot Spesifik</h3>
          </div>
          <p className="text-xs text-slate-500">Menambahkan 1 slot jam pada tanggal tertentu.</p>

          <form onSubmit={handleCreateSlot} className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Tanggal</label>
              <input type="date" required value={newTanggal} onChange={(e) => setNewTanggal(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Jam Mulai</label>
              <input
                type="text"
                placeholder="08:00"
                required
                value={newJam}
                onChange={(e) => setNewJam(e.target.value)}
                className={`${inputCls} font-mono`}
              />
            </div>
            <div>
              <label className={labelCls}>Kuota Maks</label>
              <input type="number" min={1} max={20} value={newKuota} onChange={(e) => setNewKuota(Number(e.target.value))} className={inputCls} />
            </div>
            <div className="col-span-3 pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-2.5 rounded-xl text-xs shadow-glow transition active:scale-[0.98]"
              >
                + Tambah Slot Baru
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Live Slot Inspector */}
      <div className="bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-700" />
            <span>Daftar Slot Jam Operasional ({selectedDate})</span>
          </h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-600 rounded-xl text-xs font-bold transition"
          />
        </div>

        {isLoading ? (
          <div className="py-10 flex justify-center">
            <div className="animate-spin h-7 w-7 border-[3px] border-brand-200 border-t-brand-600 rounded-full" />
          </div>
        ) : slots.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs">
            Belum ada slot untuk tanggal ini. Gunakan form di atas untuk membuatnya.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {slots.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50/80 ring-1 ring-slate-200/80 rounded-2xl space-y-2.5 hover:ring-brand-300 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-extrabold text-slate-900 text-sm">{s.jam_mulai} <span className="font-sans text-[10px] font-medium text-slate-400">WIB</span></span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      s.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {s.is_available ? `Sisa ${s.sisa_kuota}` : 'Penuh'}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  Terisi: <b className="text-slate-800">{s.terisi}</b> / Maks: <b className="text-slate-800">{s.kuota_maksimal}</b>
                </div>

                <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${s.is_available ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${(s.terisi / s.kuota_maksimal) * 100}%` }}
                  />
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min={s.terisi}
                    max={20}
                    defaultValue={s.kuota_maksimal}
                    onBlur={(e) => {
                      const val = Number(e.target.value);
                      if (val !== s.kuota_maksimal && val >= s.terisi) {
                        handleUpdateCapacity(s.id, val);
                      }
                    }}
                    className="w-16 px-2 py-1.5 bg-white ring-1 ring-slate-200 rounded-lg text-xs text-center font-bold focus:ring-2 focus:ring-brand-600 transition"
                    title="Ubah kapasitas kuota"
                  />
                  <span className="text-[11px] text-slate-400 font-medium">Edit Kuota</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
