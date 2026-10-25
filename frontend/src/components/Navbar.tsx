import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  Calendar,
  Car,
  History,
  Users,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  ChevronDown,
  Package,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

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

  const getDashboardPath = (role?: string) => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'MECHANIC') return '/mechanic';
    return '/customer';
  };

  const isActive = (path: string) => location.pathname === path;

  const linkCls = (path: string) =>
    `group relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  const mobileLinkCls = (path: string) =>
    `flex items-center gap-3 py-2.5 px-3.5 text-sm font-semibold rounded-xl transition ${
      isActive(path) ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`;

  // Avatar initials
  const initials = user?.nama
    ? user.nama
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <nav className="sticky top-0 z-40">
      <div className="mx-3 sm:mx-4 mt-3">
        {/* Floating Glassmorphism Navbar */}
        <div className="max-w-7xl mx-auto rounded-2xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_-12px_rgb(15_23_42/0.15)] ring-1 ring-slate-900/5">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between h-16">
              {/* Brand Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <div className="bg-gradient-to-br from-brand-500 to-brand-800 text-white p-2 rounded-xl shadow-glow group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                    Bengkel<span className="text-gradient">Motor</span>
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation Links */}
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
                          <span>Dashboard</span>
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

                    {/* Sederhanakan: Cari Riwayat -> Riwayat */}
                    <Link to="/history" className={linkCls('/history')}>
                      <History className="h-4 w-4" />
                      <span>Riwayat</span>
                    </Link>

                    {/* Katalog Suku Cadang & Sparepart */}
                    <a href="/#katalog-sparepart" className={linkCls('/#katalog-sparepart')}>
                      <Package className="h-4 w-4" />
                      <span>Sparepart</span>
                    </a>

                    <div className="h-6 w-px bg-slate-200 mx-1.5" />

                    {/* Simplified User Profile Dropdown Pill */}
                    <div className="relative" ref={userDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full hover:bg-slate-100/90 border border-slate-200/80 transition active:scale-95 text-slate-800"
                      >
                        <div className="text-left leading-tight hidden lg:block">
                          <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                            {user.nama.split(' ')[0]}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                          {initials}
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 mr-1" />
                      </button>

                      {/* Glassmorphic Dropdown Menu */}
                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1 animate-scale-in z-50 ring-1 ring-slate-900/5">
                          {/* User Info Header */}
                          <div className="px-3 py-2 border-b border-slate-100 mb-1">
                            <div className="font-bold text-xs text-slate-900 truncate">{user.nama}</div>
                            <div className="text-[11px] text-slate-500 truncate mb-1">{user.email}</div>
                            <div>{getRoleBadge(user.role)}</div>
                          </div>

                          <Link
                            to={getDashboardPath(user.role)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                          >
                            <LayoutDashboard className="h-4 w-4 text-slate-500" />
                            <span>Dashboard Utama</span>
                          </Link>

                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                          >
                            <Settings className="h-4 w-4 text-slate-500" />
                            <span>Profil &amp; Pengaturan</span>
                          </Link>

                          <Link
                            to="/history"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                          >
                            <History className="h-4 w-4 text-slate-500" />
                            <span>Riwayat Servis</span>
                          </Link>

                          <div className="border-t border-slate-100 my-1" />

                          <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                          >
                            <LogOut className="h-4 w-4 text-rose-500" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <a
                      href="/#katalog-sparepart"
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full hover:bg-slate-100/80 transition flex items-center gap-1.5"
                    >
                      <Package className="h-4 w-4" />
                      <span>Sparepart</span>
                    </a>
                    <Link
                      to="/history"
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full hover:bg-slate-100/80 transition flex items-center gap-1.5"
                    >
                      <History className="h-4 w-4" />
                      <span>Riwayat</span>
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
                  aria-label="Buka menu navigasi"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay with Solid Backdrop & Glassmorphism Card */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[76px] z-50 md:hidden bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in flex flex-col justify-start">
          <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-5 shadow-2xl space-y-3 ring-1 ring-slate-900/5 max-h-[85vh] overflow-y-auto">
            {user ? (
              <>
                {/* Simplified User Info Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                      {initials}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{user.nama}</div>
                      <div className="text-[11px] text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <div>{getRoleBadge(user.role)}</div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-1 pt-1">
                  {user.role === 'CUSTOMER' && (
                    <>
                      <Link to="/customer" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/customer')}>
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard Pelanggan</span>
                      </Link>
                      <Link to="/customer/vehicles" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/customer/vehicles')}>
                        <Car className="h-4 w-4" />
                        <span>Motor Saya</span>
                      </Link>
                      <Link to="/customer/booking" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/customer/booking')}>
                        <Calendar className="h-4 w-4" />
                        <span>Booking Servis</span>
                      </Link>
                    </>
                  )}

                  {user.role === 'MECHANIC' && (
                    <Link to="/mechanic" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/mechanic')}>
                      <Wrench className="h-4 w-4" />
                      <span>Antrean Servis Mekanik</span>
                    </Link>
                  )}

                  {user.role === 'ADMIN' && (
                    <>
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/admin')}>
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard Admin</span>
                      </Link>
                      <Link to="/admin/slots" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/admin/slots')}>
                        <Calendar className="h-4 w-4" />
                        <span>Kelola Slot Harian</span>
                      </Link>
                      <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/admin/users')}>
                        <Users className="h-4 w-4" />
                        <span>Manajemen Pengguna</span>
                      </Link>
                    </>
                  )}

                  {/* Sederhanakan: Cari Riwayat -> Riwayat */}
                  <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/history')}>
                    <History className="h-4 w-4" />
                    <span>Riwayat</span>
                  </Link>

                  <a
                    href="/#katalog-sparepart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={mobileLinkCls('/#katalog-sparepart')}
                  >
                    <Package className="h-4 w-4" />
                    <span>Katalog Sparepart</span>
                  </a>

                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/profile')}>
                    <Settings className="h-4 w-4" />
                    <span>Profil &amp; Pengaturan</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-2.5 px-3.5 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-sm flex items-center gap-2.5 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <a
                  href="/#katalog-sparepart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkCls('/#katalog-sparepart')}
                >
                  <Package className="h-4 w-4" />
                  <span>Katalog Sparepart</span>
                </a>
                <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/history')}>
                  <History className="h-4 w-4" />
                  <span>Riwayat</span>
                </Link>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkCls('/login')}>
                  <User className="h-4 w-4" />
                  <span>Masuk</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-center bg-slate-900 text-white rounded-2xl font-bold shadow-md shadow-slate-900/20"
                >
                  Daftar Akun Baru
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};