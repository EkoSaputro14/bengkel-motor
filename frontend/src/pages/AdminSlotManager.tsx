import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { ServiceSlot } from '../types/api';
import { Calendar, Plus, Edit2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-red-700" />
          <span>Manajemen Jadwal Slot Servis Harian</span>
        </h1>
        <p className="text-sm text-slate-500">
          Atur kapasitas kuota pengerjaan per jam dan generate jadwal otomatis untuk beberapa hari ke depan.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Generate Jadwal Massal (Batch)</h3>
          <p className="text-xs text-slate-500">Membuat slot jam 08:00 - 16:00 otomatis untuk rentang hari tertentu.</p>

          <form onSubmit={handleBatchGenerate} className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mulai Tanggal</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jumlah Hari</label>
              <input
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kuota / Jam</label>
              <input
                type="number"
                min={1}
                max={20}
                value={kuotaPerSlot}
                onChange={(e) => setKuotaPerSlot(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="col-span-3 pt-2">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2 rounded-xl text-xs transition"
              >
                + Eksekusi Batch Slot
              </button>
            </div>
          </form>
        </div>

        {/* Single Slot Creator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Tambah Slot Spesifik</h3>
          <p className="text-xs text-slate-500">Menambahkan 1 slot jam pada tanggal tertentu.</p>

          <form onSubmit={handleCreateSlot} className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                required
                value={newTanggal}
                onChange={(e) => setNewTanggal(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Mulai</label>
              <input
                type="text"
                placeholder="08:00"
                required
                value={newJam}
                onChange={(e) => setNewJam(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kuota Maks</label>
              <input
                type="number"
                min={1}
                max={20}
                value={newKuota}
                onChange={(e) => setNewKuota(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="col-span-3 pt-2">
              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded-xl text-xs transition"
              >
                + Tambah Slot Baru
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Live Slot Inspector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Clock className="h-5 w-5 text-red-700" />
            <span>Daftar Slot Jam Operasional ({selectedDate})</span>
          </h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold"
          />
        </div>

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin h-6 w-6 border-b-2 border-red-700 rounded-full" />
          </div>
        ) : slots.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Belum ada slot untuk tanggal ini. Gunakan form di atas untuk membuatnya.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {slots.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900 text-sm">{s.jam_mulai} WIB</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      s.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {s.is_available ? `Sisa ${s.sisa_kuota}` : 'Penuh'}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  Terisi: <b className="text-slate-800">{s.terisi}</b> / Maks: <b className="text-slate-800">{s.kuota_maksimal}</b>
                </div>

                <div className="pt-2 flex items-center space-x-2">
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
                    className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-center font-bold"
                    title="Ubah kapasitas kuota"
                  />
                  <span className="text-[11px] text-slate-400">Edit Kuota</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
