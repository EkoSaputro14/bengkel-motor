import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl ring-1 ring-slate-900/5 shadow-soft space-y-5 animate-fade-up">
        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 ring-1 ring-slate-200 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="h-8 w-8" />
        </div>
        <div>
          <div className="text-5xl font-extrabold text-gradient tracking-tight">404</div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-2">Halaman Tidak Ditemukan</h1>
          <p className="text-sm text-slate-500 mt-2">
            Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-glow transition active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
