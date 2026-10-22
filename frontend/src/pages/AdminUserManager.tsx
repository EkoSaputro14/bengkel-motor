import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { User } from '../types/api';
import { RoleBadge } from '../components/Badge';
import { Users, Search, Phone, Mail } from 'lucide-react';

export const AdminUserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      let url = '/admin/users?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (roleFilter) url += `role=${encodeURIComponent(roleFilter)}`;

      const res = await api.get(url);
      if (res.data.status === 'success') {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <span className="p-2 bg-gradient-to-br from-brand-500 to-brand-800 text-white rounded-xl shadow-glow">
            <Users className="h-5 w-5" />
          </span>
          <span>Manajemen Akun Pengguna</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">Daftar seluruh akun pelanggan, teknisi/mekanik, dan admin bengkel.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl ring-1 ring-slate-900/5 shadow-soft flex flex-col sm:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center bg-slate-50 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-600 rounded-xl px-3.5 py-2 w-full sm:w-auto transition-all">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau no HP..."
            className="w-full bg-transparent text-xs focus:outline-none"
          />
          <button type="submit" className="text-xs font-bold text-brand-700 px-2 py-1 hover:underline">
            Cari
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-600 rounded-xl text-xs font-bold transition"
          >
            <option value="">Semua Role</option>
            <option value="CUSTOMER">Pelanggan (CUSTOMER)</option>
            <option value="MECHANIC">Mekanik (MECHANIC)</option>
            <option value="ADMIN">Admin (ADMIN)</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin h-8 w-8 border-[3px] border-brand-200 border-t-brand-600 rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Nama Lengkap</th>
                  <th className="py-3.5 px-5">Kontak</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Jumlah Motor</th>
                  <th className="py-3.5 px-5">Jumlah Booking</th>
                  <th className="py-3.5 px-5">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{u.nama}</td>
                    <td className="py-3.5 px-5 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{u.no_hp}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-800">
                      {u.role === 'CUSTOMER' ? u.vehicles_count ?? 0 : '-'}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-800">
                      {u.role === 'CUSTOMER' ? u.bookings_count ?? 0 : '-'}
                    </td>
                    <td className="py-3.5 px-5 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
