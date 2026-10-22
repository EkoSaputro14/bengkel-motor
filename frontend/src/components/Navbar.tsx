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
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 ring-1 ring-rose-200 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            ADMIN
          </span>
        );
      case 'MECHANIC':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 ring-1 ring-amber-200 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            MEKANIK
          </span>
        );
      case 'CUSTOMER':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 ring-1 ring-blue-200 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            PELANGGAN
          </span>
        );
      default:
        return null;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const linkCls = (path: string) =>
    `group relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  const mobileLinkCls = (path: string) =>
    `flex items-center gap-2.5 py-2.5 px-4 text-sm font-medium rounded-xl transition ${
      isActive(path) ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <nav className="sticky top-0 z-50">
      <div className="mx-3 sm:mx-4 mt-3">
        {/* Floating glass navbar */}
        <div className="max-w-7xl mx-auto rounded-2xl glass bg-white/75 border border-white/60 shadow-[0_8px_32px_-12px_rgb(15_23_42/0.18)] ring-1 ring-slate-900/5">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <div className="bg-gradient-to-br from-brand-500 to-brand-800 text-white p-2 rounded-xl shadow-glow group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                    <Wrench className="h-4.5 w-4.5 h-5 w-5" />
                  </div>
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                    Bengkel<span className="text-gradient">Motor</span>
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1.5">
                {user ? (
                  <>
                    {user.role === 'CUSTOMER' && (
                      <>
                        <Link to="/customer" className={linkCls('/customer')}>
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link to="/customer/vehicles" className={linkCls('/customer/vehicles')}>
                          <Car className="h-4 w-4" />
                          <span>Motor Saya</span>
                        </Link>
                        <Link to="/customer/booking" className={linkCls('/customer/booking')}>
                          <Calendar className="h-4 w-4" />
                          <span>Booking Servis</span>
                        </Link>
                      </>
                    )}

                    {user.role === 'MECHANIC' && (
                      <Link to="/mechanic" className={linkCls('/mechanic')}>
                        <Wrench className="h-4 w-4" />
                        <span>Antrean Servis</span>
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <>
                        <Link to="/admin" className={linkCls('/admin')}>
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Ringkasan</span>
                        </Link>
                        <Link to="/admin/slots" className={linkCls('/admin/slots')}>
                          <Calendar className="h-4 w-4" />
                          <span>Kelola Slot</span>
                        </Link>
                        <Link to="/admin/users" className={linkCls('/admin/users')}>
                          <Users className="h-4 w-4" />
                          <span>Pengguna</span>
                        </Link>
                      </>
                    )}

                    <Link to="/history" className={linkCls('/history')}>
                      <History className="h-4 w-4" />
                      <span>Cari Riwayat</span>
                    </Link>

                    <div className="h-6 w-px bg-slate-200 mx-1.5" />

                    <div className="flex items-center gap-2.5">
                      <div className="text-right leading-tight">
                        <div className="text-sm font-bold text-slate-800">{user.nama}</div>
                        <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                      </div>
                      <button
                        onClick={() => logout()}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all duration-200 active:scale-90"
                        title="Logout"
                      >
                        <LogOut className="h-5 w-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/history"
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100/80 transition"
                    >
                      Cari Riwayat Plat
                    </Link>
                    <Link
                      to="/login"
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-100/80 transition"
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md shadow-slate-900/20 transition-all duration-200 hover:shadow-lg active:scale-95"
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
                  className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition active:scale-90"
                  aria-label="Buka menu"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-100 px-3 pt-3 pb-4 space-y-1.5 animate-fade-in">
              {user ? (
                <>
                  <div className="py-3 px-4 mb-2 rounded-xl bg-slate-50 ring-1 ring-slate-100">
                    <div className="font-bold text-slate-900">{user.nama}</div>
                    <div className="text-xs text-slate-500 mb-1.5">{user.email}</div>
                    <div>{getRoleBadge(user.role)}</div>
                  </div>

                  {user.role === 'CUSTOMER' && (
                    <>
                      <Link to="/customer" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/customer')}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard Pelanggan
                      </Link>
                      <Link to="/customer/vehicles" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/customer/vehicles')}>
                        <Car className="h-4 w-4" /> Motor Saya
                      </Link>
                      <Link to="/customer/booking" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/customer/booking')}>
                        <Calendar className="h-4 w-4" /> Booking Servis
                      </Link>
                    </>
                  )}

                  {user.role === 'MECHANIC' && (
                    <Link to="/mechanic" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/mechanic')}>
                      <Wrench className="h-4 w-4" /> Antrean Servis Mekanik
                    </Link>
                  )}

                  {user.role === 'ADMIN' && (
                    <>
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/admin')}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard Admin
                      </Link>
                      <Link to="/admin/slots" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/admin/slots')}>
                        <Calendar className="h-4 w-4" /> Kelola Slot Harian
                      </Link>
                      <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/admin/users')}>
                        <Users className="h-4 w-4" /> Manajemen Pengguna
                      </Link>
                    </>
                  )}

                  <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/history')}>
                    <History className="h-4 w-4" /> Cari Riwayat Servis
                  </Link>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left py-2.5 px-4 mt-1 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold flex items-center gap-2 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-1.5 pt-1">
                  <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/history')}>
                    Cari Riwayat Plat
                  </Link>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/login')}>
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-4 text-center bg-slate-900 text-white rounded-xl font-semibold shadow-md shadow-slate-900/20"
                  >
                    Daftar Akun Baru
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
