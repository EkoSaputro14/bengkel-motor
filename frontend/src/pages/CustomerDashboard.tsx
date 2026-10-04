import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Booking, Vehicle } from '../types/api';
import { StatusBadge } from '../components/Badge';
import { Car, Calendar, Clock, PlusCircle, ArrowRight, CheckCircle2, History } from 'lucide-react';

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
        <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
      </div>
    );
  }

  const activeBooking = bookings.find((b) => b.status === 'CONFIRMED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Halo, {user?.nama} 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Kelola kendaraan dan jadwal perawatan motor Anda di sini.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/customer/vehicles"
            className="inline-flex items-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Car className="h-4 w-4 text-slate-500" />
            <span>Motor Saya ({vehicles.length})</span>
          </Link>
          <Link
            to="/customer/booking"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-semibold shadow-sm transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Booking Servis</span>
          </Link>
        </div>
      </div>

      {/* Active Booking Banner */}
      {activeBooking ? (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Booking Aktif Terkonfirmasi
              </span>
              <span className="text-emerald-300 font-mono text-sm">{activeBooking.booking_code}</span>
            </div>
            <h2 className="text-xl font-bold text-white pt-1">
              {activeBooking.vehicle?.model} ({activeBooking.vehicle?.no_polisi})
            </h2>
            <div className="text-emerald-200 text-sm flex items-center space-x-4 pt-1">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {activeBooking.slot?.tanggal}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Pukul {activeBooking.slot?.jam_mulai} WIB
              </span>
            </div>
            <p className="text-xs text-emerald-300 italic pt-1">Keluhan: "{activeBooking.keluhan}"</p>
          </div>
          <Link
            to="/customer/bookings"
            className="bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-sm transition self-stretch sm:self-auto text-center shadow"
          >
            Lihat Detail Booking
          </Link>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="font-bold text-red-900">Belum Ada Jadwal Servis Aktif</h2>
            <p className="text-xs text-red-700 mt-0.5">Jadwalkan servis rutin motor Anda agar performa selalu prima.</p>
          </div>
          <Link
            to="/customer/booking"
            className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition flex items-center space-x-1"
          >
            <span>Pesan Slot Sekarang</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Grid: Vehicles & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vehicles Column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 flex items-center space-x-2">
              <Car className="h-5 w-5 text-red-700" />
              <span>Kendaraan Terdaftar</span>
            </h2>
            <Link to="/customer/vehicles" className="text-xs font-semibold text-red-700 hover:underline">
              Kelola
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm space-y-2">
              <Car className="h-8 w-8 mx-auto text-slate-300" />
              <p>Belum ada motor yang didaftarkan.</p>
              <Link to="/customer/vehicles" className="text-red-700 text-xs font-semibold">
                + Daftarkan Motor
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div key={v.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{v.model}</div>
                    <div className="text-xs text-slate-500">{v.merk} • Tahun {v.tahun}</div>
                  </div>
                  <span className="bg-slate-900 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                    {v.no_polisi}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings & History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 flex items-center space-x-2">
              <History className="h-5 w-5 text-red-700" />
              <span>Riwayat Servis & Booking Terakhir</span>
            </h2>
            <Link to="/customer/bookings" className="text-xs font-semibold text-red-700 hover:underline">
              Lihat Semua
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm space-y-2">
              <CheckCircle2 className="h-8 w-8 mx-auto text-slate-300" />
              <p>Belum ada riwayat booking.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{b.booking_code}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="text-sm font-semibold text-slate-900 mt-1">
                      {b.vehicle?.model} ({b.vehicle?.no_polisi})
                    </div>
                    <div className="text-xs text-slate-500">
                      Jadwal: {b.slot?.tanggal} • Pukul {b.slot?.jam_mulai} WIB
                    </div>
                  </div>
                  <Link
                    to="/customer/bookings"
                    className="text-xs font-semibold text-slate-600 hover:text-red-700 flex items-center space-x-0.5"
                  >
                    <span>Rincian</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
