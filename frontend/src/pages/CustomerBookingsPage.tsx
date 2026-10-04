import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Booking } from '../types/api';
import { StatusBadge } from '../components/Badge';
import { Calendar, Clock, Car, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const CustomerBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/customer/bookings');
      if (res.data.status === 'success') {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: number, code: string) => {
    if (!window.confirm(`Yakin ingin membatalkan jadwal reservasi ${code}?`)) return;

    try {
      const res = await api.patch(`/bookings/${bookingId}/cancel`);
      if (res.data.status === 'success') {
        setMessage({ text: `Reservasi ${code} berhasil dibatalkan.`, type: 'success' });
        fetchBookings();
      }
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || 'Gagal membatalkan booking.',
        type: 'error',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Riwayat & Status Booking Saya</h1>
        <p className="text-sm text-slate-500">Daftar seluruh reservasi jadwal servis aktif dan masa lalu.</p>
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

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
          Belum ada riwayat pemesanan servis.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-base font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                    {b.booking_code}
                  </span>
                  <StatusBadge status={b.status} />
                  <span className="text-xs text-slate-400">
                    Dibuat: {new Date(b.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-slate-900 font-semibold text-base">
                  <Car className="h-5 w-5 text-red-700" />
                  <span>
                    {b.vehicle?.model} ({b.vehicle?.no_polisi}) — {b.vehicle?.merk}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Tanggal: <b>{b.slot?.tanggal}</b></span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>Jam: <b>{b.slot?.jam_mulai} WIB</b></span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Keluhan Pelanggan:</span> {b.keluhan}
                </div>

                {/* Mechanic Service Record Summary if Completed */}
                {b.service_record && (
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                    <div className="font-bold text-emerald-950 flex justify-between">
                      <span>Catatan Pengerjaan Mekanik:</span>
                      <span>Odometer: {b.service_record.odometer_km.toLocaleString('id-ID')} KM</span>
                    </div>
                    <p>{b.service_record.tindakan}</p>
                    {b.service_record.suku_cadang && b.service_record.suku_cadang.length > 0 && (
                      <div className="pt-1">
                        <span className="font-semibold">Suku Cadang Diganti: </span>
                        {b.service_record.suku_cadang.map((p) => `${p.nama} (${p.qty}x)`).join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col justify-between items-end min-w-[140px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                {b.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancelBooking(b.id, b.booking_code)}
                    className="w-full sm:w-auto px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Batalkan Booking</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
