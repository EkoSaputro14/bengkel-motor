import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Booking, Vehicle } from '../types/api';
import { StatusBadge } from '../components/Badge';
import { Car, Calendar, Clock, PlusCircle, ArrowRight, CheckCircle2, History, Bike, Sparkles } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehRes, bookRes] = await Promise.all([
          api.get('/vehicles'),
          api.get('/customer/bookings'),
        ]);
        if (vehRes.data.status === 'success') setVehicles(vehRes.data.data);
        if (bookRes.data.status === 'success') setBookings(bookRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-[3px] border-brand-200 border-t-brand-600 rounded-full" />
      </div>
    );
  }

  const activeBooking = bookings.find((b) => b.status === 'CONFIRMED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-white p-6 sm:p-7 rounded-3xl ring-1 ring-slate-900/5 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-brand-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700 uppercase tracking-widest mb-1">
            <Sparkles className="h-3.5 w-3.5" /> Dashboard Pelanggan
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Halo, {user?.nama} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola kendaraan dan jadwal perawatan motor Anda di sini.</p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <Link
            to="/customer/vehicles"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white ring-1 ring-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:ring-slate-300 transition-all active:scale-95"
          >
            <Car className="h-4 w-4 text-slate-500" />
            <span>Motor Saya ({vehicles.length})</span>
          </Link>
          <Link
            to="/customer/booking"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl text-sm font-bold shadow-glow transition-all active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Booking Servis</span>
          </Link>
        </div>
      </div>

      {/* Active Booking Banner */}
      {activeBooking ? (
        <div className="relative overflow-hidden bg-ink-950 text-white p-6 sm:p-7 rounded-3xl shadow-lift flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-scale-in">
          <div className="absolute -top-20 right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 ring-1 ring-emerald-400/40 text-emerald-300 text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Booking Aktif Terkonfirmasi
              </span>
              <span className="text-emerald-300/90 font-mono text-sm font-bold">{activeBooking.booking_code}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold pt-1">
              {activeBooking.vehicle?.model} <span className="text-slate-400 font-mono text-base">({activeBooking.vehicle?.no_polisi})</span>
            </h2>
            <div className="text-slate-300 text-sm flex flex-wrap items-center gap-x-5 gap-y-1 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-400" />
                {activeBooking.slot?.tanggal}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-emerald-400" />
                Pukul {activeBooking.slot?.jam_mulai} WIB
              </span>
            </div>
            <p className="text-xs text-slate-400 italic pt-1">Keluhan: "{activeBooking.keluhan}"</p>
          </div>
          <Link
            to="/customer/bookings"
            className="relative bg-white text-slate-900 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 text-center shadow"
          >
            Lihat Detail Booking
          </Link>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-50 to-orange-50 ring-1 ring-brand-100 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="font-extrabold text-brand-900">Belum Ada Jadwal Servis Aktif</h2>
            <p className="text-xs text-brand-700/80 mt-0.5">Jadwalkan servis rutin motor Anda agar performa selalu prima.</p>
          </div>
          <Link
            to="/customer/booking"
            className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-glow transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Pesan Slot Sekarang</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Grid: Vehicles & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles Column */}
        <div className="bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
            <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-brand-50 rounded-lg text-brand-700">
                <Bike className="h-4 w-4" />
              </span>
              <span>Kendaraan Terdaftar</span>
            </h2>
            <Link to="/customer/vehicles" className="text-xs font-bold text-brand-700 hover:underline">
              Kelola
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm space-y-2">
              <Car className="h-9 w-9 mx-auto text-slate-300" />
              <p>Belum ada motor yang didaftarkan.</p>
              <Link to="/customer/vehicles" className="text-brand-700 text-xs font-bold hover:underline">
                + Daftarkan Motor
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.slice(0, 3).map((v) => (
                <div key={v.id} className="p-4 bg-slate-50/80 ring-1 ring-slate-100 rounded-2xl flex justify-between items-center hover:ring-brand-200 hover:bg-brand-50/40 transition-all">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{v.model}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{v.merk} • Tahun {v.tahun}</div>
                  </div>
                  <span className="bg-ink-950 text-white font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg ring-1 ring-slate-700">
                    {v.no_polisi}
                  </span>
                </div>
              ))}

              {vehicles.length > 3 && (
                <Link
                  to="/customer/vehicles"
                  className="block text-center py-2 text-xs font-bold text-brand-700 hover:text-brand-800 hover:bg-brand-50/50 rounded-xl transition"
                >
                  + Lihat {vehicles.length - 3} Motor Lainnya →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent Bookings & History (Max 3 Items) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
            <h2 className="font-extrabold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 bg-brand-50 rounded-lg text-brand-700">
                <History className="h-4 w-4" />
              </span>
              <span>Riwayat Servis &amp; Booking Terakhir</span>
            </h2>
            <Link to="/customer/bookings" className="text-xs font-bold text-brand-700 hover:underline">
              Lihat Semua ({bookings.length})
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm space-y-2">
              <CheckCircle2 className="h-9 w-9 mx-auto text-slate-300" />
              <p>Belum ada riwayat booking.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 group">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{b.booking_code}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1.5">
                      {b.vehicle?.model} <span className="text-slate-500 font-normal">({b.vehicle?.no_polisi})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Jadwal: {b.slot?.tanggal} • Pukul {b.slot?.jam_mulai} WIB
                    </div>
                  </div>
                  <Link
                    to="/customer/bookings"
                    className="text-xs font-bold text-slate-500 hover:text-brand-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Rincian</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}

              {bookings.length > 3 && (
                <div className="pt-3 text-center">
                  <Link
                    to="/customer/bookings"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
                  >
                    <span>Lihat {bookings.length - 3} Riwayat Servis Lainnya</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
