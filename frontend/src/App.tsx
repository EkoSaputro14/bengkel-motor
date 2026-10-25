import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { VehicleManager } from './pages/VehicleManager';
import { SlotBookingPage } from './pages/SlotBookingPage';
import { CustomerBookingsPage } from './pages/CustomerBookingsPage';
import { ServiceHistoryPage } from './pages/ServiceHistoryPage';
import { MechanicDashboard } from './pages/MechanicDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSlotManager } from './pages/AdminSlotManager';
import { AdminUserManager } from './pages/AdminUserManager';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { Wrench } from 'lucide-react';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col text-slate-900">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/history" element={<ServiceHistoryPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Authenticated Profile Route */}
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'MECHANIC', 'ADMIN']} />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Customer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']} />}>
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/customer/vehicles" element={<VehicleManager />} />
                <Route path="/customer/booking" element={<SlotBookingPage />} />
                <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
              </Route>

              {/* Mechanic Routes */}
              <Route element={<ProtectedRoute allowedRoles={['MECHANIC', 'ADMIN']} />}>
                <Route path="/mechanic" element={<MechanicDashboard />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/slots" element={<AdminSlotManager />} />
                <Route path="/admin/users" element={<AdminUserManager />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Floating WhatsApp Customer Service Widget */}
          <WhatsAppWidget />

          {/* Footer */}
          <footer className="mt-8 px-4 pb-6">
            <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur ring-1 ring-slate-900/5 rounded-3xl px-6 py-6 text-center space-y-2 shadow-soft">
              <div className="flex items-center justify-center gap-2">
                <span className="p-1.5 bg-gradient-to-br from-brand-500 to-brand-800 text-white rounded-lg">
                  <Wrench className="h-3.5 w-3.5" />
                </span>
                <p className="font-bold text-sm text-slate-800">
                  Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor — Kelompok 2
                </p>
              </div>
              <p className="text-xs text-slate-400">
                Universitas Harkat Negeri • Pemrograman Web Service 2026/2027 • Laravel 12 &amp; React PWA
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
