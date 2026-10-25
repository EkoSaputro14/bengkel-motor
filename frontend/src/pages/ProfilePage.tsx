import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Phone, Shield, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [nama, setNama] = useState(user?.nama || '');
  const [noHp, setNoHp] = useState(user?.no_hp || '');
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // If password is being changed, check confirmation
      if (passwordBaru && passwordBaru !== konfirmasiPassword) {
        setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
        setIsSaving(false);
        return;
      }

      // Simulation/API call
      await new Promise((res) => setTimeout(res, 600));
      setMessage({ type: 'success', text: 'Profil dan pengaturan berhasil diperbarui!' });
      setPasswordLama('');
      setPasswordBaru('');
      setKonfirmasiPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Gagal menyimpan perubahan profil.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700 uppercase tracking-widest mb-1">
          Pengaturan Akun
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Profil &amp; Keamanan Akun
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola informasi identitas, nomor kontak WhatsApp, dan kata sandi Anda.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
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

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Identitas Diri */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-5">
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-5 w-5 text-brand-600" />
            <span>Informasi Pribadi</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="081234567890"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email (Akun Utama)
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-sm bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Email tidak dapat diubah karena terikat dengan riwayat servis.</span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Role Akses
              </label>
              <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                <Shield className="h-4 w-4 text-brand-600" />
                <span>{user?.role || 'PELANGGAN'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Keamanan & Kata Sandi */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-5">
          <h2 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="h-5 w-5 text-indigo-600" />
            <span>Ganti Kata Sandi (Opsional)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password Lama
              </label>
              <input
                type="password"
                value={passwordLama}
                onChange={(e) => setPasswordLama(e.target.value)}
                placeholder="Masukkan password lama..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password Baru
              </label>
              <input
                type="password"
                value={passwordBaru}
                onChange={(e) => setPasswordBaru(e.target.value)}
                placeholder="Minimal 8 karakter..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ulangi Password Baru
              </label>
              <input
                type="password"
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                placeholder="Konfirmasi password baru..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};