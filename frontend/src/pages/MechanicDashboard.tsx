import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Booking, SparePart } from '../types/api';
import { Wrench, Calendar, Clock, Bike, CheckCircle2, AlertCircle, Plus, Trash2, X, Phone, RefreshCw, ClipboardList } from 'lucide-react';

export const MechanicDashboard: React.FC = () => {
  const [queue, setQueue] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Modal Form State
  const [odometerKm, setOdometerKm] = useState<number>(10000);
  const [tindakan, setTindakan] = useState('');
  const [catatanMekanik, setCatatanMekanik] = useState('');
  const [spareParts, setSpareParts] = useState<SparePart[]>([
    { nama: 'Oli Mesin MPX2 0.8L', qty: 1, keterangan: 'Penggantian rutin' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      const res = await api.get('/mechanic/bookings');
      if (res.data.status === 'success') {
        setQueue(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load mechanic queue', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const openServiceModal = (b: Booking) => {
    setActiveBooking(b);
    setOdometerKm(10000);
    setTindakan('');
    setCatatanMekanik('');
    setSpareParts([{ nama: 'Oli Mesin MPX2 0.8L', qty: 1, keterangan: 'Penggantian berkala' }]);
    setError(null);
  };

  const addSparePartRow = () => {
    setSpareParts([...spareParts, { nama: '', qty: 1, keterangan: '' }]);
  };

  const removeSparePartRow = (index: number) => {
    setSpareParts(spareParts.filter((_, i) => i !== index));
  };

  const updateSparePart = (index: number, field: keyof SparePart, value: any) => {
    const updated = [...spareParts];
    updated[index] = { ...updated[index], [field]: value };
    setSpareParts(updated);
  };

  const handleSubmitServiceRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;

    if (!tindakan.trim()) {
      setError('Tindakan perbaikan wajib diisi.');
      return;
    }

    // Filter valid spare parts
    const validParts = spareParts.filter((p) => p.nama.trim() !== '');

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.post('/service-records', {
        booking_id: activeBooking.id,
        odometer_km: Number(odometerKm),
        tindakan: tindakan.trim(),
        suku_cadang: validParts,
        catatan_mekanik: catatanMekanik.trim() || null,
      });

      if (response.data.status === 'success') {
        setSuccess(`Servis untuk ${activeBooking.vehicle?.no_polisi} (${activeBooking.booking_code}) berhasil diselesaikan.`);
        setActiveBooking(null);
        fetchQueue();
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan rekam servis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-600 focus:bg-white text-sm transition';
  const labelCls = 'block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-white p-6 sm:p-7 rounded-3xl ring-1 ring-slate-900/5 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-amber-100/70 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 ring-1 ring-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-2.5">
            <Wrench className="h-3.5 w-3.5" />
            <span>Modul Tablet &amp; Layar Mekanik Bengkel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Antrean Servis Aktif</h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar motor yang telah terkonfirmasi dan siap dikerjakan di pit bengkel.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-white ring-1 ring-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition active:scale-95"
        >
          <RefreshCw className="h-4 w-4 text-slate-500" />
          Segarkan Antrean
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 ring-1 ring-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Queue Grid */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin h-8 w-8 border-[3px] border-brand-200 border-t-brand-600 rounded-full" />
        </div>
      ) : queue.length === 0 ? (
        <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-soft p-14 text-center text-slate-500 text-sm space-y-2">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <p className="font-extrabold text-slate-800 text-base">Tidak Ada Antrean Servis Aktif</p>
          <p className="text-xs text-slate-400">Seluruh booking yang terkonfirmasi telah selesai dikerjakan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queue.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-extrabold bg-ink-950 text-white px-2.5 py-1.5 rounded-lg ring-1 ring-slate-700">
                    {b.booking_code}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SIAP DIKERJAKAN
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-brand-50 rounded-lg text-brand-700">
                      <Bike className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">{b.vehicle?.model}</h3>
                  </div>
                  <div className="font-mono font-bold text-sm text-brand-700 mt-1">
                    {b.vehicle?.no_polisi} <span className="text-slate-400 font-sans font-normal text-xs">({b.vehicle?.merk})</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 ring-1 ring-slate-100 p-3.5 rounded-2xl text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{b.slot?.tanggal} • {b.slot?.jam_mulai} WIB</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>Pemilik: {b.vehicle?.user?.nama} ({b.vehicle?.user?.no_hp})</span>
                  </div>
                </div>

                <div className="bg-amber-50/80 ring-1 ring-amber-200/70 p-3.5 rounded-2xl text-xs text-amber-950">
                  <span className="font-bold">Keluhan: </span>"{b.keluhan}"
                </div>
              </div>

              <button
                onClick={() => openServiceModal(b)}
                className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-3 rounded-xl text-sm shadow-glow transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Wrench className="h-4 w-4" />
                <span>Mulai &amp; Catat Servis</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Service Record Entry Modal */}
      {activeBooking && (
        <div className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
            <div className="relative px-6 py-4 flex justify-between items-center bg-ink-950 text-white overflow-hidden">
              <div className="absolute -top-16 right-8 w-52 h-52 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-brand-400" />
                  Pencatatan Servis &amp; Digital Logbook
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {activeBooking.vehicle?.no_polisi} — {activeBooking.vehicle?.model} ({activeBooking.booking_code})
                </div>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="relative text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitServiceRecord} className="p-6 overflow-y-auto space-y-5">
              {error && (
                <div className="bg-rose-50 ring-1 ring-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Odometer Input */}
              <div>
                <label className={labelCls}>Kilometer Odometer (KM)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(Number(e.target.value))}
                  placeholder="Contoh: 12500"
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-950 text-white ring-1 ring-slate-700 focus:ring-2 focus:ring-brand-500 font-mono font-bold text-sm transition"
                />
              </div>

              {/* Actions Performed */}
              <div>
                <label className={labelCls}>Tindakan &amp; Perbaikan yang Dilakukan</label>
                <textarea
                  required
                  rows={3}
                  value={tindakan}
                  onChange={(e) => setTindakan(e.target.value)}
                  placeholder="Contoh: Ganti oli mesin, bersihkan filter udara, kuras minyak rem, setel klep, pembersihan transmisi CVT."
                  className={inputCls}
                />
              </div>

              {/* Dynamic Spare Parts Table */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Suku Cadang &amp; Oli yang Diganti
                  </label>
                  <button
                    type="button"
                    onClick={addSparePartRow}
                    className="text-xs bg-brand-50 hover:bg-brand-100 ring-1 ring-brand-100 text-brand-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {spareParts.map((part, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 bg-slate-50/80 p-2.5 rounded-2xl ring-1 ring-slate-200">
                      <input
                        type="text"
                        placeholder="Nama sparepart / oli"
                        value={part.nama}
                        onChange={(e) => updateSparePart(idx, 'nama', e.target.value)}
                        className="flex-grow min-w-[140px] px-3 py-2 bg-white ring-1 ring-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-600 focus:bg-white transition"
                      />
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={part.qty}
                        onChange={(e) => updateSparePart(idx, 'qty', Number(e.target.value))}
                        className="w-16 px-2 py-2 bg-white ring-1 ring-slate-200 rounded-xl text-xs text-center font-bold focus:ring-2 focus:ring-brand-600 transition"
                      />
                      <input
                        type="text"
                        placeholder="Keterangan (opsional)"
                        value={part.keterangan || ''}
                        onChange={(e) => updateSparePart(idx, 'keterangan', e.target.value)}
                        className="w-44 flex-grow px-3 py-2 bg-white ring-1 ring-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-600 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeSparePartRow(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mechanic Notes */}
              <div>
                <label className={labelCls}>Catatan Tambahan untuk Pelanggan (Opsional)</label>
                <input
                  type="text"
                  value={catatanMekanik}
                  onChange={(e) => setCatatanMekanik(e.target.value)}
                  placeholder="Contoh: Kampas rem depan mulai menipis, disarankan ganti di servis berikutnya."
                  className={inputCls}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveBooking(null)}
                  className="px-4 py-2.5 ring-1 ring-slate-200 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl text-sm font-bold shadow-glow transition flex items-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Menyimpan Rekam Servis...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Selesaikan Servis (COMPLETED)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
