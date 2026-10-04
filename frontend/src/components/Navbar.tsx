import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Calendar, Car, History, Users, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">ADMIN</span>;
      case 'MECHANIC':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">MEKANIK</span>;
      case 'CUSTOMER':
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">PELANGGAN</span>;
      default:
        return null;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-red-700 text-white p-2 rounded-lg shadow-sm">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Bengkel<span className="text-red-700">Motor</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'CUSTOMER' && (
                  <>
                    <Link
                      to="/customer"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/customer') ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/customer/vehicles"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/customer/vehicles') ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Car className="h-4 w-4" />
                      <span>Motor Saya</span>
                    </Link>
                    <Link
                      to="/customer/booking"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/customer/booking') ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Booking Servis</span>
                    </Link>
                  </>
                )}

                {user.role === 'MECHANIC' && (
                  <Link
                    to="/mechanic"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive('/mechanic') ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Wrench className="h-4 w-4" />
                    <span>Antrean Servis</span>
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/admin') ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Ringkasan</span>
                    </Link>
                    <Link
                      to="/admin/slots"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/admin/slots') ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Kelola Slot</span>
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive('/admin/users') ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      <span>Pengguna</span>
                    </Link>
                  </>
                )}

                <Link
                  to="/history"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive('/history') ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>Cari Riwayat</span>
                </Link>

                <div className="h-5 w-px bg-slate-200 mx-2" />

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-800 leading-tight">{user.nama}</div>
                    <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/history"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
                >
                  Cari Riwayat Plat
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-red-700 hover:text-red-800 px-3 py-2"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-red-700 hover:bg-red-800 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <div className="py-2 border-b border-slate-100 mb-2">
                <div className="font-semibold text-slate-900">{user.nama}</div>
                <div className="text-xs text-slate-500 mb-1">{user.email}</div>
                <div>{getRoleBadge(user.role)}</div>
              </div>

              {user.role === 'CUSTOMER' && (
                <>
                  <Link
                    to="/customer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 text-slate-700 hover:bg-red-50 rounded font-medium"
                  >
                    Dashboard Pelanggan
                  </Link>
                  <Link
                    to="/customer/vehicles"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 text-slate-700 hover:bg-red-50 rounded font-medium"
                  >
                    Motor Saya
                  </Link>
                  <Link
                    to="/customer/booking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 text-slate-700 hover:bg-red-50 rounded font-medium"
                  >
                    Booking Servis
                  </Link>
                </>
              )}

              {user.role === 'MECHANIC' && (
                <Link
                  to="/mechanic"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-3 text-slate-700 hover:bg-red-50 rounded font-medium"
                >
                  Antrean Servis Mekanik
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 text-slate-700 hover:bg-red-50 rounded font-medium"
                  >
                    Dashboard Admin
                  </Link>
                  <Link
                    to="/admin/slots"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 text-slate-700 hover:bg-red-50 rounded font-medium"
                  >
                    Kelola Slot Harian
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 text-slate-700 hover:bg-red-50 rounded font-medium"
                  >
                    Manajemen Pengguna
                  </Link>
                </>
              )}

              <Link
                to="/history"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 text-slate-700 hover:bg-red-50 rounded font-medium"
              >
                Cari Riwayat Servis
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded font-medium flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/history"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 text-slate-700 hover:bg-slate-100 rounded font-medium"
              >
                Cari Riwayat Plat
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 text-slate-700 hover:bg-slate-100 rounded font-medium"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 text-center bg-red-700 text-white rounded font-medium"
              >
                Daftar Akun Baru
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
