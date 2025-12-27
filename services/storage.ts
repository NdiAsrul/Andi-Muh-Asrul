
/**
 * Simulated Database Service using LocalStorage
 * This allows data to persist across refreshes and integrates all modules.
 */

const STORAGE_KEYS = {
  STUDENTS: 'uai_gizi_students',
  FACULTY: 'uai_gizi_faculty',
  LOGBOOKS: 'uai_gizi_logbooks',
  SEMINARS: 'uai_gizi_seminars',
  AGENDAS: 'uai_gizi_agendas',
  ANNOUNCEMENTS: 'uai_gizi_announcements'
};

const INITIAL_DATA = {
  STUDENTS: [
    { nim: '0106522001', name: 'Andi Wijaya', year: '2022', status: 'Hasil' },
    { nim: '0106522045', name: 'Siti Rahma', year: '2022', status: 'Proposal' },
  ],
  FACULTY: [
    { id: 'f1', name: 'Dr. Siti Aminah', email: 'siti.aminah@uai.ac.id', spec: 'Gizi Klinik', guidance: 12 },
    { id: 'f2', name: 'Dr. Andi Wijaya', email: 'andi.wijaya@uai.ac.id', spec: 'Gizi Masyarakat', guidance: 10 },
  ],
  SEMINARS: [
    { 
      id: 's-init-1', 
      studentName: 'Andi Wijaya', 
      nim: '0106522001', 
      type: 'Hasil', 
      title: 'Analisis Zat Besi Cookies Daun Kelor',
      date: '2025-12-28', 
      time: '10:00', 
      room: 'R.302', 
      ketua: 'Dr. Siti Aminah', 
      penguji1: 'Dr. Andi Wijaya', 
      penguji2: '',
      pembimbing1: 'Laila Sari, M.Sc',
      status: 'Scheduled'
    },
    { 
      id: 's-init-2', 
      studentName: 'Siti Rahma', 
      nim: '0106522045', 
      type: 'Proposal', 
      title: 'Pola Makan Balita Stunting',
      date: '', 
      time: '', 
      room: '', 
      ketua: '', 
      penguji1: '', 
      penguji2: '',
      pembimbing1: 'Budi Santoso, M.Gizi',
      pembimbing2: 'Dr. Siti Aminah',
      status: 'Pending Scheduling'
    },
  ],
  AGENDAS: [
    { id: 'a1', event: 'Batas Input Nilai', date: '2025-12-30', time: '23:59', room: 'SIAKAD', category: 'Akademik' },
  ],
  ANNOUNCEMENTS: [
    { id: '1', title: 'Pendaftaran Yudisium 2026', content: 'Dibuka bagi yang sudah lulus sidang skripsi.', date: '2025-12-20' },
  ]
};

export const storage = {
  get: (key: string) => {
    const data = localStorage.getItem(key);
    if (!data) {
      const defaultKey = Object.keys(STORAGE_KEYS).find(k => (STORAGE_KEYS as any)[k] === key);
      const initial = (INITIAL_DATA as any)[defaultKey || ''];
      if (initial) storage.save(key, initial);
      return initial || [];
    }
    return JSON.parse(data);
  },
  save: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  keys: STORAGE_KEYS
};
