import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import type { ServiceRecord } from '../types/api';
import { Search, Wrench, Calendar, Gauge, PackageCheck, User, ShieldCheck } from 'lucide-react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-md">
          <ShieldCheck className="h-4 w-4" />
          <span>Buku Rekam Servis Digital (Digital Service Logbook)</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Pelacakan Riwayat Servis Motor</h1>
        <p className="text-sm text-slate-500">
          Masukkan nomor polisi motor Anda untuk melihat rekam jejak penggantian sparepart, oli, dan catatan mekanik.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex rounded-2xl bg-white p-2 border border-slate-300 shadow-md">
          <div className="relative flex-grow flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400 mr-2" />
            <input
              type="text"
              required
              value={noPolisi}
              onChange={(e) => setNoPolisi(e.target.value)}
              placeholder="Nomor Polisi (contoh: G 1234 ABC)"
              className="w-full text-slate-900 font-mono text-base uppercase font-bold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow transition disabled:opacity-50"
          >
            {isLoading ? 'Mencari...' : 'Cari Riwayat'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
        </div>
      ) : hasSearched && records.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm space-y-2">
          <Wrench className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">Belum ada data rekam servis untuk plat {noPolisi.toUpperCase()}</p>
          <p className="text-xs text-slate-400">Pastikan nomor polisi benar atau kendaraan telah menyelesaikan servis pertama.</p>
        </div>
      ) : records.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-center shadow">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Hasil Pencarian Kendaraan:</div>
              <div className="text-2xl font-mono font-bold text-red-400">{noPolisi.toUpperCase()}</div>
              <div className="text-xs text-slate-300 mt-0.5">
                {records[0].booking?.vehicle?.model} ({records[0].booking?.vehicle?.merk} - {records[0].booking?.vehicle?.tahun})
              </div>
            </div>
            <div className="text-right">
              <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold">
                {records.length} Riwayat Servis
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-red-200 ml-4 pl-6 space-y-8">
            {records.map((r, idx) => (
              <div key={r.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-red-700 rounded-full ring-4 ring-white shadow" />

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-900">
                          {r.booking?.slot?.tanggal} • {r.booking?.slot?.jam_mulai} WIB
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        Kode: {r.booking?.booking_code}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-slate-100 text-slate-800 px-3 py-1 rounded-lg text-xs font-bold">
                      <Gauge className="h-4 w-4 text-red-700" />
                      <span>{r.odometer_km.toLocaleString('id-ID')} KM</span>
                    </div>
                  </div>

                  {/* Actions Performed */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Tindakan Servis & Perbaikan:
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                      {r.tindakan}
                    </p>
                  </div>

                  {/* Spare Parts */}
                  {r.suku_cadang && r.suku_cadang.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
                        <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Suku Cadang & Pelumas yang Diganti:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {r.suku_cadang.map((part, pIdx) => (
                          <div
                            key={pIdx}
                            className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded-xl text-xs flex justify-between items-center"
                          >
                            <div>
                              <span className="font-bold text-emerald-950">{part.nama}</span>
                              {part.keterangan && (
                                <span className="block text-[11px] text-emerald-700">{part.keterangan}</span>
                              )}
                            </div>
                            <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded text-[11px]">
                              {part.qty}x
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mechanic Notes & Footer */}
                  <div className="pt-2 flex flex-wrap justify-between items-center text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center space-x-1">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Mekanik: <b>{r.mechanic?.nama || 'Teknisi Bengkel'}</b></span>
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
