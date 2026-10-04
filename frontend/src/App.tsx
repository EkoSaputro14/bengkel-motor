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

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/history" element={<ServiceHistoryPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

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

          {/* Footer */}
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 space-y-1">
              <p className="font-semibold text-slate-700">
                Sistem Informasi Layanan Penjadwalan Servis Bengkel Motor — Kelompok 2
              </p>
              <p>
                Universitas Harkat Negeri • Pemrograman Web Service 2026/2027 • Laravel 12 & React PWA
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
