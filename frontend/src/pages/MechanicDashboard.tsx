import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Booking, SparePart } from '../types/api';
import { Wrench, Calendar, Clock, Car, CheckCircle2, AlertCircle, Plus, Trash2, X, Phone } from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
            <Wrench className="h-3.5 w-3.5" />
            <span>Modul Tablet & Layar Mekanik Bengkel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Antrean Servis Aktif</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar motor yang telah terkonfirmasi dan siap dikerjakan di pit bengkel.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition"
        >
          ↻ Segarkan Antrean
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Queue Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
        </div>
      ) : queue.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm space-y-2">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <p className="font-bold text-slate-800 text-base">Tidak Ada Antrean Servis Aktif</p>
          <p className="text-xs text-slate-400">Seluruh booking yang terkonfirmasi telah selesai dikerjakan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queue.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-md">
                    {b.booking_code}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                    SIAP DIKERJAKAN
                  </span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-red-700" />
                    <h3 className="text-lg font-bold text-slate-900">{b.vehicle?.model}</h3>
                  </div>
                  <div className="font-mono font-bold text-sm text-red-700 mt-0.5">
                    {b.vehicle?.no_polisi} <span className="text-slate-400 font-sans font-normal text-xs">({b.vehicle?.merk})</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center space-x-1 font-semibold text-slate-800">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{b.slot?.tanggal} • {b.slot?.jam_mulai} WIB</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>Pemilik: {b.vehicle?.user?.nama} ({b.vehicle?.user?.no_hp})</span>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-950">
                  <span className="font-bold">Keluhan: </span>"{b.keluhan}"
                </div>
              </div>

              <button
                onClick={() => openServiceModal(b)}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl text-sm shadow transition flex items-center justify-center space-x-2"
              >
                <Wrench className="h-4 w-4" />
                <span>Mulai & Catat Servis</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Service Record Entry Modal */}
      {activeBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div>
                <h3 className="font-bold text-base">Pencatatan Servis & Digital Logbook</h3>
                <div className="text-xs text-slate-400 font-mono">
                  {activeBooking.vehicle?.no_polisi} — {activeBooking.vehicle?.model} ({activeBooking.booking_code})
                </div>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitServiceRecord} className="p-6 overflow-y-auto space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Odometer Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kilometer Odometer (KM)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(Number(e.target.value))}
                  placeholder="Contoh: 12500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {/* Actions Performed */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tindakan & Perbaikan yang Dilakukan
                </label>
                <textarea
                  required
                  rows={3}
                  value={tindakan}
                  onChange={(e) => setTindakan(e.target.value)}
                  placeholder="Contoh: Ganti oli mesin, bersihkan filter udara, kuras minyak rem, setel klep, pembersihan transmisi CVT."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {/* Dynamic Spare Parts Table */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Suku Cadang & Oli yang Diganti
                  </label>
                  <button
                    type="button"
                    onClick={addSparePartRow}
                    className="text-xs bg-red-50 hover:bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {spareParts.map((part, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Nama sparepart / oli"
                        value={part.nama}
                        onChange={(e) => updateSparePart(idx, 'nama', e.target.value)}
                        className="flex-grow px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-red-600"
                      />
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={part.qty}
                        onChange={(e) => updateSparePart(idx, 'qty', Number(e.target.value))}
                        className="w-16 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-center font-bold focus:ring-1 focus:ring-red-600"
                      />
                      <input
                        type="text"
                        placeholder="Keterangan (opsional)"
                        value={part.keterangan || ''}
                        onChange={(e) => updateSparePart(idx, 'keterangan', e.target.value)}
                        className="w-40 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-red-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeSparePartRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mechanic Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Tambahan untuk Pelanggan (Opsional)
                </label>
                <input
                  type="text"
                  value={catatanMekanik}
                  onChange={(e) => setCatatanMekanik(e.target.value)}
                  placeholder="Contoh: Kampas rem depan mulai menipis, disarankan ganti di servis berikutnya."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveBooking(null)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow transition flex items-center space-x-2 disabled:opacity-50"
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
