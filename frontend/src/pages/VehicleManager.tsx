import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Vehicle } from '../types/api';
import { Bike, Plus, Edit2, Trash2, AlertCircle, CheckCircle2, X } from 'lucide-react';

export const VehicleManager: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form fields
  const [noPolisi, setNoPolisi] = useState('');
  const [merk, setMerk] = useState('');
  const [model, setModel] = useState('');
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      if (res.data.status === 'success') {
        setVehicles(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAddModal = () => {
    setEditingVehicle(null);
    setNoPolisi('');
    setMerk('');
    setModel('');
    setTahun(new Date().getFullYear());
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setNoPolisi(v.no_polisi);
    setMerk(v.merk);
    setModel(v.model);
    setTahun(v.tahun);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      no_polisi: noPolisi.toUpperCase().trim(),
      merk: merk.trim(),
      model: model.trim(),
      tahun: Number(tahun),
    };

    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, payload);
        setSuccess('Data kendaraan berhasil diperbarui.');
      } else {
        await api.post('/vehicles', payload);
        setSuccess('Kendaraan baru berhasil didaftarkan.');
      }
      setIsModalOpen(false);
      fetchVehicles();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const firstErr = Object.values(err.response.data.errors)[0] as string[];
        setError(firstErr[0]);
      } else {
        setError(err.response?.data?.message || 'Gagal menyimpan data kendaraan.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (vehicleId: number, noPol: string) => {
    if (!window.confirm(`Yakin ingin menghapus kendaraan ${noPol}?`)) return;

    setError(null);
    try {
      await api.delete(`/vehicles/${vehicleId}`);
      setSuccess(`Kendaraan ${noPol} berhasil dihapus.`);
      fetchVehicles();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus kendaraan.');
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-600 focus:bg-white text-sm transition';
  const labelCls = 'block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-br from-brand-500 to-brand-800 text-white rounded-xl shadow-glow">
              <Bike className="h-5 w-5" />
            </span>
            <span>Manajemen Motor Saya</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Daftarkan motor Anda untuk memudahkan pemilihan unit saat booking servis.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold px-5 py-2.5 rounded-xl shadow-glow transition-all flex items-center gap-2 text-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Motor Baru</span>
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 ring-1 ring-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-sm flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Vehicle Grid */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin h-8 w-8 border-[3px] border-brand-200 border-t-brand-600 rounded-full" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-soft p-14 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 ring-1 ring-slate-200 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Bike className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">Belum Ada Kendaraan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Daftarkan nomor polisi, merk, dan model motor Anda untuk memulai booking servis berkala.
          </p>
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-glow transition active:scale-95"
          >
            + Tambah Motor Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="group bg-white p-6 rounded-3xl ring-1 ring-slate-900/5 shadow-soft hover:shadow-lift hover:-translate-y-1 hover:ring-brand-200/70 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-5">
                  <span className="bg-ink-950 text-white font-mono text-sm font-bold px-3 py-1.5 rounded-lg tracking-wide ring-1 ring-slate-700 shadow">
                    {v.no_polisi}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-full">
                    Tahun {v.tahun}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">{v.model}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{v.merk}</p>
              </div>

              <div className="pt-5 border-t border-slate-100 flex justify-end gap-2 mt-5">
                <button
                  onClick={() => openEditModal(v)}
                  className="p-2 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition active:scale-90"
                  title="Edit Motor"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(v.id, v.no_polisi)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition active:scale-90"
                  title="Hapus Motor"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editingVehicle ? 'Edit Data Motor' : 'Daftarkan Motor Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xl transition active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 ring-1 ring-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className={labelCls}>Nomor Polisi (Plat)</label>
                <input
                  type="text"
                  required
                  value={noPolisi}
                  onChange={(e) => setNoPolisi(e.target.value)}
                  placeholder="G 1234 ABC"
                  className="w-full px-4 py-2.5 rounded-xl bg-ink-950 text-white ring-1 ring-slate-700 focus:ring-2 focus:ring-brand-500 font-mono text-sm uppercase font-bold tracking-wider transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Merk</label>
                  <input
                    type="text"
                    required
                    value={merk}
                    onChange={(e) => setMerk(e.target.value)}
                    placeholder="Honda / Yamaha"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Tahun</label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Model / Tipe Motor</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Vario 160 / NMAX 155"
                  className={inputCls}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 ring-1 ring-slate-200 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl text-sm font-bold shadow-glow transition disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? 'Menyimpan...' : editingVehicle ? 'Simpan Perubahan' : 'Daftarkan Motor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
