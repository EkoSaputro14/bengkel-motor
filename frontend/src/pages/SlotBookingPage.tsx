import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { ServiceSlot, Vehicle, Booking } from '../types/api';
import { Calendar, Clock, Car, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Sistem Auto-Confirm Booking Instan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Pilih Jadwal & Reservasi Servis</h1>
        <p className="text-slate-500 text-sm mt-1">
          Kapasitas slot dipantau secara real-time. Booking langsung terkonfirmasi tanpa menunggu persetujuan admin.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Date Picker Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Pilih Tanggal Rencana Servis:
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
          <span className="text-xs text-slate-500">
            Jadwal operasional: Senin - Minggu (Pukul 08:00 - 17:00 WIB)
          </span>
        </div>
      </div>

      {/* Main Grid: Slot Selection & Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Slot Grid (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-red-700" />
            <span>Pilih Jam Servis ({selectedDate})</span>
          </h2>

          {isLoadingSlots ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 flex justify-center">
              <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
            </div>
          ) : slots.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              Tidak ada slot servis pada tanggal ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3.5">
              {slots.map((s) => {
                const isSelected = selectedSlotId === s.id;
                const isFull = !s.is_available;

                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(s.id)}
                    className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-red-600 bg-red-50/70 ring-2 ring-red-600 shadow-sm'
                        : isFull
                        ? 'border-slate-200 bg-slate-100/60 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900 text-base font-mono">
                          {s.jam_mulai} WIB
                        </span>
                        {isSelected && <CheckCircle className="h-4 w-4 text-red-700" />}
                      </div>

                      <div className="text-xs">
                        {isFull ? (
                          <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
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
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          isFull ? 'bg-rose-500' : isSelected ? 'bg-red-600' : 'bg-emerald-500'
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 sticky top-20">
            <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
              Rincian Reservasi
            </h2>

            {vehicles.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-500 space-y-3">
                <Car className="h-10 w-10 mx-auto text-slate-300" />
                <p>Anda belum memiliki data motor terdaftar.</p>
                <Link
                  to="/customer/vehicles"
                  className="inline-block bg-red-700 hover:bg-red-800 text-white font-semibold text-xs px-4 py-2 rounded-lg"
                >
                  + Tambah Motor Sekarang
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Pilih Kendaraan
                  </label>
                  <select
                    value={selectedVehicleId || ''}
                    onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent font-medium"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.no_polisi} — {v.model} ({v.merk})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Keluhan & Permintaan Servis
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={keluhan}
                    onChange={(e) => setKeluhan(e.target.value)}
                    placeholder="Contoh: Ganti oli mesin MPX2, servis CVT bergetar, dan cek kampas rem belakang."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Ringkasan Pilihan:</div>
                  <div>Tanggal: <span className="font-semibold">{selectedDate}</span></div>
                  <div>
                    Jam: <span className="font-semibold">
                      {slots.find((s) => s.id === selectedSlotId)?.jam_mulai || '(Pilih slot di kiri)'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSlotId || !selectedVehicleId}
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl shadow transition flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">
                Auto-Confirmed
              </span>
              <h3 className="text-2xl font-bold text-slate-900 pt-2">Reservasi Berhasil Dibuat!</h3>
              <p className="text-sm text-slate-500">
                Jadwal servis motor Anda telah otomatis terkonfirmasi di server bengkel.
              </p>
            </div>

            {/* Booking Code Card */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-inner space-y-1">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Kode Booking Anda:</div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-red-400 tracking-wider">
                {confirmedBooking.booking_code}
              </div>
              <div className="text-xs text-slate-400 pt-1">
                Tunjukkan kode ini saat tiba di meja resepsionis / mekanik bengkel.
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Motor:</span>
                <span className="font-bold text-slate-800">
                  {confirmedBooking.vehicle?.model} ({confirmedBooking.vehicle?.no_polisi})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jadwal:</span>
                <span className="font-bold text-slate-800">
                  {confirmedBooking.slot?.tanggal} • Pukul {confirmedBooking.slot?.jam_mulai} WIB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Keluhan:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">
                  {confirmedBooking.keluhan}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  navigate('/customer');
                }}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded-xl shadow transition text-sm"
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
