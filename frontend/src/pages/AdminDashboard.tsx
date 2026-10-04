import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { StatusBadge } from '../components/Badge';
import { Users, Car, Calendar, CheckCircle2, TrendingUp, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/bookings'),
        ]);
        if (statsRes.data.status === 'success') setStats(statsRes.data.data);
        if (bookRes.data.status === 'success') setBookings(bookRes.data.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
      </div>
    );
  }

  const counts = stats?.counts || {};
  const occupancy = stats?.today_occupancy || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Operasional Bengkel</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pemantauan real-time kapasitas, reservasi, dan performa teknis.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/admin/slots"
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-semibold shadow transition"
          >
            + Kelola Slot Harian
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Pelanggan Aktif</div>
            <div className="text-2xl font-bold text-slate-900">{counts.total_customers || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Kendaraan</div>
            <div className="text-2xl font-bold text-slate-900">{counts.total_vehicles || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Servis Selesai</div>
            <div className="text-2xl font-bold text-slate-900">{counts.completed_bookings || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Total Booking Masuk</div>
            <div className="text-2xl font-bold text-slate-900">{counts.total_bookings || 0}</div>
          </div>
        </div>
      </div>

      {/* Occupancy Today Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Kapasitas Hari Ini</span>
            <h3 className="text-xl font-bold mt-1">Okupansi Slot Servis ({occupancy.date})</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-red-400">{occupancy.occupancy_rate}%</div>
            <div className="text-xs text-slate-400">Terisi ({occupancy.total_occupied} / {occupancy.total_capacity} slot)</div>
          </div>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-red-500 transition-all duration-500"
            style={{ width: `${Math.min(100, occupancy.occupancy_rate || 0)}%` }}
          />
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-lg">Seluruh Data Booking Masuk</h3>
          <span className="text-xs text-slate-500">Menampilkan {bookings.length} data</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Kode Booking</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4">Jadwal Slot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Keluhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.booking_code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{b.user?.nama}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900">{b.vehicle?.no_polisi}</span>
                    <span className="block text-[11px] text-slate-400">{b.vehicle?.model}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>{b.slot?.tanggal}</div>
                    <div className="text-slate-400 font-mono">{b.slot?.jam_mulai} WIB</div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">{b.keluhan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
