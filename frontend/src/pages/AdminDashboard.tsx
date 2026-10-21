import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { StatusBadge } from '../components/Badge';
import { Users, Bike, Calendar, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

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
      <div className="py-16 flex justify-center">
        <div className="animate-spin h-8 w-8 border-[3px] border-brand-200 border-t-brand-600 rounded-full" />
      </div>
    );
  }

  const counts = stats?.counts || {};
  const occupancy = stats?.today_occupancy || {};

  const metrics = [
    { label: 'Pelanggan Aktif', value: counts.total_customers || 0, icon: <Users className="h-6 w-6" />, iconBg: 'from-blue-500 to-indigo-600 shadow-blue-500/30' },
    { label: 'Total Kendaraan', value: counts.total_vehicles || 0, icon: <Bike className="h-6 w-6" />, iconBg: 'from-amber-500 to-orange-600 shadow-amber-500/30' },
    { label: 'Servis Selesai', value: counts.completed_bookings || 0, icon: <CheckCircle2 className="h-6 w-6" />, iconBg: 'from-emerald-500 to-teal-600 shadow-emerald-500/30' },
    { label: 'Total Booking Masuk', value: counts.total_bookings || 0, icon: <TrendingUp className="h-6 w-6" />, iconBg: 'from-brand-500 to-brand-700 shadow-glow' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700 uppercase tracking-widest mb-1">
            Panel Admin
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Operasional Bengkel</h1>
          <p className="text-sm text-slate-500 mt-1">Pemantauan real-time kapasitas, reservasi, dan performa teknis.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/slots"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl text-sm font-bold shadow-glow transition-all active:scale-95"
          >
            + Kelola Slot Harian
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="bg-white p-5 rounded-3xl ring-1 ring-slate-900/5 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 animate-fade-up"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className={`p-3 bg-gradient-to-br ${m.iconBg} text-white rounded-2xl shadow-lg flex-shrink-0`}>
              {m.icon}
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">{m.label}</div>
              <div className="text-2xl font-extrabold tracking-tight text-slate-900">{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Occupancy Today Card */}
      <div className="relative overflow-hidden bg-ink-950 text-white p-6 sm:p-7 rounded-3xl shadow-lift space-y-5">
        <div className="absolute -top-20 right-16 w-80 h-80 bg-brand-600/25 rounded-full blur-[110px] pointer-events-none" />
        <div className="relative flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Kapasitas Hari Ini</span>
            <h3 className="text-xl font-extrabold mt-1">Okupansi Slot Servis ({occupancy.date})</h3>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono text-gradient">{occupancy.occupancy_rate}%</div>
            <div className="text-xs text-slate-400 mt-0.5">Terisi ({occupancy.total_occupied} / {occupancy.total_capacity} slot)</div>
          </div>
        </div>

        <div className="relative w-full bg-slate-800/80 rounded-full h-3 overflow-hidden ring-1 ring-slate-700">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 shadow-glow transition-all duration-700"
            style={{ width: `${Math.min(100, occupancy.occupancy_rate || 0)}%` }}
          />
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-soft overflow-hidden">
        <div className="flex flex-wrap justify-between items-center border-b border-slate-100 px-6 py-4">
          <h3 className="font-extrabold text-slate-900 text-lg">Seluruh Data Booking Masuk</h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {bookings.length} data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Kode Booking</th>
                <th className="py-3.5 px-5">Pelanggan</th>
                <th className="py-3.5 px-5">Kendaraan</th>
                <th className="py-3.5 px-5">Jadwal Slot</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Keluhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{b.booking_code}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-800">{b.user?.nama}</td>
                  <td className="py-3.5 px-5">
                    <span className="font-mono font-bold text-slate-900">{b.vehicle?.no_polisi}</span>
                    <span className="block text-[11px] text-slate-400">{b.vehicle?.model}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div>{b.slot?.tanggal}</div>
                    <div className="text-slate-400 font-mono">{b.slot?.jam_mulai} WIB</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-3.5 px-5 max-w-xs truncate">{b.keluhan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
