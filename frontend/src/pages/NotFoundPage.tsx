import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
          <FileQuestion className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Halaman Tidak Ditemukan (404)</h1>
        <p className="text-sm text-slate-500">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
