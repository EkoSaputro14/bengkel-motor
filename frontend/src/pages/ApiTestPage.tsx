import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Code2,
  Play,
  Send,
  Key,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  RefreshCw,
  Search,
  Shield,
  Layers,
  Database,
  User,
  Wrench,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface EndpointDef {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  category: 'System' | 'Auth' | 'Vehicles' | 'Service Slots' | 'Bookings' | 'Mechanic' | 'Admin';
  role: 'Public' | 'Customer' | 'Mechanic' | 'Admin' | 'Auth (All)';
  description: string;
  defaultBody?: any;
  defaultParams?: Record<string, string>;
}

const ENDPOINTS: EndpointDef[] = [
  // System
  {
    id: 'health',
    name: '01. Health Check v1',
    method: 'GET',
    path: '/api/v1/health',
    category: 'System',
    role: 'Public',
    description: 'Cek kesiapan dan uptime server REST API serta status framework Laravel 12.',
  },

  // Auth
  {
    id: 'auth_login_cust',
    name: '02. Login Pelanggan (Customer)',
    method: 'POST',
    path: '/api/v1/auth/login',
    category: 'Auth',
    role: 'Public',
    description: 'Autentikasi akun pelanggan dan penerbitan Bearer Token Sanctum.',
    defaultBody: {
      email: 'eko@bengkelmotor.test',
      password: 'password123',
    },
  },
  {
    id: 'auth_login_mech',
    name: '03. Login Mekanik (Mechanic)',
    method: 'POST',
    path: '/api/v1/auth/login',
    category: 'Auth',
    role: 'Public',
    description: 'Autentikasi akun mekanik untuk akses pit antrean servis.',
    defaultBody: {
      email: 'mechanic@bengkelmotor.test',
      password: 'password123',
    },
  },
  {
    id: 'auth_login_admin',
    name: '04. Login Administrator',
    method: 'POST',
    path: '/api/v1/auth/login',
    category: 'Auth',
    role: 'Public',
    description: 'Autentikasi admin untuk manajemen master data dan slot.',
    defaultBody: {
      email: 'admin@bengkelmotor.test',
      password: 'password123',
    },
  },
  {
    id: 'auth_register',
    name: '05. Register Pelanggan Baru',
    method: 'POST',
    path: '/api/v1/auth/register',
    category: 'Auth',
    role: 'Public',
    description: 'Pendaftaran akun pelanggan baru di sistem.',
    defaultBody: {
      nama: 'Testing User',
      email: `test_${Date.now()}@bengkelmotor.test`,
      password: 'password123',
      password_confirmation: 'password123',
      no_hp: '081298765432',
      alamat: 'Jl. Pemuda No. 10, Tegal',
    },
  },
  {
    id: 'auth_me',
    name: '06. Cek Profil Saya (/auth/me)',
    method: 'GET',
    path: '/api/v1/auth/me',
    category: 'Auth',
    role: 'Auth (All)',
    description: 'Mendapatkan info detail akun yang sedang aktif dari Bearer Token.',
  },
  {
    id: 'auth_logout',
    name: '07. Logout Token',
    method: 'POST',
    path: '/api/v1/auth/logout',
    category: 'Auth',
    role: 'Auth (All)',
    description: 'Mencabut token aktif yang tersimpan di database.',
  },

  // Service Slots
  {
    id: 'slots_list',
    name: '08. Katalog Slot Servis (Publik)',
    method: 'GET',
    path: '/api/v1/service-slots',
    category: 'Service Slots',
    role: 'Public',
    description: 'Mengambil daftar slot jam servis real-time (bisa difilter tanggal & ketersediaan).',
    defaultParams: {
      tanggal: new Date().toISOString().split('T')[0],
      per_page: '10',
    },
  },
  {
    id: 'slots_create_admin',
    name: '09. Admin: Buat Slot Servis',
    method: 'POST',
    path: '/api/v1/admin/service-slots',
    category: 'Service Slots',
    role: 'Admin',
    description: 'Admin menambahkan slot jam servis baru untuk tanggal tertentu.',
    defaultBody: {
      tanggal: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      jam_mulai: '13:00',
      kuota_maksimal: 5,
    },
  },

  // Vehicles
  {
    id: 'vehicles_list',
    name: '10. Daftar Motor Pelanggan',
    method: 'GET',
    path: '/api/v1/vehicles',
    category: 'Vehicles',
    role: 'Customer',
    description: 'Menampilkan seluruh motor yang terdaftar milik akun login.',
  },
  {
    id: 'vehicles_create',
    name: '11. Daftarkan Motor Baru',
    method: 'POST',
    path: '/api/v1/vehicles',
    category: 'Vehicles',
    role: 'Customer',
    description: 'Menambahkan unit sepeda motor baru ke database kepemilikan.',
    defaultBody: {
      no_polisi: `G ${Math.floor(1000 + Math.random() * 9000)} TST`,
      merk: 'Honda',
      model: 'Vario 160 CBS',
      tahun: 2024,
    },
  },
  {
    id: 'vehicles_show',
    name: '12. Detail Motor By ID',
    method: 'GET',
    path: '/api/v1/vehicles/1',
    category: 'Vehicles',
    role: 'Customer',
    description: 'Mengambil detail motor berdasarkan ID spesifik.',
  },

  // Bookings
  {
    id: 'bookings_create',
    name: '13. Buat Booking (Auto-Confirm & Lock)',
    method: 'POST',
    path: '/api/v1/bookings',
    category: 'Bookings',
    role: 'Customer',
    description: 'Memesan antrean servis dengan mekanisme verifikasi slot atomik dan status langsung CONFIRMED.',
    defaultBody: {
      vehicle_id: 1,
      slot_id: 1,
      keluhan: 'Servis berkala 10.000 KM dan ganti oli mesin.',
    },
  },
  {
    id: 'bookings_customer_list',
    name: '14. Riwayat Booking Saya',
    method: 'GET',
    path: '/api/v1/customer/bookings',
    category: 'Bookings',
    role: 'Customer',
    description: 'Mengambil daftar seluruh reservasi servis yang dibuat oleh akun pelanggan.',
  },
  {
    id: 'bookings_show',
    name: '15. Detail Booking By ID',
    method: 'GET',
    path: '/api/v1/bookings/1',
    category: 'Bookings',
    role: 'Customer',
    description: 'Melihat detail status, motor, dan slot pada satu booking.',
  },
  {
    id: 'bookings_cancel',
    name: '16. Batalkan Booking & Pulihkan Kuota',
    method: 'PATCH',
    path: '/api/v1/bookings/1/cancel',
    category: 'Bookings',
    role: 'Customer',
    description: 'Membatalkan booking dengan alasan dan mengembalikan sisa kuota slot jam servis.',
    defaultBody: {
      alasan_batal: 'Ada urusan mendadak, akan jadwalkan ulang besok.',
    },
  },

  // Mechanic & Service Records
  {
    id: 'mechanic_queue',
    name: '17. Antrean Pit Servis Mekanik',
    method: 'GET',
    path: '/api/v1/mechanic/bookings',
    category: 'Mechanic',
    role: 'Mechanic',
    description: 'Mengambil daftar motor yang siap dikerjakan di pit servis hari ini.',
  },
  {
    id: 'service_records_create',
    name: '18. Rekam Logbook Servis Selesai',
    method: 'POST',
    path: '/api/v1/service-records',
    category: 'Mechanic',
    role: 'Mechanic',
    description: 'Mekanik menyimpan catatan odometer, tindakan, dan JSON suku cadang (Booking otomatis jadi COMPLETED).',
    defaultBody: {
      booking_id: 1,
      odometer_km: 12500,
      tindakan: 'Penggantian oli mesin MPX2, pembersihan filter udara, dan penyetelan rantai roda.',
      catatan_mekanik: 'Kondisi kampas rem depan masih 70%, disarankan periksa kembali pada servis berikutnya.',
      suku_cadang: [
        { nama: 'Oli Mesin MPX2 0.8L', qty: 1, keterangan: 'Original AHM' },
        { nama: 'Busi NGK CPR9EA-9', qty: 1, keterangan: 'Standar pabrik' },
      ],
    },
  },
  {
    id: 'service_history_lookup',
    name: '19. Lacak Riwayat Servis (Plat Nomor)',
    method: 'GET',
    path: '/api/v1/service-history',
    category: 'Mechanic',
    role: 'Auth (All)',
    description: 'Pencarian transparan riwayat servis kendaraan berbasis nomor polisi.',
    defaultParams: {
      no_polisi: 'G 2222 KL',
    },
  },
  {
    id: 'service_record_show',
    name: '20. Detail Logbook Servis By ID',
    method: 'GET',
    path: '/api/v1/service-records/1',
    category: 'Mechanic',
    role: 'Auth (All)',
    description: 'Melihat detail teknis logbook servis, nama mekanik, dan rincian suku cadang.',
  },

  // Admin
  {
    id: 'admin_stats',
    name: '21. Admin: Statistik Dashboard',
    method: 'GET',
    path: '/api/v1/admin/stats',
    category: 'Admin',
    role: 'Admin',
    description: 'Ringkasan total booking, pendapatan estimasi, dan utilisasi kuota servis.',
  },
  {
    id: 'admin_users',
    name: '22. Admin: Daftar Semua Pengguna',
    method: 'GET',
    path: '/api/v1/admin/users',
    category: 'Admin',
    role: 'Admin',
    description: 'Mengambil master data user (Customer, Mechanic, Admin) beserta kendaraan terdaftar.',
  },
  {
    id: 'admin_bookings_all',
    name: '23. Admin: Seluruh Booking Bengkel',
    method: 'GET',
    path: '/api/v1/admin/bookings',
    category: 'Admin',
    role: 'Admin',
    description: 'Melihat seluruh transaksi booking dari semua pelanggan dengan filter.',
  },
];

