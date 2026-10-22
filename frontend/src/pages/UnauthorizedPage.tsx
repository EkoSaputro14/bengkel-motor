import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-5 animate-fade-up">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-50 ring-1 ring-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <div className="text-5xl font-extrabold text-gradient tracking-tight">403</div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-2">Akses Ditolak</h1>
          <p className="text-sm text-slate-500 mt-2">
            Anda tidak memiliki hak akses yang cukup untuk membuka halaman atau resource ini.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-ink-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-slate-900/20 transition active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
