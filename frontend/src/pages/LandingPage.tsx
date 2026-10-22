import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Calendar, ShieldCheck, Clock, Search, ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';
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
    <div className="space-y-20 pb-20">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden bg-ink-950 text-white pb-24 pt-28 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] sm:rounded-b-[3.5rem]">
        {/* Ambient gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-24 w-[480px] h-[480px] bg-brand-600/30 rounded-full blur-[130px] animate-float" />
          <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] bg-indigo-600/25 rounded-full blur-[140px] animate-float" style={{ animationDelay: '2.5s' }} />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-brand-500/15 rounded-full blur-[110px]" />
          {/* Fine grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 glass ring-1 ring-white/15 px-4 py-1.5 rounded-full text-xs font-semibold text-red-200 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sistem Informasi Layanan Bengkel Motor</span>
            <span className="w-1 h-1 rounded-full bg-red-400/70" />
            <span className="hidden sm:inline">RESTful API Laravel 12</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] animate-fade-up" style={{ animationDelay: '0.08s' }}>
            Penjadwalan Servis Instan &amp; <br className="hidden sm:block" />
            <span className="text-gradient">Digital Logbook Riwayat Motor</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.16s' }}>
            Hindari antrean panjang di bengkel dengan sistem reservasi <b className="text-slate-200">Auto-Confirm</b>. Pantau rekam jejak penggantian oli, sparepart, dan tindakan servis motor Anda secara digital.
          </p>

          {/* Quick License Plate Search */}
          <div className="pt-4 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: '0.24s' }}>
            <form onSubmit={handleSearch} className="flex rounded-2xl glass ring-1 ring-white/15 p-2 shadow-2xl shadow-black/40 focus-within:ring-brand-500/50 focus-within:bg-white/10 transition-all duration-300">
              <div className="relative flex-grow flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400 mr-2.5" />
                <input
                  type="text"
                  value={noPolisi}
                  onChange={(e) => setNoPolisi(e.target.value)}
                  placeholder="Cek riwayat servis (contoh: G 1234 ABC)"
                  className="w-full text-white placeholder:text-slate-500 text-sm focus:outline-none uppercase font-semibold bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 shadow-glow active:scale-95"
              >
                <span>Cari</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.32s' }}>
            {user ? (
              <Link
                to={user.role === 'ADMIN' ? '/admin' : user.role === 'MECHANIC' ? '/mechanic' : '/customer'}
                className="group bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-glow transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                Buka Dashboard Saya
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-glow transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  Daftar Sekarang
                </Link>
                <Link
                  to="/login"
                  className="glass hover:bg-white/15 text-white font-semibold px-8 py-3.5 rounded-2xl ring-1 ring-white/20 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  Masuk Akun
                </Link>
              </>
            )}
          </div>

          {/* Trust strip */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-slate-400 text-xs font-medium animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-brand-400" /> Booking Auto-Confirm</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Logbook Digital Permanen</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-400" /> Real-time Slot Kuota</span>
          </div>
        </div>
      </section>

      {/* ═══ Feature Cards ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-[0.2em] bg-brand-50 ring-1 ring-brand-100 px-3.5 py-1.5 rounded-full">
            Kenapa Kami
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Keunggulan Layanan <span className="text-gradient">Bengkel Digital</span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Dirancang untuk mempermudah pelanggan, teknisi bengkel, dan manajemen operasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Calendar className="h-6 w-6" />,
              iconBg: 'from-brand-500 to-brand-700 shadow-glow',
              title: 'Auto-Confirm Booking',
              desc: 'Pilih slot jam servis yang tersedia secara real-time. Booking otomatis terkonfirmasi tanpa harus menunggu konfirmasi manual admin.',
            },
            {
              icon: <ShieldCheck className="h-6 w-6" />,
              iconBg: 'from-blue-500 to-indigo-600 shadow-blue-500/30',
              title: 'Digital Service Logbook',
              desc: 'Catatan odometer, tindakan mekanik, dan suku cadang tersimpan permanen berbasis nomor polisi kendaraan. Bebas dari risiko nota hilang.',
            },
            {
              icon: <Clock className="h-6 w-6" />,
              iconBg: 'from-amber-500 to-orange-600 shadow-amber-500/30',
              title: 'Tablet Logbook Mekanik',
              desc: 'Antarmuka ramah sentuhan untuk mekanik bengkel guna melihat antrean motor yang siap dikerjakan dan langsung mencatat resep perbaikan.',
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group relative bg-white/80 backdrop-blur p-8 rounded-3xl ring-1 ring-slate-900/5 shadow-soft hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-13 h-13 w-14 h-14 bg-gradient-to-br ${f.iconBg} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Demo Accounts Callout ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-ink-950 rounded-3xl p-8 sm:p-10 shadow-lift">
          <div className="absolute -top-20 right-0 w-72 h-72 bg-brand-600/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2.5 text-white font-bold text-lg mb-6">
              <span className="bg-emerald-500/15 ring-1 ring-emerald-400/30 p-1.5 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </span>
              <span>Akun Demo Pengujian &amp; Praktikum:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {[
                { label: 'Pelanggan (Customer)', color: 'text-blue-300', email: 'eko@bengkelmotor.test' },
                { label: 'Mekanik (Mechanic)', color: 'text-amber-300', email: 'mechanic@bengkelmotor.test' },
                { label: 'Admin Bengkel', color: 'text-red-300', email: 'admin@bengkelmotor.test' },
              ].map((acc) => (
                <div key={acc.email} className="glass ring-1 ring-white/10 p-5 rounded-2xl space-y-1.5 hover:bg-white/10 transition-colors">
                  <div className={`font-bold ${acc.color} mb-2 text-sm`}>{acc.label}</div>
                  <div className="text-slate-400">Email: <code className="bg-white/10 text-slate-200 px-1.5 py-0.5 rounded-md font-mono">{acc.email}</code></div>
                  <div className="text-slate-400">Password: <code className="bg-white/10 text-slate-200 px-1.5 py-0.5 rounded-md font-mono">password123</code></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
