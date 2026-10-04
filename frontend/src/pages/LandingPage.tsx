import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Calendar, ShieldCheck, Clock, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const [noPolisi, setNoPolisi] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (noPolisi.trim()) {
      navigate(`/history?no_polisi=${encodeURIComponent(noPolisi.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-red-900/60 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold text-red-200">
            <span>Sistem Informasi Layanan Bengkel Motor</span>
            <span>•</span>
            <span>RESTful API Laravel 12</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Penjadwalan Servis Instan & <br />
            <span className="text-red-400">Digital Logbook Riwayat Motor</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Hindari antrean panjang di bengkel dengan sistem reservasi <b>Auto-Confirm</b>. Pantau rekam jejak penggantian oli, sparepart, dan tindakan servis motor Anda secara digital.
          </p>

          {/* Quick License Plate Search */}
          <div className="pt-4 max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="flex rounded-xl bg-white p-1.5 shadow-2xl">
              <div className="relative flex-grow flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400 mr-2" />
                <input
                  type="text"
                  value={noPolisi}
                  onChange={(e) => setNoPolisi(e.target.value)}
                  placeholder="Cek riwayat servis plat motor (contoh: G 1234 ABC)"
                  className="w-full text-slate-900 text-sm focus:outline-none uppercase font-semibold"
                />
              </div>
              <button
                type="submit"
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center space-x-1"
              >
                <span>Cari</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="pt-6 flex justify-center space-x-4">
            {user ? (
              <Link
                to={user.role === 'ADMIN' ? '/admin' : user.role === 'MECHANIC' ? '/mechanic' : '/customer'}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
              >
                Buka Dashboard Saya
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
                >
                  Daftar Sekarang
                </Link>
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur transition border border-white/20"
                >
                  Masuk Akun
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Keunggulan Layanan Bengkel Digital</h2>
          <p className="text-slate-600 mt-2">Dirancang untuk mempermudah pelanggan, teknisi bengkel, dan manajemen operasional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center mb-5">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Auto-Confirm Booking</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pilih slot jam servis yang tersedia secara real-time. Booking otomatis terkonfirmasi tanpa harus menunggu konfirmasi manual admin.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Service Logbook</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Catatan odometer, tindakan mekanik, dan suku cadang tersimpan permanen berbasis nomor polisi kendaraan. Bebas dari risiko nota hilang.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-5">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tablet Logbook Mekanik</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Antarmuka ramah sentuhan untuk mekanik bengkel guna melihat antrean motor yang siap dikerjakan dan langsung mencatat resep perbaikan.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Accounts Callout for Testing */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 border border-slate-300 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-base mb-4">
            <CheckCircle2 className="h-5 w-5 text-red-700" />
            <span>Akun Demo Pengujian & Praktikum:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="font-bold text-blue-800 mb-1">Pelanggan (Customer)</div>
              <div>Email: <code className="bg-slate-100 px-1">eko@bengkelmotor.test</code></div>
              <div>Password: <code className="bg-slate-100 px-1">password123</code></div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="font-bold text-amber-800 mb-1">Mekanik (Mechanic)</div>
              <div>Email: <code className="bg-slate-100 px-1">mechanic@bengkelmotor.test</code></div>
              <div>Password: <code className="bg-slate-100 px-1">password123</code></div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="font-bold text-red-800 mb-1">Admin Bengkel</div>
              <div>Email: <code className="bg-slate-100 px-1">admin@bengkelmotor.test</code></div>
              <div>Password: <code className="bg-slate-100 px-1">password123</code></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
