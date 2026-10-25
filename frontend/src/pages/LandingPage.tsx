import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  Search,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Disc,
  Bike,
  Gauge
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const [noPolisi, setNoPolisi] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'matic' | 'bebek' | 'sport'>('matic');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (noPolisi.trim()) {
      navigate(`/history?no_polisi=${encodeURIComponent(noPolisi.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECEEF2] text-slate-900 selection:bg-red-500 selection:text-white pb-20">
      
      {/* ═══ TOP OPERATIONAL STRIP (Pill style like Gambar 1 - Responsive) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white/90 backdrop-blur-md border border-slate-300/80 rounded-2xl sm:rounded-full py-2.5 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2 shadow-sm text-xs">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center sm:text-left">
            <span className="font-extrabold tracking-wider uppercase flex items-center gap-1.5 text-slate-900 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Pit Servis Buka Hari Ini
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-600 font-medium whitespace-nowrap">08.00 - 17.00 WIB (Senin - Minggu)</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-600 text-center sm:text-right">
            <span className="flex items-center gap-1 font-medium whitespace-nowrap">
              <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
              <span>Jl. Raya Tegal - Slawi Km 5</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 font-medium whitespace-nowrap">
              <Phone className="h-3.5 w-3.5 text-slate-700 shrink-0" />
              <span className="font-mono font-bold text-slate-800">WA: 0812-3456-7890</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══ 1 SECTION REVIEW: HERO SECTION BERBASIS GAMBAR 1 (Aneesh N S) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative bg-[#ECEEF2] overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-300/60 shadow-sm">
          
          {/* Typographic Watermark Background khas Gambar 1 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[11vw] font-black text-slate-300/40 uppercase tracking-tighter whitespace-nowrap z-0">
            BENGKEL MOTOR
          </div>

          <div className="relative z-10 space-y-8">
            
            {/* Category Segmented Control (Estetik, Modern, Bebas Kusut) */}
            <div className="w-full max-w-xl mx-auto bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/70 shadow-inner">
              <div className="grid grid-cols-3 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('matic')}
                  className={`py-2 px-2 rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    selectedCategory === 'matic'
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Disc className={`h-4 w-4 shrink-0 ${selectedCategory === 'matic' ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className="tracking-tight">Matic</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">CVT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('bebek')}
                  className={`py-2 px-2 rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    selectedCategory === 'bebek'
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Bike className={`h-4 w-4 shrink-0 ${selectedCategory === 'bebek' ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className="tracking-tight">Bebek</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">Cub</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('sport')}
                  className={`py-2 px-2 rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    selectedCategory === 'sport'
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Gauge className={`h-4 w-4 shrink-0 ${selectedCategory === 'sport' ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className="tracking-tight">Sport</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">Manual</span>
                </button>
              </div>
            </div>

            {/* 3-Column Focal Layout khas Gambar 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* 1. Kolom Kiri: Metric Spesiikasi & Kapasitas Bengkel */}
              <div className="lg:col-span-3 space-y-6 text-left order-3 lg:order-1">
                <div className="border-l-2 border-slate-400 pl-4 space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-slate-950">
                    5 MOTOR
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Kapasitas Slot per Jam
                  </div>
                </div>

                <div className="border-l-2 border-slate-400 pl-4 space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-slate-950">
                    3 LIFT
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Pit Hidrolik Aktif
                  </div>
                </div>

                <div className="border-l-2 border-slate-400 pl-4 space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-slate-950">
                    7 HARI
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Garansi Pengerjaan Servis
                  </div>
                </div>

                <div className="border-l-2 border-slate-400 pl-4 space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-red-600">
                    0 MENIT
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Bebas Antrean Datang Pagi
                  </div>
                </div>
              </div>

              {/* 2. Kolom Tengah: Centerpiece Motor Focal & Plat Checker */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center order-2 lg:order-2">
                
                {/* Visual Focal Motor Nyata (Front 3/4 Serong ke Depan - Ukuran Pas & Dominan) */}
                <div className="relative w-full max-w-xl lg:max-w-2xl flex items-center justify-center py-2 sm:py-4">
                  <img
                    src="/images/motorcycle_matic_front.png"
                    alt="Motor Matic Showcase (Yamaha NMAX Turbo / Vario 160)"
                    className="w-full h-auto max-h-64 sm:max-h-76 md:max-h-88 object-contain filter drop-shadow-2xl relative z-10 transition-transform duration-300 hover:scale-105"
                  />
                  {/* Subtle realistic ground shadow underneath the bike */}
                  <div className="absolute bottom-1 sm:bottom-2 w-5/6 h-6 sm:h-7 bg-slate-950/25 rounded-full blur-xl pointer-events-none" />
                </div>

                {/* Form Pencarian Buku Logbook Plat Nomor (Responsive & Self-Contained) */}
                <div className="w-full max-w-md mt-6 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-2xl p-3.5 shadow-md space-y-2">
                  <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5 text-slate-500" />
                      CEK RIWAYAT SERVIS MOTOR
                    </span>
                    <span className="text-red-600 uppercase font-mono text-[10px] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-bold">
                      Buku Digital
                    </span>
                  </div>

                  <form onSubmit={handleSearch} className="relative flex items-center bg-slate-100 border border-slate-300 rounded-xl p-1 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900 transition-all shadow-inner">
                    <input
                      type="text"
                      required
                      value={noPolisi}
                      onChange={(e) => setNoPolisi(e.target.value)}
                      placeholder="G 1234 ABC"
                      className="w-full bg-transparent px-3 py-2 text-slate-950 placeholder:text-slate-400 font-mono font-black text-sm uppercase tracking-wider focus:outline-none min-w-0"
                    />
                    <button
                      type="submit"
                      className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 active:scale-95 shadow-sm"
                    >
                      <span>Cari</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* 3. Kolom Kanan: Conversion Stack & Tombol Booking Crimson Red */}
              <div className="lg:col-span-3 space-y-6 text-left order-1 lg:order-3">
                <div className="space-y-2">
                  <div className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-red-600 bg-red-100/80 px-2.5 py-0.5 rounded">
                    Sistem Booking Resmi
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                    SERVIS MOTOR TEPAT WAKTU.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Tentukan jam kedatangan Anda sendiri. Teknisi siap mengerjakan motor Anda langsung pada slot pit yang dijadwalkan.
                  </p>
                </div>

                {/* Tombol Merah Khas Gambar 1 */}
                <div className="space-y-3 pt-2">
                  {user ? (
                    <Link
                      to={user.role === 'ADMIN' ? '/admin' : user.role === 'MECHANIC' ? '/mechanic' : '/customer/booking'}
                      className="w-full bg-[#E51A1A] hover:bg-[#c91414] text-white font-black text-sm py-4 px-6 rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wider"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Booking Slot Servis</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="w-full bg-[#E51A1A] hover:bg-[#c91414] text-white font-black text-sm py-4 px-6 rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wider text-center"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Booking Servis Sekarang</span>
                      </Link>

                      <Link
                        to="/login"
                        className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 text-center"
                      >
                        <span>Sudah Punya Akun? Masuk</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-300/80 pt-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Auto-Confirm: Tanpa antre manual saat tiba di bengkel</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══ Akun Demo Pengujian Praktikum (Disimpan di Bawah untuk Evaluator) ═══ */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white/80 border border-slate-300 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Akun Pengujian Praktikum:</span>
            <span className="text-slate-500 font-mono">(Password: password123)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Customer: eko@bengkelmotor.test</span>
            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Mechanic: mechanic@bengkelmotor.test</span>
            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Admin: admin@bengkelmotor.test</span>
          </div>
        </div>
      </footer>

    </div>
  );
};