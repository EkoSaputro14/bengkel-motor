import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Wrench, LogIn, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        login(token, user);

        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else if (user.role === 'MECHANIC') {
          navigate('/mechanic');
        } else {
          navigate('/customer');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="inline-flex bg-red-700 text-white p-3 rounded-2xl mb-3 shadow">
            <Wrench className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Masuk ke Akun Anda</h2>
          <p className="text-sm text-slate-500 mt-1">Layanan Bengkel Motor Digital Kelompok 2</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
                <LogIn className="h-4 w-4" />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>

        {/* Quick fill buttons */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-400 font-medium mb-2 text-center">Login Cepat Akun Demo:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickFill('eko@bengkelmotor.test')}
              className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition text-center"
            >
              Pelanggan
            </button>
            <button
              type="button"
              onClick={() => quickFill('mechanic@bengkelmotor.test')}
              className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold transition text-center"
            >
              Mekanik
            </button>
            <button
              type="button"
              onClick={() => quickFill('admin@bengkelmotor.test')}
              className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition text-center"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-slate-600">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-red-700 hover:text-red-800">
            Daftar Pelanggan
          </Link>
        </div>
      </div>
    </div>
  );
};
