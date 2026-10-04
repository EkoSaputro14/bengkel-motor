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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center space-x-2">
          <Users className="h-6 w-6 text-red-700" />
          <span>Manajemen Akun Pengguna</span>
        </h1>
        <p className="text-sm text-slate-500">Daftar seluruh akun pelanggan, teknisi/mekanik, dan admin bengkel.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200 w-full sm:w-auto">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, atau no HP..."
            className="w-full bg-transparent text-xs focus:outline-none"
          />
          <button type="submit" className="text-xs font-bold text-red-700 px-2 py-1">
            Cari
          </button>
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold"
          >
            <option value="">Semua Role</option>
            <option value="CUSTOMER">Pelanggan (CUSTOMER)</option>
            <option value="MECHANIC">Mekanik (MECHANIC)</option>
            <option value="ADMIN">Admin (ADMIN)</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-red-700 rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Kontak</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Jumlah Motor</th>
                  <th className="py-3 px-4">Jumlah Booking</th>
                  <th className="py-3 px-4">Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.nama}</td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="flex items-center space-x-1 text-slate-700 font-medium">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{u.no_hp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {u.role === 'CUSTOMER' ? u.vehicles_count ?? 0 : '-'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {u.role === 'CUSTOMER' ? u.bookings_count ?? 0 : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
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