export const ApiTestPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [requestUrl, setRequestUrl] = useState<string>(ENDPOINTS[0].path);
  const [requestMethod, setRequestMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [requestBodyText, setRequestBodyText] = useState<string>('');
  const [tokenInput, setTokenInput] = useState<string>('');
  const [activePersona, setActivePersona] = useState<string>('Custom / None');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Response state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [responseHeaders, setResponseHeaders] = useState<any>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  // Batch runner state
  const [batchRunning, setBatchRunning] = useState<boolean>(false);
  const [batchResults, setBatchResults] = useState<{ id: string; name: string; status: number; duration: number; ok: boolean }[] | null>(null);

  // Initialize with token in localStorage if present
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setTokenInput(savedToken);
      const savedUserStr = localStorage.getItem('auth_user');
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          setActivePersona(`${user.role} (${user.nama})`);
        } catch {
          setActivePersona('Active Session');
        }
      }
    }
  }, []);

  // Sync selected endpoint when changed
  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setRequestMethod(ep.method);

    // Build path with default query params if present
    if (ep.defaultParams) {
      const q = new URLSearchParams(ep.defaultParams).toString();
      setRequestUrl(`${ep.path}?${q}`);
    } else {
      setRequestUrl(ep.path);
    }

    if (ep.defaultBody) {
      setRequestBodyText(JSON.stringify(ep.defaultBody, null, 2));
    } else {
      setRequestBodyText('');
    }
  };

  // Switch persona handler
  const handlePersonaLogin = async (role: 'CUSTOMER' | 'MECHANIC' | 'ADMIN' | 'CLEAR') => {
    if (role === 'CLEAR') {
      setTokenInput('');
      setActivePersona('Public (Tanpa Token)');
      return;
    }

    const credentials = {
      CUSTOMER: { email: 'eko@bengkelmotor.test', password: 'password123', label: 'Pelanggan (Eko)' },
      MECHANIC: { email: 'mechanic@bengkelmotor.test', password: 'password123', label: 'Mekanik (Budi)' },
      ADMIN: { email: 'admin@bengkelmotor.test', password: 'password123', label: 'Administrator' },
    }[role];

    try {
      setIsLoading(true);
      const res = await axios.post('/api/v1/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const token = res.data.data.token;
      setTokenInput(token);
      setActivePersona(credentials.label);
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || 'OK');
      setResponseData(res.data);
      setResponseHeaders(res.headers);
    } catch (err: any) {
      alert(`Gagal login sebagai ${role}: ` + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Execute single request
  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    setResponseHeaders(null);
    setResponseTimeMs(null);

    const startTime = performance.now();

    try {
      let parsedBody = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(requestMethod) && requestBodyText.trim()) {
        try {
          parsedBody = JSON.parse(requestBodyText);
        } catch (jsonErr) {
          alert('Format Request Body bukan JSON yang valid!');
          setIsLoading(false);
          return;
        }
      }

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (tokenInput.trim()) {
        headers['Authorization'] = `Bearer ${tokenInput.trim()}`;
      }

      const res = await axios({
        method: requestMethod,
        url: requestUrl,
        data: parsedBody,
        headers,
        validateStatus: () => true, // Don't throw for 4xx/5xx so we can view status & body
      });

      const endTime = performance.now();
      setResponseTimeMs(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : ''));
      setResponseData(res.data);
      setResponseHeaders(res.headers);
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTimeMs(Math.round(endTime - startTime));
      setResponseStatus(err.response?.status || 500);
      setResponseStatusText(err.response?.statusText || 'Network / Request Error');
      setResponseData(err.response?.data || { error: err.message });
      setResponseHeaders(err.response?.headers || {});
    } finally {
      setIsLoading(false);
    }
  };

  // Run suite of quick sanity checks
  const handleRunAllHealthCheck = async () => {
    setBatchRunning(true);
    const results: { id: string; name: string; status: number; duration: number; ok: boolean }[] = [];

    const testList = [
      { id: 'health', name: 'Health Check API', method: 'GET', url: '/api/v1/health' },
      { id: 'slots', name: 'Katalog Slot Servis', method: 'GET', url: '/api/v1/service-slots?per_page=2' },
      { id: 'auth_me_unauth', name: 'Cek Auth Guard (Harus 401 jika no-token)', method: 'GET', url: '/api/v1/auth/me' },
    ];

    for (const test of testList) {
      const t0 = performance.now();
      try {
        const res = await axios({
          method: test.method,
          url: test.url,
          validateStatus: () => true,
        });
        const t1 = performance.now();
        results.push({
          id: test.id,
          name: test.name,
          status: res.status,
          duration: Math.round(t1 - t0),
          ok: test.id === 'auth_me_unauth' ? res.status === 401 : res.status >= 200 && res.status < 300,
        });
      } catch (err: any) {
        const t1 = performance.now();
        results.push({
          id: test.id,
          name: test.name,
          status: err.response?.status || 500,
          duration: Math.round(t1 - t0),
          ok: false,
        });
      }
    }

    setBatchResults(results);
    setBatchRunning(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const filteredEndpoints = ENDPOINTS.filter((ep) => {
    const matchCat = selectedCategory === 'All' || ep.category === selectedCategory;
    const matchSearch =
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-500/15 text-emerald-600 border-emerald-300';
      case 'POST':
        return 'bg-blue-500/15 text-blue-600 border-blue-300';
      case 'PUT':
        return 'bg-amber-500/15 text-amber-600 border-amber-300';
      case 'PATCH':
        return 'bg-purple-500/15 text-purple-600 border-purple-300';
      case 'DELETE':
        return 'bg-rose-500/15 text-rose-600 border-rose-300';
      default:
        return 'bg-slate-500/15 text-slate-600 border-slate-300';
    }
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    }
    if (status >= 400 && status < 500) {
      return 'bg-amber-50 text-amber-700 border-amber-300';
    }
    return 'bg-rose-50 text-rose-700 border-rose-300';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* ═══ Header Section ═══ */}
      <div className="bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200/80 rounded-full text-xs font-bold text-red-700">
            <Code2 className="h-4 w-4" />
            <span>Interactive REST API Testing Laboratory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            PENGUJIAN SISTEM REST API v1
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Halaman laboratorium interaktif untuk mengeksekusi, memvalidasi respon status code, menguji proteksi RBAC, serta memverifikasi semantik RESTful Laravel 12 secara langsung dari browser.
          </p>
        </div>

        {/* Quick Sanity Batch Check */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={handleRunAllHealthCheck}
            disabled={batchRunning}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition shadow-md shadow-slate-900/20 active:scale-95 disabled:opacity-50"
          >
            {batchRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-amber-400" />}
            <span>Uji Cepat Kesiapan API</span>
          </button>
        </div>
      </div>

      {/* Batch Results Banner if run */}
      {batchResults && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Hasil Uji Kesiapan API Cepat:
            </span>
            <button
              onClick={() => setBatchResults(null)}
              className="text-[11px] text-slate-400 hover:text-slate-700 font-bold"
            >
              Tutup
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {batchResults.map((r) => (
              <div
                key={r.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  r.ok ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-rose-50/80 border-rose-200 text-rose-900'
                }`}
              >
                <div>
                  <div className="font-bold">{r.name}</div>
                  <div className="text-[10px] opacity-80">{r.duration} ms</div>
                </div>
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-white/70 border border-current">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Quick Persona / Token Switcher Card ═══ */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-slate-700" />
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Persona &amp; Otentikasi Pengujian (Bearer Token)
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Persona Aktif: <strong className="text-slate-900">{activePersona}</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Switch Role Cepat:</span>
          <button
            type="button"
            onClick={() => handlePersonaLogin('CUSTOMER')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition active:scale-95"
          >
            <User className="h-3.5 w-3.5" />
            <span>Pelanggan (Eko)</span>
          </button>
          <button
            type="button"
            onClick={() => handlePersonaLogin('MECHANIC')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 text-xs font-bold transition active:scale-95"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Mekanik (Budi)</span>
          </button>
          <button
            type="button"
            onClick={() => handlePersonaLogin('ADMIN')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition active:scale-95"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Administrator</span>
          </button>
          <button
            type="button"
            onClick={() => handlePersonaLogin('CLEAR')}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 text-xs font-bold transition active:scale-95"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Reset (Tanpa Token)</span>
          </button>
        </div>

        {/* Token input field */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => {
              setTokenInput(e.target.value);
              setActivePersona('Custom Bearer Token');
            }}
            placeholder="Bearer token otomatis terisi saat memilih role di atas atau masukkan custom token..."
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          {tokenInput && (
            <button
              type="button"
              onClick={() => {
                setTokenInput('');
                setActivePersona('Public (Tanpa Token)');
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl text-xs transition"
              title="Hapus token"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ═══ Main Testing Console Grid (Side-by-Side 2-Kolom) ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Endpoint Navigation & Filter (5 Cols / Sticky) */}
        <div 
          role="navigation" 
          aria-label="Katalog Endpoint API"
          className="md:col-span-5 md:sticky md:top-24 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-5 shadow-soft space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-red-600" />
                <span>Katalog Endpoint ({filteredEndpoints.length})</span>
              </h2>
            </div>

            {/* Search Endpoint */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari endpoint, method, atau fitur..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Category Filter Pills (Wrap rapi tanpa terpotong) */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              {['All', 'System', 'Auth', 'Vehicles', 'Service Slots', 'Bookings', 'Mechanic', 'Admin'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredEndpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-800'
                  }`}
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase font-mono ${
                          isSelected ? 'bg-white/20 text-white border-white/30' : getMethodBadge(ep.method)
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-xs font-bold truncate">{ep.name}</span>
                    </div>
                    <div
                      className={`text-[11px] font-mono truncate ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {ep.path}
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition ${
                      isSelected ? 'text-white translate-x-0.5' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Request & Response Workspace (7 Cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Request Config Card */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-5">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  Request Configuration
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Role: {selectedEndpoint.role}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">{selectedEndpoint.name}</h3>
              <p className="text-xs text-slate-600">{selectedEndpoint.description}</p>
            </div>

            {/* URL & Method Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={requestMethod}
                onChange={(e) => setRequestMethod(e.target.value as any)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={requestUrl}
                  onChange={(e) => setRequestUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <button
                type="button"
                onClick={handleExecuteRequest}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-red-600/20 active:scale-95 disabled:opacity-50 shrink-0"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Kirim (Send)</span>
              </button>
            </div>

            {/* Request Body (if POST/PUT/PATCH) */}
            {['POST', 'PUT', 'PATCH'].includes(requestMethod) && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Request Body (JSON Payload):</span>
                  {selectedEndpoint.defaultBody && (
                    <button
                      type="button"
                      onClick={() => setRequestBodyText(JSON.stringify(selectedEndpoint.defaultBody, null, 2))}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Reset Default JSON
                    </button>
                  )}
                </div>
                <textarea
                  rows={6}
                  value={requestBodyText}
                  onChange={(e) => setRequestBodyText(e.target.value)}
                  className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed"
                  placeholder="{}"
                />
              </div>
            )}
          </div>

          {/* Response Inspector Card */}
          <div 
            role="region" 
            aria-label="Panel Respon API"
            className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 shadow-soft space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-700" />
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Response Inspector
                </span>
              </div>

              {responseStatus !== null && (
                <div 
                  role="status" 
                  aria-live="polite" 
                  aria-atomic="true"
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className={`font-mono font-black px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      responseStatus
                    )}`}
                  >
                    {responseStatus} {responseStatusText}
                  </span>
                  {responseTimeMs !== null && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Clock className="h-3 w-3" />
                      {responseTimeMs} ms
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Response Output Area */}
            {isLoading ? (
              <div className="py-16 text-center space-y-2">
                <RefreshCw className="h-8 w-8 text-red-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600">Menghubungi endpoint API...</p>
              </div>
            ) : responseData !== null ? (
              <div className="space-y-3">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(JSON.stringify(responseData, null, 2))}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                  >
                    {copiedResponse ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedResponse ? 'Tersalin!' : 'Salin JSON'}</span>
                  </button>
                </div>
                <div className="max-h-[380px] overflow-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
                  <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Code2 className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-xs">Klik tombol <strong>Kirim (Send)</strong> di atas untuk melihat respon API.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
