export type UserRole = 'CUSTOMER' | 'MECHANIC' | 'ADMIN';

export interface User {
  id: number;
  nama: string;
  email: string;
  no_hp: string;
  role: UserRole;
  vehicles_count?: number;
  bookings_count?: number;
  created_at: string;
}

export interface Vehicle {
  id: number;
  user_id: number;
  no_polisi: string;
  merk: string;
  model: string;
  tahun: number;
  user?: User;
  created_at: string;
}

export interface ServiceSlot {
  id: number;
  tanggal: string;
  jam_mulai: string;
  kuota_maksimal: number;
  terisi: number;
  sisa_kuota: number;
  is_available: boolean;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface SparePart {
  nama: string;
  qty: number;
  keterangan?: string;
}

export interface ServiceRecord {
  id: number;
  booking_id: number;
  mechanic_id: number;
  odometer_km: number;
  tindakan: string;
  suku_cadang: SparePart[];
  catatan_mekanik: string | null;
  mechanic?: User;
  created_at: string;
  booking?: Booking;
}

export interface Booking {
  id: number;
  booking_code: string;
  user_id: number;
  vehicle_id: number;
  slot_id: number;
  keluhan: string;
  status: BookingStatus;
  user?: User;
  vehicle?: Vehicle;
  slot?: ServiceSlot;
  service_record?: ServiceRecord;
  created_at: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  meta?: any;
}
