import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Wrench, UserPlus, AlertCircle, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        nama,
        email,
        no_hp: noHp,
        password,
        role: 'CUSTOMER',
      });

      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        login(token, user);
        navigate('/customer');
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0] as string[];
        setError(firstError[0] || 'Registrasi gagal.');
      } else {
        setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi nanti.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-600 focus:bg-white text-sm transition';
  const labelCls = 'block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-lift ring-1 ring-slate-900/5 animate-scale-in">
        {/* Left — brand panel */}
        <div className="relative hidden lg:flex flex-col justify-between bg-ink-950 p-10 text-white overflow-hidden">
          <div className="absolute -bottom-24 -left-16 w-96 h-96 bg-brand-600/30 rounded-full blur-[110px] animate-float" />
          <div className="absolute top-0 -right-20 w-80 h-80 bg-indigo-600/25 rounded-full blur-[110px]" />

          <div className="relative flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-brand-500 to-brand-800 p-2.5 rounded-xl shadow-glow">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Bengkel<span className="text-gradient">Motor</span>
            </span>
          </div>

          <div className="relative space-y-5">
            <h2 className="text-3xl font-extrabold leading-snug">
              Satu Akun untuk <br />
              <span className="text-gradient">Semua Kebutuhan Servis</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Daftarkan motor Anda, pilih slot servis secara real-time, dan simpan seluruh riwayat perawatan secara digital.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Gratis Daftar</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-400" /> Auto-Confirm</span>
            </div>
          </div>

          <div className="relative text-[11px] text-slate-600">© 2026 BengkelMotor — Kelompok 2</div>
        </div>

        {/* Right — form */}
        <div className="bg-white p-8 sm:p-12 space-y-7">
          <div className="text-center">
            <div className="lg:hidden inline-flex bg-gradient-to-br from-brand-500 to-brand-800 text-white p-3 rounded-2xl mb-3 shadow-glow">
              <Wrench className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Daftar Akun Pelanggan</h2>
            <p className="text-sm text-slate-500 mt-1">Dapatkan kemudahan booking servis dan digital logbook motor</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-sm flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className={labelCls}>Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" required value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Eko Saputro" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Nomor HP / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="tel" required value={noHp} onChange={(e) => setNoHp(e.target.value)} placeholder="081234567890" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={inputCls}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-3 rounded-xl shadow-glow transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar Sekarang</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-0.5 group">
              Masuk ke Akun
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
