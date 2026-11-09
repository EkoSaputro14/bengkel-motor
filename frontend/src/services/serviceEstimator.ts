export interface ServiceDurationEstimate {
  type: string;
  label: string;
  durationMinutes: number;
  durationFormatted: string;
  recommendedIntervalKm: number;
}

export const SERVICE_ESTIMATES: Record<string, ServiceDurationEstimate> = {
  ringan: {
    type: 'ringan',
    label: 'Servis Ringan & Ganti Oli',
    durationMinutes: 45,
    durationFormatted: '45 Menit',
    recommendedIntervalKm: 2000,
  },
  berkala: {
    type: 'berkala',
    label: 'Servis Berkala & Tune Up',
    durationMinutes: 75,
    durationFormatted: '1 Jam 15 Menit',
    recommendedIntervalKm: 4000,
  },
  besar: {
    type: 'besar',
    label: 'Servis Besar / Overhaul',
    durationMinutes: 180,
    durationFormatted: '3 Jam',
    recommendedIntervalKm: 10000,
  },
  cvt: {
    type: 'cvt',
    label: 'Pembersihan & Penggantian Roller/V-Belt CVT',
    durationMinutes: 60,
    durationFormatted: '1 Jam',
    recommendedIntervalKm: 8000,
  },
};

export function estimateServiceDuration(serviceType: string): ServiceDurationEstimate {
  const key = serviceType.toLowerCase();
  return (
    SERVICE_ESTIMATES[key] || {
      type: 'custom',
      label: 'Servis Kustom / Pemeriksaan Umum',
      durationMinutes: 60,
      durationFormatted: '± 60 Menit',
      recommendedIntervalKm: 3000,
    }
  );
}
