import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  Search,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Disc,
  Bike,
  Gauge,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Package,
  CheckCircle2,
  Sparkles,
  Tag,
  X,
  Info,
  Check,
  AlertTriangle,
  Layers,
  ShoppingCart,
  Star,
  SlidersHorizontal,
  Calculator,
  Plus,
  Minus,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MotorSlide {
  category: 'matic' | 'bebek' | 'sport';
  name: string;
  sub: string;
  model: string;
  staticImage: string;
  has360: boolean;
  framesDir?: string;
  totalFrames?: number;
  frameInterval?: number;
  alt: string;
}

export interface SparepartItem {
  id: string;
  name: string;
  brand: string;
  oemCode: string;
  category: 'pelumas' | 'pengereman' | 'pengapian' | 'drivetrain';
  categoryLabel: string;
  price: string;
  estPrice: number;
  stockCount: number;
  compatibility: string;
  image: string;
  badge: string;
  rating: number;
  soldCount: string;
  intervalKm: string;
  desc: string;
  specs: { label: string; value: string }[];
  symptoms: string[];
}

const SPAREPARTS_DATA: SparepartItem[] = [
  {
    id: 'oli-mesin',
    name: 'Pelumas Mesin 10W-40 Synthetic Ester',
    brand: 'Yamalube / MPX AHM Genuine',
    oemCode: 'OEM: YML-90793-AJ422',
    category: 'pelumas',
    categoryLabel: 'Pelumas & Filter',
    price: 'Rp 65.000',
    estPrice: 65000,
    stockCount: 28,
    compatibility: 'Matic & Bebek (Yamaha NMAX/Aerox, Honda Vario/Beat)',
    image: '/images/spareparts/oli_motor.webp',
    badge: '100% Original',
    rating: 4.9,
    soldCount: '520+ terjual',
    intervalKm: 'Tiap 2.500 - 3.000 KM',
    desc: 'Formula sintetis ester proteksi gesekan ekstrem, menstabilkan temperatur mesin dan respon tarikan spontan.',
    specs: [
      { label: 'Viskositas', value: 'SAE 10W-40 JASO MB / MA2' },
      { label: 'Base Oil', value: 'Semi-Synthetic with Ester Additive' },
      { label: 'Volume Kemasan', value: '800 ml & 1.000 ml (1 Liter)' },
      { label: 'Sertifikasi', value: 'SNI Resmi & Standar Pabrikan Jepang' },
    ],
    symptoms: [
      'Tarikan gas awal terasa berat dan mesin cepat panas',
      'Warna oli pada deepstick sudah menghitam pekat pekat',
      'Suara blok silinder terdengar kasar saat stasioner',
    ],
  },
  {
    id: 'kampas-rem',
    name: 'Brake Pad Set Non-Asbestos Premium',
    brand: 'Nissin / Yamaha OEM Disc Brake',
    oemCode: 'OEM: 2DP-F5805-00',
    category: 'pengereman',
    categoryLabel: 'Pengereman & Ban',
    price: 'Rp 55.000',
    estPrice: 55000,
    stockCount: 19,
    compatibility: 'Depan / Belakang (Cakram Kaliper 1 & 2 Piston)',
    image: '/images/spareparts/kampas_rem.webp',
    badge: 'Garansi Pakem',
    rating: 4.9,
    soldCount: '380+ terjual',
    intervalKm: 'Tiap 10.000 - 15.000 KM',
    desc: 'Kompon keramik semi-metallic anti decit, daya cengkeram instan tahan panas ekstrem tanpa mengikis rotor.',
    specs: [
      { label: 'Material Gesek', value: 'Semi-Metallic Organic Non-Asbestos' },
      { label: 'Daya Tahan Suhu', value: 'Hingga 450°C Anti Fade' },
      { label: 'Ketebalan Kampas', value: '4.8 mm (Batas servis: 1.5 mm)' },
      { label: 'Garansi Pasang', value: 'Garansi Pakem & Bebas Bunyi 30 Hari' },
    ],
    symptoms: [
      'Terdengar suara decitan besi menyengat saat tuas rem ditarik',
      'Jarak pengereman bertambah jauh atau rem terasa bagel/keras',
      'Tuas rem harus ditarik terlalu dalam mendekati grip stang',
    ],
  },
  {
    id: 'busi-iridium',
    name: 'Busi Laser Iridium Long-Life Spark Plug',
    brand: 'NGK Spark Plugs Japan',
    oemCode: 'OEM: NGK-CR7EGP-IR',
    category: 'pengapian',
    categoryLabel: 'Pengapian & Aki',
    price: 'Rp 45.000',
    estPrice: 45000,
    stockCount: 35,
    compatibility: 'Universal Matic, Bebek, & Sport 110cc - 250cc',
    image: '/images/spareparts/busi.webp',
    badge: 'Api Stabil Fokus',
    rating: 4.8,
    soldCount: '610+ terjual',
    intervalKm: 'Tiap 8.000 - 10.000 KM',
    desc: 'Elektroda 0.6mm laser iridium menghadirkan percikan api super fokus, pembakaran tuntas, dan efisiensi BBM tinggi.',
    specs: [
      { label: 'Ujung Elektroda', value: 'Laser Welded Iridium 0.6 mm' },
      { label: 'Ukuran Ulir', value: 'M10 x 1.0 (Hex Key 16 mm)' },
      { label: 'Gap Percikan', value: '0.80 mm Presisi Pabrik' },
      { label: 'Resistor ECU', value: '5 kOhm Anti-Interferensi Elektrikal' },
    ],
    symptoms: [
      'Mesin brebet atau tersendat saat tarikan akselerasi mendadak',
      'Motor susah dinyalakan pada pagi hari atau kondisi mesin dingin',
      'Konsumsi bahan bakar terasa jauh lebih boros dari biasanya',
    ],
  },
  {
    id: 'piringan-cakram',
    name: 'Floating Disc Brake Rotor Stainless Steel',
    brand: 'Brembo / TDR Racing Performance',
    oemCode: 'OEM: DSC-FLT-260MM',
    category: 'pengereman',
    categoryLabel: 'Pengereman & Ban',
    price: 'Rp 185.000',
    estPrice: 185000,
    stockCount: 8,
    compatibility: 'Yamaha NMAX/Aerox, Honda Vario 125/160, Beat',
    image: '/images/spareparts/piringan_cakram.webp',
    badge: 'Anti Karat',
    rating: 4.9,
    soldCount: '140+ terjual',
    intervalKm: 'Tiap 30.000 - 40.000 KM',
    desc: 'Baja tahan karat martensitik AISI 420 dengan ventilasi buang panas cepat, anti deformasi saat rem ekstrem.',
    specs: [
      { label: 'Diameter Luar', value: '260 mm (Lebar Ventilasi Maksimal)' },
      { label: 'Bahan Rotor', value: 'Stainless Martensitic High-Grade' },
      { label: 'Ketebalan Rotor', value: '3.5 mm (Batas servis minimum: 3.0 mm)' },
      { label: 'Dudukan Baut', value: '4 Lubang Hub Standard OEM' },
    ],
    symptoms: [
      'Permukaan piringan beralur dalam bergelombang saat diraba jari',
      'Stang kemudi bergetar hebat saat tuas rem depan dioperasikan',
      'Ketebalan rotor sudah aus menipis mendekati 3 milimeter',
    ],
  },
  {
    id: 'ban-motor',
    name: 'Ban Luar Tubeless Soft Compound City Grip',
    brand: 'Pirelli Diablo Rosso / Maxxis Victra',
    oemCode: 'OEM: TR-110-70-13-TL',
    category: 'pengereman',
    categoryLabel: 'Pengereman & Ban',
    price: 'Rp 295.000',
    estPrice: 295000,
    stockCount: 14,
    compatibility: 'Velg Ring 13 & 14 (Ukuran 110/70, 120/70, 90/90)',
    image: '/images/spareparts/ban_motor.webp',
    badge: 'Grip Basah/Kering',
    rating: 5.0,
    soldCount: '290+ terjual',
    intervalKm: 'Tiap 18.000 - 20.000 KM',
    desc: 'Kompon silika tinggi dengan alur pembuang air kilat (flash groove), daya cengkeram optimal tanpa licin di aspal basah.',
    specs: [
      { label: 'Dimensi Ukuran', value: '110/70 - 13 / 14 M/C 48P Tubeless' },
      { label: 'Jenis Senyawa', value: 'High-Silica Soft-Medium Dual Compound' },
      { label: 'Pola Tapak', value: 'Flash Groove Directional Pattern' },
      { label: 'Tekanan Rekomendasi', value: '29 PSI Depan / 33 PSI Belakang' },
    ],
    symptoms: [
      'Segitiga tanda TWI (Tread Wear Indicator) sudah rata dengan tapak ban',
      'Ban terasa sering selip atau goyang saat bermanuver di jalan basah',
      'Permukaan dinding samping retak rambut atau benjol akibat benturan',
    ],
  },
  {
    id: 'shockbreaker',
    name: 'Suspensi Monoshock Tabung Gas Rebound',
    brand: 'KYB Zeto / RCB Series Japan',
    oemCode: 'OEM: KYB-ZT-330MM',
    category: 'drivetrain',
    categoryLabel: 'Drivetrain & Suspensi',
    price: 'Rp 395.000',
    estPrice: 395000,
    stockCount: 6,
    compatibility: 'Matic Honda & Yamaha (Panjang 305mm - 330mm)',
    image: '/images/spareparts/shockbreaker.webp',
    badge: 'Rebound Empuk',
    rating: 4.8,
    soldCount: '95+ terjual',
    intervalKm: 'Tiap 25.000 - 30.000 KM',
    desc: 'Ruang ganda gas nitrogen dan oli hidraulik presisi, meredam hentakan jalan rusak tanpa limbung saat berboncengan.',
    specs: [
      { label: 'Panjang As ke As', value: '330 mm Adjustable Height' },
      { label: 'Peredam Hentak', value: 'Nitrogen Gas Chamber + Hydraulic Damping' },
      { label: 'Diameter As Damper', value: '12.5 mm Hard-Chromed Alloy' },
      { label: 'Tingkat Setelan', value: '5-Step Spring Preload Setting' },
    ],
    symptoms: [
      'Muncul rembesan cairan oli pada as batang shockbreaker',
      'Motor terasa mengayun mantul berkali-kali setelah melewati lubang',
      'Terdengar bunyi jeduk benturan keras saat melewati polisi tidur',
    ],
  },
  {
    id: 'filter-oli',
    name: 'Filter Oli Mesin & Element Air Cleaner Injeksi',
    brand: 'Honda AHM / Yamaha Genuine Parts',
    oemCode: 'OEM: FLT-17210-K59-A10',
    category: 'pelumas',
    categoryLabel: 'Pelumas & Filter',
    price: 'Rp 35.000',
    estPrice: 35000,
    stockCount: 42,
    compatibility: 'Injeksi PGM-FI & Blue Core (Vario, Beat, NMAX, Aerox)',
    image: '/images/spareparts/filter_oli.webp',
    badge: 'Filtrasi 10 Mikron',
    rating: 4.8,
    soldCount: '780+ terjual',
    intervalKm: 'Tiap 8.000 - 10.000 KM',
    desc: 'Kertas viscose berminyak khusus penangkap debu mikro, mencegah partikel abrasif masuk ke silinder dan ruang bakar.',
    specs: [
      { label: 'Material Filter', value: 'Viscous Paper Oil-Treated Media' },
      { label: 'Tingkat Filtrasi', value: 'Menahan 99.2% Partikel Debu 10 Mikron' },
      { label: 'Standar Emisi', value: 'Ramah Euro 4 & Euro 5 Injection' },
      { label: 'Tipe Pemakaian', value: 'Direct Replacement Plug & Play' },
    ],
    symptoms: [
      'Warna kertas saringan tampak hitam legam pekat berlumpur',
      'Tenaga mesin tertahan loyo terutama saat gas ditarik penuh',
      'Konsumsi bensin mendadak boros akibat suplai udara terhambat',
    ],
  },
  {
    id: 'aki-motor',
    name: 'Aki Kering Maintenance Free (MF) 12V 5Ah',
    brand: 'GS Astra / Yuasa Battery OEM',
    oemCode: 'OEM: GS-GTZ5S-12V',
    category: 'pengapian',
    categoryLabel: 'Pengapian & Aki',
    price: 'Rp 235.000',
    estPrice: 235000,
    stockCount: 16,
    compatibility: 'Universal Semua Motor Matic & Bebek Injeksi',
    image: '/images/spareparts/aki_motor.webp',
    badge: 'Garansi 6 Bulan',
    rating: 4.9,
    soldCount: '410+ terjual',
    intervalKm: 'Tiap 1.5 - 2 Tahun',
    desc: 'Aki tertutup bebas perawatan (VRLA), arus starter kuat stabil untuk sistem injeksi modern dan kelistrikan lampu LED.',
    specs: [
      { label: 'Tegangan & Kapasitas', value: '12 Volt / 3.5 - 5.0 Ampere Hour' },
      { label: 'Cold Cranking (CCA)', value: '85 CCA Semburan Starter Instan' },
      { label: 'Teknologi Sel', value: 'VRLA AGM Sealed (Anti Bocor Miring)' },
      { label: 'Jaminan Garansi', value: 'Garansi Resmi Toko & Tukar Baru 6 Bulan' },
    ],
    symptoms: [
      'Tombol starter elektrik hanya mengeluarkan bunyi cetik-cetik pelan',
      'Layar speedometer digital berkedip atau mati saat starter ditekan',
      'Klakson bersuara serak atau redup saat lampu depan menyala',
    ],
  },
  {
    id: 'rantai-motor',
    name: 'Drive Chain & Sprocket Heavy Duty Kit Gold',
    brand: 'D.I.D Racing Chain Japan',
    oemCode: 'OEM: DID-428HD-120L',
    category: 'drivetrain',
    categoryLabel: 'Drivetrain & Suspensi',
    price: 'Rp 195.000',
    estPrice: 195000,
    stockCount: 11,
    compatibility: 'Motor Tipe Bebek & Sport (Panjang 428HD Solid Bushing)',
    image: '/images/spareparts/rantai_motor.webp',
    badge: 'Solid Bushing Baja',
    rating: 4.9,
    soldCount: '230+ terjual',
    intervalKm: 'Tiap 20.000 - 25.000 KM',
    desc: 'Gir baja karbon tahan aus dengan rantai bushing padat lapis emas anti mulur, transfer tenaga maksimal ke roda belakang.',
    specs: [
      { label: 'Ukuran Rantai', value: 'Pitch 428HD (Solid Bushing 120 Links)' },
      { label: 'Material Gir Depan/Belakang', value: 'High-Carbon Steel Induction Hardened' },
      { label: 'Daya Tarik Maksimal', value: '2.450 kgf High-Tensile Strength' },
      { label: 'Lapisan Pelindung', value: 'Gold Plated Anti Rust Treatment' },
    ],
    symptoms: [
      'Rantai terus kendur berulang kali meski sudah distel habis',
      'Mata gigi gir belakang tampak tajam runcing atau bengkok miring',
      'Terdengar suara gemerisik berisik kasar saat akselerasi jalan',
    ],
  },
];

