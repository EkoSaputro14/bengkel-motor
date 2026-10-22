import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { ServiceSlot, Vehicle, Booking } from '../types/api';
import { Calendar, Clock, Bike, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const SlotBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<ServiceSlot[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [keluhan, setKeluhan] = useState('');

  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Fetch slots whenever selectedDate changes
  const fetchSlots = async (dateStr: string) => {
    setIsLoadingSlots(true);
    setError(null);
    try {
      const res = await api.get(`/service-slots?tanggal=${dateStr}`);
      if (res.data.status === 'success') {
        setSlots(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat jadwal slot.');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  // Fetch customer vehicles once
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await api.get('/vehicles');
        if (res.data.status === 'success') {
          setVehicles(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedVehicleId(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load vehicles', err);
      }
    };
    fetchVehicles();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !selectedSlotId || !keluhan.trim()) {
      setError('Mohon lengkapi motor, slot jam servis, dan keluhan motor.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post('/bookings', {
        vehicle_id: selectedVehicleId,
        slot_id: selectedSlotId,
        keluhan: keluhan.trim(),
      });

      if (response.data.status === 'success') {
        setConfirmedBooking(response.data.data);
        fetchSlots(selectedDate); // refresh remaining capacity
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const firstErr = Object.values(err.response.data.errors)[0] as string[];
        setError(firstErr[0]);
      } else {
        setError(err.response?.data?.message || 'Booking gagal diproses. Slot mungkin sudah penuh.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-brand-50 ring-1 ring-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full mb-2.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Sistem Auto-Confirm Booking Instan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Pilih Jadwal &amp; Reservasi Servis</h1>
        <p className="text-slate-500 text-sm mt-1.5">
          Kapasitas slot dipantau secara real-time. Booking langsung terkonfirmasi tanpa menunggu persetujuan admin.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 ring-1 ring-rose-200 text-rose-700 p-4 rounded-2xl text-sm flex items-start gap-2.5 animate-fade-in">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Date Picker Bar */}
      <div className="bg-white p-5 rounded-3xl ring-1 ring-slate-900/5 shadow-soft flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Tanggal Rencana Servis
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-600 font-bold text-sm transition"
          />
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Jadwal operasional: Senin - Minggu (Pukul 08:00 - 17:00 WIB)
          </span>
        </div>
      </div>

      {/* Main Grid: Slot Selection & Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Slot Grid (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-700" />
            <span>Pilih Jam Servis ({selectedDate})</span>
          </h2>

          {isLoadingSlots ? (
            <div className="bg-white p-14 rounded-3xl ring-1 ring-slate-900/5 shadow-soft flex justify-center">
              <div className="animate-spin h-8 w-8 border-[3px] border-brand-200 border-t-brand-600 rounded-full" />
            </div>
          ) : slots.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl ring-1 ring-slate-900/5 shadow-soft text-center text-slate-500 text-sm">
              Tidak ada slot servis pada tanggal ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {slots.map((s) => {
                const isSelected = selectedSlotId === s.id;
                const isFull = !s.is_available;

                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(s.id)}
                    className={`p-4 rounded-2xl ring-1 text-left transition-all duration-200 relative flex flex-col justify-between active:scale-[0.97] ${
                      isSelected
                        ? 'ring-2 ring-brand-600 bg-brand-50/80 shadow-glow'
                        : isFull
                        ? 'ring-slate-200 bg-slate-100/70 opacity-60 cursor-not-allowed'
                        : 'ring-slate-200 bg-white hover:ring-brand-300 hover:shadow-soft'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`font-extrabold text-base font-mono ${isSelected ? 'text-brand-800' : 'text-slate-900'}`}>
                          {s.jam_mulai} <span className="text-xs font-sans font-medium text-slate-400">WIB</span>
                        </span>
                        {isSelected && <CheckCircle className="h-4.5 w-4.5 h-5 w-5 text-brand-600" />}
                      </div>

                      <div className="text-xs">
                        {isFull ? (
                          <span className="text-rose-600 font-bold bg-rose-50 ring-1 ring-rose-200 px-2 py-0.5 rounded-full">
                            KUOTA PENUH
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">
                            Sisa {s.sisa_kuota} dari {s.kuota_maksimal} motor
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mini capacity bar */}
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isFull ? 'bg-rose-500' : isSelected ? 'bg-brand-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${(s.terisi / s.kuota_maksimal) * 100}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking Form (Col 5) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-5 sticky top-24">
            <h2 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3.5 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 h-5 w-5 text-brand-600" />
              Rincian Reservasi
            </h2>

            {vehicles.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500 space-y-3">
                <Bike className="h-10 w-10 mx-auto text-slate-300" />
                <p>Anda belum memiliki data motor terdaftar.</p>
                <Link
                  to="/customer/vehicles"
                  className="inline-block bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-glow"
                >
                  + Tambah Motor Sekarang
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Pilih Kendaraan
                  </label>
                  <select
                    value={selectedVehicleId || ''}
                    onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-600 text-sm font-semibold transition"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.no_polisi} — {v.model} ({v.merk})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Keluhan &amp; Permintaan Servis
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={keluhan}
                    onChange={(e) => setKeluhan(e.target.value)}
                    placeholder="Contoh: Ganti oli mesin MPX2, servis CVT bergetar, dan cek kampas rem belakang."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-600 focus:bg-white text-sm transition"
                  />
                </div>

                <div className="bg-slate-50 ring-1 ring-slate-100 p-4 rounded-2xl text-xs text-slate-600 space-y-1.5">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-600" /> Ringkasan Pilihan:
                  </div>
                  <div>Tanggal: <span className="font-bold text-slate-800">{selectedDate}</span></div>
                  <div>
                    Jam: <span className="font-bold text-slate-800">
                      {slots.find((s) => s.id === selectedSlotId)?.jam_mulai || '(Pilih slot di kiri)'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSlotId || !selectedVehicleId}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-3 rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Konfirmasi Booking Instan</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Success Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-scale-in">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle className="h-10 w-10" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 ring-1 ring-emerald-200 px-3 py-1 rounded-full">
                Auto-Confirmed
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 pt-2">Reservasi Berhasil Dibuat!</h3>
              <p className="text-sm text-slate-500">
                Jadwal servis motor Anda telah otomatis terkonfirmasi di server bengkel.
              </p>
            </div>

            {/* Booking Code Card */}
            <div className="relative overflow-hidden bg-ink-950 text-white p-5 rounded-2xl space-y-1.5 shadow-lift">
              <div className="absolute -top-14 -right-10 w-44 h-44 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />
              <div className="relative text-xs text-slate-400 uppercase tracking-wider">Kode Booking Anda:</div>
              <div className="relative text-2xl sm:text-3xl font-mono font-extrabold text-gradient tracking-wider">
                {confirmedBooking.booking_code}
              </div>
              <div className="relative text-xs text-slate-400 pt-1">
                Tunjukkan kode ini saat tiba di meja resepsionis / mekanik bengkel.
              </div>
            </div>

            <div className="bg-slate-50 ring-1 ring-slate-100 p-4 rounded-2xl text-left text-xs space-y-2.5">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Motor:</span>
                <span className="font-bold text-slate-800">
                  {confirmedBooking.vehicle?.model} ({confirmedBooking.vehicle?.no_polisi})
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Jadwal:</span>
                <span className="font-bold text-slate-800">
                  {confirmedBooking.slot?.tanggal} • Pukul {confirmedBooking.slot?.jam_mulai} WIB
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Keluhan:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">
                  {confirmedBooking.keluhan}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  navigate('/customer');
                }}
                className="flex-1 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-3 rounded-xl shadow-glow transition text-sm active:scale-[0.98]"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
