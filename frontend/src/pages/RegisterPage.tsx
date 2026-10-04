import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Wrench, UserPlus, AlertCircle } from 'lucide-react';

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

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="inline-flex bg-red-700 text-white p-3 rounded-2xl mb-3 shadow">
            <Wrench className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Daftar Akun Pelanggan</h2>
          <p className="text-sm text-slate-500 mt-1">Dapatkan kemudahan booking servis dan digital logbook motor</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Eko Saputro"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor HP / WhatsApp</label>
            <input
              type="tel"
              required
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 rounded-xl shadow transition flex items-center justify-center space-x-2 disabled:opacity-50"
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
          <Link to="/login" className="font-semibold text-red-700 hover:text-red-800">
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </div>
  );
};
