import React from 'react';
import type { BookingStatus, UserRole } from '../types/api';

export const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  switch (status) {
    case 'CONFIRMED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80">
          <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Terkonfirmasi (CONFIRMED)
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 ring-1 ring-blue-200/80">
          <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full" />
          Selesai (COMPLETED)
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 ring-1 ring-rose-200/80">
          <span className="w-1.5 h-1.5 mr-1.5 bg-rose-500 rounded-full" />
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
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 ring-1 ring-rose-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Admin
        </span>
      );
    case 'MECHANIC':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 ring-1 ring-amber-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Mekanik
        </span>
      );
    case 'CUSTOMER':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 ring-1 ring-blue-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Pelanggan
        </span>
      );
    default:
      return null;
  }
};