const MOTOR_SLIDES: MotorSlide[] = [
  {
    category: 'matic',
    name: 'Matic',
    sub: 'CVT',
    model: 'Yamaha NMAX Turbo 155',
    staticImage: '/images/motorcycle_matic_front.png',
    has360: true,
    framesDir: '/images/nmax-360',
    totalFrames: 36,
    frameInterval: 75,
    alt: 'Motor Matic Yamaha NMAX Turbo 155 (Hover untuk Putar 360°)',
  },
  {
    category: 'bebek',
    name: 'Bebek',
    sub: 'Cub',
    model: 'Yamaha Jupiter Z1 115',
    staticImage: '/images/motorcycle_bebek_front.png',
    has360: false,
    alt: 'Motor Bebek Yamaha Jupiter Z1 115',
  },
  {
    category: 'sport',
    name: 'Sport',
    sub: 'Manual',
    model: 'Yamaha XSR 155 Heritage',
    staticImage: '/images/motorcycle_sport_front.png',
    has360: true,
    framesDir: '/images/xsr-360',
    totalFrames: 36,
    frameInterval: 80,
    alt: 'Motor Sport Yamaha XSR 155 Heritage (Hover untuk Putar 360°)',
  },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [noPolisi, setNoPolisi] = useState('');
  
  // Carousel & 360 Hover State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeFrame, setActiveFrame] = useState(1);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  // Swipe / Drag gesture tracking
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const isMouseDownRef = useRef(false);

  const [selectedSparepartCat, setSelectedSparepartCat] = useState<string>('all');
  const [searchSparepart, setSearchSparepart] = useState<string>('');
  const [sortSparepart, setSortSparepart] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');
  const [detailModalItem, setDetailModalItem] = useState<SparepartItem | null>(null);
  const [selectedSparepartIds, setSelectedSparepartIds] = useState<string[]>([]);

  const toggleSelectSparepart = (id: string) => {
    setSelectedSparepartIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredSpareparts = SPAREPARTS_DATA.filter((item) => {
    const matchCat = selectedSparepartCat === 'all' || item.category === selectedSparepartCat;
    const q = searchSparepart.toLowerCase().trim();
    const matchSearch =
      q === '' ||
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.oemCode.toLowerCase().includes(q) ||
      item.compatibility.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortSparepart === 'price-asc') return a.estPrice - b.estPrice;
    if (sortSparepart === 'price-desc') return b.estPrice - a.estPrice;
    return b.rating - a.rating;
  });

  const selectedSparepartObjects = SPAREPARTS_DATA.filter((s) => selectedSparepartIds.includes(s.id));
  const subtotalSpareparts = selectedSparepartObjects.reduce((acc, curr) => acc + curr.estPrice, 0);
  const baseServiceFee = 45000;
  const grandTotalEstimate = selectedSparepartIds.length > 0 ? baseServiceFee + subtotalSpareparts : 0;

  // Preload all 36 frames of NMAX and 36 frames of XSR (original animation)
  useEffect(() => {
    // NMAX Turbo (36 authentic factory frames)
    for (let i = 1; i <= 36; i++) {
      const img = new Image();
      img.src = `/images/nmax-360/${i}.png`;
    }
    // XSR 155 (Original 36 frames)
    for (let i = 1; i <= 36; i++) {
      const img = new Image();
      img.src = `/images/xsr-360/${i}.png`;
    }
  }, []);

  // Reset active frame when slide changes
  useEffect(() => {
    setActiveFrame(1);
  }, [currentIndex]);

  // 360 Rotation Animation on Hover
  useEffect(() => {
    const currentSlide = MOTOR_SLIDES[currentIndex];
    if (!isHovered || !currentSlide.has360 || !currentSlide.totalFrames) {
      return;
    }

    const frameInterval = setInterval(() => {
      setActiveFrame((prev) => (prev % currentSlide.totalFrames!) + 1);
    }, currentSlide.frameInterval || 80);

    return () => clearInterval(frameInterval);
  }, [isHovered, currentIndex]);

  // Automatic slide rotation every 3 seconds (pauses on user hover/touch)
  useEffect(() => {
    if (isHovered) return; // Jeda otomatis saat kursor diarahkan ke motor

    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOTOR_SLIDES.length);
    }, 3000);

    return () => clearInterval(slideTimer);
  }, [currentIndex, isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % MOTOR_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + MOTOR_SLIDES.length) % MOTOR_SLIDES.length);
  };

  const handleCategoryClick = (category: 'matic' | 'bebek' | 'sport') => {
    const idx = MOTOR_SLIDES.findIndex((m) => m.category === category);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setActiveFrame(1);
    }
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const distance = touchStartXRef.current - touchEndXRef.current;
      if (distance > 45) {
        nextSlide();
      } else if (distance < -45) {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsHovered(false);
  };

  // Mouse Drag Handlers (Desktop Swiper)
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    setIsHovered(true);
    touchStartXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    touchEndXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (isMouseDownRef.current && touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const distance = touchStartXRef.current - touchEndXRef.current;
      if (distance > 45) {
        nextSlide();
      } else if (distance < -45) {
        prevSlide();
      }
    }
    isMouseDownRef.current = false;
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsHovered(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const plat = noPolisi.trim().toUpperCase();
    if (plat) {
      navigate(`/history?no_polisi=${encodeURIComponent(plat)}`);
    }
  };

  const currentMotor = MOTOR_SLIDES[currentIndex];

  return (
    <div className="min-h-screen bg-[#ECEEF2] text-slate-900 selection:bg-red-500 selection:text-white pb-20">
      {/* ═══ TOP OPERATIONAL STRIP (Pill style like Gambar 1 - Responsive) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white/90 backdrop-blur-md border border-slate-300/80 rounded-2xl sm:rounded-full py-2.5 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2 shadow-sm text-xs">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center sm:text-left">
            <span className="font-extrabold tracking-wider uppercase flex items-center gap-1.5 text-slate-900 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Pit Servis Buka Hari Ini
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-600 font-medium whitespace-nowrap">08.00 - 17.00 WIB (Senin - Minggu)</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-600 text-center sm:text-right">
            <span className="flex items-center gap-1 font-medium whitespace-nowrap">
              <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
              <span>Jl. Raya Tegal - Slawi Km 5</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 font-medium whitespace-nowrap">
              <Phone className="h-3.5 w-3.5 text-slate-700 shrink-0" />
              <span className="font-mono font-bold text-slate-800">WA: 0812-3456-7890</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══ 1 SECTION REVIEW: HERO SECTION BERBASIS GAMBAR 1 (Aneesh N S) ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative bg-[#ECEEF2] overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-300/60 shadow-sm">
          
          {/* Typographic Watermark Background khas Gambar 1 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[11vw] font-black text-slate-300/40 uppercase tracking-tighter whitespace-nowrap z-0">
            BENGKEL MOTOR
          </div>

          <div className="relative z-10 space-y-8">
            
            {/* Category Segmented Control (Sinkron Otomatis dengan Animasi Motor) */}
            <div className="w-full max-w-xl mx-auto bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/70 shadow-inner">
              <div className="grid grid-cols-3 gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('matic')}
                  className={`py-2 px-2 rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    currentMotor.category === 'matic'
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Disc className={`h-4 w-4 shrink-0 ${currentMotor.category === 'matic' ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className="tracking-tight">Matic</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">CVT</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryClick('bebek')}
                  className={`py-2 px-2 rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    currentMotor.category === 'bebek'
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Bike className={`h-4 w-4 shrink-0 ${currentMotor.category === 'bebek' ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className="tracking-tight">Bebek</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">Cub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryClick('sport')}
                  className={`py-2 px-2 rounded-xl font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                    currentMotor.category === 'sport'
                      ? 'bg-white text-slate-950 shadow-sm border border-slate-300/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Gauge className={`h-4 w-4 shrink-0 ${currentMotor.category === 'sport' ? 'text-red-600' : 'text-slate-500'}`} />
                  <span className="tracking-tight">Sport</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-normal">Manual</span>
                </button>
              </div>
            </div>

            {/* 3-Column Focal Layout khas Gambar 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* 1. Kolom Kiri: Metric Spesifikasi & Kapasitas Bengkel */}
              <div className="lg:col-span-3 space-y-6 text-left order-3 lg:order-1">
                <div className="border-l-2 border-slate-400 pl-4 space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-slate-950">
                    5 MOTOR
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Kapasitas Slot per Jam
                  </div>
                </div>

                <div className="border-l-2 border-slate-400 pl-4 space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-slate-950">
                    3 LIFT
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Pit Hidrolik Aktif
                  </div>
                </div>

                <div className="border-l-2 border-slate-400 pl-4 space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-slate-950">
                    7 HARI
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Garansi Pengerjaan Servis
                  </div>
                </div>

                <div className="border-l-2 border-slate-400 pl-4 space-y-1">
                  <div className="text-3xl font-black font-mono tracking-tight text-red-600">
                    0 MENIT
                  </div>
                  <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    Bebas Antrean Datang Pagi
                  </div>
                </div>
              </div>

              {/* 2. Kolom Tengah: Centerpiece Motor Swiper & 360 Turntable Showcase */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center order-2 lg:order-2">
                
                {/* Stage Swiper Showcase (Swipeable, Auto-Slide 3s, Putar 360° on Hover/Touch, Tanpa Kotak & Tanpa Badge Teks) */}
                <div
                  ref={carouselContainerRef}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    setActiveFrame(1);
                  }}
                  onTouchStart={(e) => {
                    setIsHovered(true);
                    handleTouchStart(e);
                  }}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => {
                    setIsHovered(false);
                    setActiveFrame(1);
                    handleTouchEnd();
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="relative w-full max-w-xl lg:max-w-2xl h-68 sm:h-80 md:h-92 flex items-center justify-center select-none cursor-grab active:cursor-grabbing group"
                >
                  {/* Tombol Navigasi Kiri (Minimalist & Unobtrusive) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-0 z-30 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60 backdrop-blur-xs transition hover:scale-105 active:scale-95"
                    aria-label="Previous Motor"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Slides Render */}
                  {MOTOR_SLIDES.map((slide, idx) => {
                    const isActive = idx === currentIndex;

                    return (
                      <div
                        key={slide.category}
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                          isActive
                            ? 'opacity-100 translate-x-0 scale-100 z-10 pointer-events-auto'
                            : 'opacity-0 translate-x-8 scale-95 z-0 pointer-events-none'
                        }`}
                      >
                        {/* Jika di-hover dan motor memiliki 360 frames: putar frame sequence! */}
                        {isHovered && slide.has360 && slide.framesDir ? (
                          <img
                            src={`${slide.framesDir}/${activeFrame}.png`}
                            alt={slide.alt}
                            className="w-full h-full object-contain filter drop-shadow-2xl pointer-events-none"
                          />
                        ) : (
                          /* Tampilan Statis Studio Bersih (Front 3/4 Asli Pabrik) */
                          <img
                            src={slide.staticImage}
                            alt={slide.alt}
                            className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-300 pointer-events-none"
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Tombol Navigasi Kanan (Minimalist & Unobtrusive) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-0 z-30 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60 backdrop-blur-xs transition hover:scale-105 active:scale-95"
                    aria-label="Next Motor"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Diffused Ground Shadow (Alami di Bawah Ban, Tanpa Bounding Box Kotak) */}
                  <div className="absolute bottom-2 sm:bottom-3 w-5/6 h-6 sm:h-7 bg-slate-950/25 rounded-full blur-xl pointer-events-none z-0" />
                </div>

                {/* Minimalist Carousel Pagination Dots & 360 Hover Indicator */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    {MOTOR_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.category}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 transition-all rounded-full ${
                          idx === currentIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Indikator Hover 360 Interaktif */}
                  {currentMotor.has360 && (
                    <div className="transition-all duration-200">
                      {isHovered ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full shadow-2xs">
                          <RotateCw className="h-3 w-3 animate-spin text-red-600" />
                          <span>Putar 360° Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-white/80 border border-slate-200/70 px-3 py-1 rounded-full shadow-2xs">
                          <RotateCw className="h-3 w-3 text-slate-400" />
                          <span>Arahkan kursor untuk putar 360°</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Form Pencarian Buku Logbook Plat Nomor (Responsive & Self-Contained) */}
                <div className="w-full max-w-md mt-6 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-2xl p-3.5 shadow-md space-y-2">
                  <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Search className="h-3.5 w-3.5 text-slate-500" />
                      CEK RIWAYAT SERVIS MOTOR
                    </span>
                    <span className="text-red-600 uppercase font-mono text-[10px] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-bold">
                      Buku Digital
                    </span>
                  </div>

                  <form onSubmit={handleSearch} className="relative flex items-center bg-slate-100 border border-slate-300 rounded-xl p-1 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900 transition-all shadow-inner">
                    <input
                      type="text"
                      required
                      value={noPolisi}
                      onChange={(e) => setNoPolisi(e.target.value)}
                      placeholder="G 1234 ABC"
                      className="w-full bg-transparent px-3 py-2 text-slate-950 placeholder:text-slate-400 font-mono font-black text-sm uppercase tracking-wider focus:outline-none min-w-0"
                    />
                    <button
                      type="submit"
                      className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 active:scale-95 shadow-sm"
                    >
                      <span>Cari</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* 3. Kolom Kanan: Conversion Stack & Tombol Booking Crimson Red */}
              <div className="lg:col-span-3 space-y-6 text-left order-1 lg:order-3">
                <div className="space-y-2">
                  <div className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-red-600 bg-red-100/80 px-2.5 py-0.5 rounded">
                    Sistem Booking Resmi
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                    SERVIS MOTOR TEPAT WAKTU.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Tentukan jam kedatangan Anda sendiri. Teknisi siap mengerjakan motor Anda langsung pada slot pit yang dijadwalkan.
                  </p>
                </div>

                {/* Tombol Merah Khas Gambar 1 */}
                <div className="space-y-3 pt-2">
                  {user ? (
                    <Link
                      to={user.role === 'ADMIN' ? '/admin' : user.role === 'MECHANIC' ? '/mechanic' : '/customer/booking'}
                      className="w-full bg-[#E51A1A] hover:bg-[#c91414] text-white font-black text-sm py-4 px-6 rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wider"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Booking Slot Servis</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="w-full bg-[#E51A1A] hover:bg-[#c91414] text-white font-black text-sm py-4 px-6 rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wider text-center"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Booking Servis Sekarang</span>
                      </Link>

                      <Link
                        to="/login"
                        className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 text-center"
                      >
                        <span>Sudah Punya Akun? Masuk</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-300/80 pt-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Auto-Confirm: Tanpa antre manual saat tiba di bengkel</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══ Section Katalog Suku Cadang & Sparepart Asli ═══ */}
      <section id="katalog-sparepart" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 scroll-mt-24">
        <div className="bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-soft space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200/60 px-3 py-1 rounded-full">
                <Package className="h-3.5 w-3.5" />
                <span>Katalog Suku Cadang Resmi Standar Pabrikan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                SPAREPART &amp; PELUMAS ORIGINAL
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Jaminan 100% suku cadang asli bergaransi dengan nomor seri OEM resmi, teknisi bersertifikat, dan transparansi estimasi biaya servis tanpa markup tersembunyi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-3.5 py-2 rounded-2xl shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Garansi Resmi &amp; Jasa Pasang Bengkel</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-2xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Stok Ready di Rak Bengkel</span>
              </div>
            </div>
          </div>

          {/* Interactive Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/90 border border-slate-200/70 p-3 sm:p-4 rounded-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchSparepart}
                onChange={(e) => setSearchSparepart(e.target.value)}
                placeholder="Cari sparepart, tipe motor (Beat, NMAX, Vario...), atau kode OEM..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition shadow-2xs"
              />
              {searchSparepart && (
                <button
                  type="button"
                  onClick={() => setSearchSparepart('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="h-4 w-4 text-slate-500 hidden sm:block" />
              <select
                value={sortSparepart}
                onChange={(e) => setSortSparepart(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 transition shadow-2xs cursor-pointer"
              >
                <option value="popular">Urutkan: Rating &amp; Terpopuler</option>
                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Suku Cadang', count: SPAREPARTS_DATA.length },
              { id: 'pelumas', label: 'Pelumas & Filter', count: SPAREPARTS_DATA.filter((s) => s.category === 'pelumas').length },
              { id: 'pengereman', label: 'Pengereman & Ban', count: SPAREPARTS_DATA.filter((s) => s.category === 'pengereman').length },
              { id: 'pengapian', label: 'Pengapian & Aki', count: SPAREPARTS_DATA.filter((s) => s.category === 'pengapian').length },
              { id: 'drivetrain', label: 'Drivetrain & Suspensi', count: SPAREPARTS_DATA.filter((s) => s.category === 'drivetrain').length },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedSparepartCat(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                  selectedSparepartCat === cat.id
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    selectedSparepartCat === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Result Count */}
          {searchSparepart && (
            <div className="text-xs text-slate-500 font-medium">
              Menemukan <span className="font-bold text-slate-900">{filteredSpareparts.length}</span> suku cadang untuk kata kunci "{searchSparepart}"
            </div>
          )}

          {/* Product Grid (Bento Style) */}
          {filteredSpareparts.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Package className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <div className="font-bold text-slate-800 text-sm">Suku cadang tidak ditemukan</div>
              <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain atau hubungi CS WhatsApp kami untuk cek stok khusus.</p>
              <button
                type="button"
                onClick={() => { setSearchSparepart(''); setSelectedSparepartCat('all'); }}
                className="mt-3 text-xs font-bold text-red-600 hover:underline"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpareparts.map((item) => {
                const isSelected = selectedSparepartIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
                      isSelected ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200/90 hover:border-slate-900/30'
                    }`}
                  >
                    <div>
                      {/* Image Container with Zoom effect */}
                      <div className="relative aspect-square sm:aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center p-5 border-b border-slate-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                          <span className="bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                            {item.badge}
                          </span>
                          <span className="bg-slate-900/80 text-white text-[9px] font-mono px-2 py-0.5 rounded-full backdrop-blur-xs">
                            {item.oemCode}
                          </span>
                        </div>

                        {/* Stock Beacon */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs border border-slate-200 text-[10px] font-bold text-emerald-700 px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{item.stockCount} Ready</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-extrabold uppercase tracking-wider text-slate-400">{item.brand}</span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                            <span className="text-slate-400 text-[10px]">({item.soldCount})</span>
                          </div>
                        </div>

                        <div className="font-black text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors">
                          {item.name}
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <div className="text-[11px] font-medium text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-start gap-1.5">
                            <Bike className="h-3.5 w-3.5 text-slate-500 mt-0.5 shrink-0" />
                            <div className="line-clamp-1">
                              <span className="font-bold text-slate-700">Kompatibel: </span>
                              <span>{item.compatibility}</span>
                            </div>
                          </div>

                          <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50/70 rounded-lg px-2 py-1 border border-emerald-100 flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span>Interval: <strong>{item.intervalKm}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Harga Sparepart</div>
                          <div className="text-base font-black text-slate-900 font-mono tracking-tight">
                            {item.price}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Modal trigger */}
                          <button
                            type="button"
                            onClick={() => setDetailModalItem(item)}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-2 rounded-xl transition active:scale-95 cursor-pointer"
                            title="Lihat Spesifikasi & Tanda Ganti"
                          >
                            <Info className="h-3.5 w-3.5 text-slate-500" />
                            <span className="hidden sm:inline">Spek</span>
                          </button>

                          {/* Simulation Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleSelectSparepart(item.id)}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-2xs active:scale-95 shrink-0 cursor-pointer ${
                              isSelected
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Dipilih</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                <span>+ Simulasi</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive "Simulasi Estimasi Biaya Servis & Sparepart" Widget */}
          {selectedSparepartIds.length > 0 && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-2 border-red-500/30 rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-600/30 border border-red-500/40 flex items-center justify-center shrink-0">
                    <Calculator className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Simulasi Paket Servis &amp; Pasang Suku Cadang</h3>
                    <p className="text-xs text-slate-300">Estimasi transparan: Jasa servis bengkel + suku cadang asli pilihan Anda.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSparepartIds([])}
                  className="text-xs text-slate-400 hover:text-white underline self-start sm:self-auto cursor-pointer"
                >
                  Bersihkan Pilihan ({selectedSparepartIds.length})
                </button>
              </div>

              {/* Selected Items Pills */}
              <div className="flex flex-wrap gap-2">
                {selectedSparepartObjects.map((s) => (
                  <div
                    key={s.id}
                    className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs text-slate-200"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="font-mono text-red-400 font-bold">{s.price}</span>
                    <button
                      type="button"
                      onClick={() => toggleSelectSparepart(s.id)}
                      className="text-slate-400 hover:text-red-400 p-0.5 rounded-full cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Breakdown & CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Jasa Servis Ringan: <strong className="text-slate-200">Rp 45.000</strong></span>
                    <span>•</span>
                    <span>Sparepart ({selectedSparepartIds.length} item): <strong className="text-slate-200">Rp {subtotalSpareparts.toLocaleString('id-ID')}</strong></span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white font-mono flex items-center gap-2">
                    <span className="text-xs font-normal text-slate-400 uppercase tracking-wider font-sans">Total Estimasi:</span>
                    <span className="text-red-400">Rp {grandTotalEstimate.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <Link
                  to={user ? '/customer/booking' : '/login'}
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl transition shadow-lg shadow-red-600/30 active:scale-95 shrink-0"
                >
                  <span>Lanjut Booking Slot dengan Paket Ini</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center shrink-0">
                <Wrench className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className="font-bold text-sm">Butuh Suku Cadang Khusus atau Aksesoris Lain?</div>
                <div className="text-xs text-slate-300">Tim mekanik kami siap membantu mencarikan suku cadang original sesuai nomor rangka motor Anda.</div>
              </div>
            </div>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20BengkelMotor,%20saya%20ingin%20tanya%20ketersediaan%20sparepart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shrink-0 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <span>Tanya CS WhatsApp</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Image Attribution & Open Licensing Note */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>
                <strong>Atribusi Aset Media:</strong> Foto suku cadang dan pelumas bersumber dari basis data terbuka{' '}
                <a
                  href="https://commons.wikimedia.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-700 hover:text-red-600 underline inline-flex items-center gap-0.5"
                >
                  Wikimedia Commons
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>{' '}
                berlisensi resmi <em>Creative Commons (CC BY-SA / Public Domain)</em> untuk keperluan edukasi dan praktikum bengkel.
              </span>
            </div>
            <div className="text-slate-400 shrink-0 font-mono text-[10px]">
              OAS 3.1.0 • WebP Optimized • Zero Copyright Friction
            </div>
          </div>

        </div>
      </section>

      {/* ═══ Modal Detail Spesifikasi Teknis Suku Cadang (Apple / Dribbble Style) ═══ */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    {detailModalItem.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    {detailModalItem.oemCode}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {detailModalItem.name}
                </h3>
                <div className="text-xs text-slate-500 font-medium">
                  Brand Resmi: <strong className="text-slate-800">{detailModalItem.brand}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-full transition shrink-0 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
              {/* Product Preview + Stock Badge */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="w-32 h-32 bg-white rounded-xl overflow-hidden border border-slate-200 p-2 shrink-0 flex items-center justify-center shadow-2xs relative group">
                  <img
                    src={detailModalItem.image}
                    alt={detailModalItem.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 backdrop-blur-xs text-[9px] text-slate-300 text-center py-0.5 px-1 font-mono">
                    Wikimedia Commons CC
                  </div>
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {detailModalItem.desc}
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{detailModalItem.stockCount} Unit Tersedia</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>Rekomendasi: {detailModalItem.intervalKm}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="space-y-2.5">
                <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-red-600" />
                  <span>Spesifikasi Teknis Pabrikan</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {detailModalItem.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-center"
                    >
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{spec.label}</span>
                      <span className="text-slate-800 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Symptoms / Warning Box */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Gejala / Tanda Motor Perlu Penggantian Part Ini:</span>
                </div>
                <ul className="text-xs text-amber-950 space-y-1.5 pl-6 list-disc">
                  {detailModalItem.symptoms.map((symptom, idx) => (
                    <li key={idx} className="leading-relaxed">{symptom}</li>
                  ))}
                </ul>
              </div>

              {/* Compatibility Info */}
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">Kompatibilitas: </span>
                <span>{detailModalItem.compatibility}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Harga Resmi Suku Cadang</div>
                <div className="text-lg font-black text-slate-900 font-mono">{detailModalItem.price}</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    toggleSelectSparepart(detailModalItem.id);
                    setDetailModalItem(null);
                  }}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-2xs active:scale-95 cursor-pointer ${
                    selectedSparepartIds.includes(detailModalItem.id)
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {selectedSparepartIds.includes(detailModalItem.id) ? (
                    <>
                      <Minus className="h-3.5 w-3.5" />
                      <span>Hapus dari Simulasi</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>+ Tambah ke Simulasi</span>
                    </>
                  )}
                </button>

                <Link
                  to={user ? '/customer/booking' : '/login'}
                  onClick={() => setDetailModalItem(null)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-red-600/20 active:scale-95"
                >
                  <span>Pesan Sekarang</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═══ Akun Demo Pengujian Praktikum (Disimpan di Bawah untuk Evaluator) ═══ */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white/80 border border-slate-300 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Akun Pengujian Praktikum:</span>
            <span className="text-slate-500 font-mono\">(Password: password123)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Customer: budi@example.com</span>
            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Mechanic: agus@example.com</span>
            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">Admin: admin@example.com</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
