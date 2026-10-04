import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Vehicle } from '../types/api';
import { Car, Plus, Edit2, Trash2, AlertCircle, CheckCircle2, X } from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Car className="h-6 w-6 text-red-700" />
            <span>Manajemen Motor Saya</span>
          </h1>
          <p className="text-sm text-slate-500">Daftarkan motor Anda untuk memudahkan pemilihan unit saat booking servis.</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-red-700 hover:bg-red-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Motor Baru</span>
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Vehicle Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Car className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Belum Ada Kendaraan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Daftarkan nomor polisi, merk, dan model motor Anda untuk memulai booking servis berkala.
          </p>
          <button
            onClick={openAddModal}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow transition"
          >
            + Tambah Motor Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-slate-900 text-white font-mono text-sm font-bold px-3 py-1.5 rounded-lg tracking-wide">
                    {v.no_polisi}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded">
                    Tahun {v.tahun}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{v.model}</h3>
                <p className="text-sm text-slate-500">{v.merk}</p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => openEditModal(v)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                  title="Edit Motor"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(v.id, v.no_polisi)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingVehicle ? 'Edit Data Motor' : 'Daftarkan Motor Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor Polisi (Plat)
                </label>
                <input
                  type="text"
                  required
                  value={noPolisi}
                  onChange={(e) => setNoPolisi(e.target.value)}
                  placeholder="G 1234 ABC"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm uppercase focus:ring-2 focus:ring-red-600 focus:border-transparent font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Merk
                  </label>
                  <input
                    type="text"
                    required
                    value={merk}
                    onChange={(e) => setMerk(e.target.value)}
                    placeholder="Honda / Yamaha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tahun Pembuatan
                  </label>
                  <input
                    type="number"
                    required
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Model / Tipe Motor
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Vario 160 / NMAX 155"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-semibold shadow transition disabled:opacity-50"
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
