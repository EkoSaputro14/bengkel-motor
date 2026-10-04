import React from 'react';
import type { BookingStatus, UserRole } from '../types/api';

export const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  switch (status) {
    case 'CONFIRMED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
          Terkonfirmasi (CONFIRMED)
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full"></span>
          Selesai (COMPLETED)
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
          <span className="w-1.5 h-1.5 mr-1.5 bg-rose-500 rounded-full"></span>
          Dibatalkan (CANCELLED)
        </span>
      );
    default:
      return null;
  }
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  switch (role) {
    case 'ADMIN':
      return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">Admin</span>;
    case 'MECHANIC':
      return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">Mekanik</span>;
    case 'CUSTOMER':
      return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">Pelanggan</span>;
    default:
      return null;
  }
};
