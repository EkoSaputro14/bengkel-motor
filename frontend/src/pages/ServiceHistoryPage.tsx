import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import type { ServiceRecord } from '../types/api';
import { Search, Wrench, Calendar, Gauge, PackageCheck, User, ShieldCheck, Bike } from 'lucide-react';

export const ServiceHistoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [noPolisi, setNoPolisi] = useState(searchParams.get('no_polisi') || '');
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchHistory = async (plateQuery: string) => {
    if (!plateQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/service-history?no_polisi=${encodeURIComponent(plateQuery.trim())}`);
      if (res.data.status === 'success') {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load history', err);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('no_polisi');
    if (query) {
      setNoPolisi(query);
      fetchHistory(query);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noPolisi.trim()) {
      setSearchParams({ no_polisi: noPolisi.trim().toUpperCase() });
      fetchHistory(noPolisi);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 ring-1 ring-brand-100 text-brand-800 text-xs font-bold px-3 py-1 rounded-full">
          <ShieldCheck className="h-4 w-4" />
          <span>Buku Rekam Servis Digital (Digital Service Logbook)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Pelacakan <span className="text-gradient">Riwayat Servis</span> Motor
        </h1>
        <p className="text-sm text-slate-500">
          Masukkan nomor polisi motor Anda untuk melihat rekam jejak penggantian sparepart, oli, dan catatan mekanik.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex rounded-2xl bg-white p-2 ring-1 ring-slate-200 shadow-soft focus-within:ring-2 focus-within:ring-brand-600 transition-all">
          <div className="relative flex-grow flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400 mr-2.5" />
            <input
              type="text"
              required
              value={noPolisi}
              onChange={(e) => setNoPolisi(e.target.value)}
              placeholder="Nomor Polisi (contoh: G 1234 ABC)"
              className="w-full text-slate-900 font-mono text-base uppercase font-bold focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-glow transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Mencari...' : 'Cari Riwayat'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin h-8 w-8 border-[3px] border-brand-200 border-t-brand-600 rounded-full" />
        </div>
      ) : hasSearched && records.length === 0 ? (
        <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-soft p-14 text-center text-slate-500 text-sm space-y-2">
          <Wrench className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700">Belum ada data rekam servis untuk plat {noPolisi.toUpperCase()}</p>
          <p className="text-xs text-slate-400">Pastikan nomor polisi benar atau kendaraan telah menyelesaikan servis pertama.</p>
        </div>
      ) : records.length > 0 ? (
        <div className="space-y-6">
          <div className="relative overflow-hidden bg-ink-950 text-white p-6 sm:p-7 rounded-3xl shadow-lift flex flex-wrap justify-between items-center gap-4">
            <div className="absolute -top-20 right-10 w-72 h-72 bg-brand-600/25 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative">
              <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Hasil Pencarian Kendaraan:</div>
              <div className="text-3xl font-mono font-extrabold text-gradient tracking-wider">{noPolisi.toUpperCase()}</div>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <Bike className="h-3.5 w-3.5" />
                {records[0].booking?.vehicle?.model} ({records[0].booking?.vehicle?.merk} - {records[0].booking?.vehicle?.tahun})
              </div>
            </div>
            <div className="relative">
              <span className="bg-emerald-500/15 ring-1 ring-emerald-400/40 text-emerald-300 text-xs px-3.5 py-1.5 rounded-full font-bold">
                {records.length} Riwayat Servis
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-brand-200 ml-4 pl-6 space-y-8">
            {records.map((r) => (
              <div key={r.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-2 w-4 h-4 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full ring-4 ring-white shadow" />

                <div className="bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft hover:shadow-lift transition-shadow space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-900">
                          {r.booking?.slot?.tanggal} • {r.booking?.slot?.jam_mulai} WIB
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">
                        Kode: {r.booking?.booking_code}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-50 ring-1 ring-slate-200 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold">
                      <Gauge className="h-4 w-4 text-brand-600" />
                      <span>{r.odometer_km.toLocaleString('id-ID')} KM</span>
                    </div>
                  </div>

                  {/* Actions Performed */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Tindakan Servis &amp; Perbaikan:
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/80 ring-1 ring-slate-100 p-3.5 rounded-2xl font-medium">
                      {r.tindakan}
                    </p>
                  </div>

                  {/* Spare Parts */}
                  {r.suku_cadang && r.suku_cadang.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Suku Cadang &amp; Pelumas yang Diganti:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {r.suku_cadang.map((part, pIdx) => (
                          <div
                            key={pIdx}
                            className="bg-emerald-50/70 ring-1 ring-emerald-200/70 p-3 rounded-2xl text-xs flex justify-between items-center"
                          >
                            <div>
                              <span className="font-bold text-emerald-950">{part.nama}</span>
                              {part.keterangan && (
                                <span className="block text-[11px] text-emerald-700 mt-0.5">{part.keterangan}</span>
                              )}
                            </div>
                            <span className="bg-emerald-200/80 text-emerald-900 font-bold px-2.5 py-1 rounded-lg text-[11px] flex-shrink-0 ml-2">
                              {part.qty}x
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mechanic Notes & Footer */}
                  <div className="pt-3 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Mekanik: <b className="text-slate-700">{r.mechanic?.nama || 'Teknisi Bengkel'}</b></span>
                    </div>
                    {r.catatan_mekanik && (
                      <span className="italic text-slate-600">Catatan: "{r.catatan_mekanik}"</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
