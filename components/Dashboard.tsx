
import React, { useState, useEffect } from 'react';
import { User, UserRole, Seminar, Announcement, LogbookEntry } from '../types';
import { syncToSheets, fetchSheetsData } from '../services/appscript';

interface DashboardProps {
  user: User;
  onRegisterThesis: () => void;
}

interface Guidance {
  id: string;
  studentName: string;
  nim: string;
  thesisTitle: string;
  stage: 'Proposal' | 'Hasil' | 'Sidang';
  nextStep: string;
  avatar: string;
  progress: number;
  logbook: LogbookEntry[];
}

const DUMMY_GUIDANCE: Guidance[] = [
  {
    id: 'g1',
    studentName: 'Andi Wijaya',
    nim: '0106522001',
    thesisTitle: 'Analisis Kandungan Zat Besi pada Cookies Berbasis Tepung Daun Kelor',
    stage: 'Hasil',
    nextStep: 'Revisi Bab IV dan persiapan draf artikel publikasi.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
    progress: 75,
    logbook: [
      { id: 'l1', date: '2025-11-10', topic: 'Bab III: Metodologi', notes: 'Perbaikan pada teknik sampling.', status: 'Valid' },
      { id: 'l2', date: '2025-11-25', topic: 'Analisis Lab', notes: 'Data sudah lengkap, lanjut olah statistik.', status: 'Valid' },
      { id: 'l3', date: '2025-12-05', topic: 'Bab IV: Pembahasan', notes: 'Fokus pada kaitan hasil dengan literatur.', status: 'Pending' }
    ]
  },
  {
    id: 'g2',
    studentName: 'Siti Rahma',
    nim: '0106522045',
    thesisTitle: 'Hubungan Pola Makan dengan Status Gizi Balita di Puskesmas Kebayoran Baru',
    stage: 'Proposal',
    nextStep: 'Finalisasi instrumen kuesioner dan pengajuan etik penelitian.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    progress: 30,
    logbook: [
      { id: 'l4', date: '2025-11-15', topic: 'Studi Pendahuluan', notes: 'Data puskesmas sudah didapat.', status: 'Valid' },
      { id: 'l5', date: '2025-12-01', topic: 'Bab I: Latar Belakang', notes: 'Perkuat urgensi penelitian.', status: 'Revisi' }
    ]
  },
  {
    id: 'g3',
    studentName: 'Budi Santoso',
    nim: '0106522012',
    thesisTitle: 'Pengembangan Formula MP-ASI Instan Berbasis Pangan Lokal untuk Pencegahan Stunting',
    stage: 'Sidang',
    nextStep: 'Melengkapi berkas pendaftaran yudisium dan bebas pustaka.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    progress: 95,
    logbook: [
      { id: 'l6', date: '2025-10-20', topic: 'Revisi Hasil', notes: 'Selesai.', status: 'Valid' },
      { id: 'l7', date: '2025-11-30', topic: 'Draft Skripsi Final', notes: 'ACC Sidang.', status: 'Valid' }
    ]
  }
];

const Dashboard: React.FC<DashboardProps> = ({ user, onRegisterThesis }) => {
  const isFaculty = user.role === UserRole.FACULTY;
  const [seminarFilter, setSeminarFilter] = useState<'All' | 'Proposal' | 'Hasil' | 'Sidang'>('All');
  const [selectedGuidance, setSelectedGuidance] = useState<Guidance | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Dynamic state
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [agendas, setAgendas] = useState<any[]>([]);

  useEffect(() => {
    loadDynamicData();
  }, []);

  const loadDynamicData = async () => {
    setSeminars(await fetchSheetsData('seminar'));
    setAnnouncements(await fetchSheetsData('announcement'));
    setAgendas(await fetchSheetsData('agenda'));
  };

  const filteredSeminars = seminars.filter(seminar => 
    seminarFilter === 'All' ? true : seminar.type === seminarFilter
  );

  const handleOpenFeedback = (guidance: Guidance) => {
    setSelectedGuidance(guidance);
    setIsFeedbackModalOpen(true);
  };

  const handleOpenProgress = (guidance: Guidance) => {
    setSelectedGuidance(guidance);
    setIsProgressModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim() || !selectedGuidance) return;
    
    setIsSubmittingFeedback(true);
    const syncRes = await syncToSheets({
      action: 'create',
      type: 'logbook',
      data: {
        id: `l${Date.now()}`,
        nim: selectedGuidance.nim,
        studentName: selectedGuidance.studentName,
        feedback: feedbackText,
        facultyId: user.id,
        date: new Date().toISOString().split('T')[0],
        status: 'Valid'
      },
      timestamp: new Date().toISOString()
    });

    if (syncRes.success) {
      alert(`Feedback untuk ${selectedGuidance.studentName} telah disimpan.`);
      setIsFeedbackModalOpen(false);
      setFeedbackText('');
    } else {
      alert('Gagal sinkronisasi dengan database Google Sheets.');
    }
    setIsSubmittingFeedback(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img 
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
            alt={user.name} 
            className="w-24 h-24 rounded-2xl bg-slate-100 object-cover border-4 border-slate-50 shadow-inner"
          />
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-[#0F2C59] mb-1">Halo, {user.name}</h2>
          <p className="text-slate-500 font-medium mb-4">{isFaculty ? 'Dosen Pembimbing Gizi' : `Mahasiswa - ${user.nim}`}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-3 py-1 bg-[#F0F4F8] text-[#0F2C59] text-[10px] font-bold rounded-full uppercase tracking-wider">TA 2025/2026</span>
            <span className="px-3 py-1 bg-[#fdf8f0] text-[#C5A059] text-[10px] font-bold rounded-full uppercase tracking-wider">Prodi Gizi UAI</span>
          </div>
        </div>
        <div className="flex-grow"></div>
        {!isFaculty && (
          <button 
            onClick={onRegisterThesis}
            className="bg-[#C5A059] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-gold/20 hover:translate-y-[-2px] transition-all"
          >
            Daftar Seminar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          {/* Faculty View */}
          {isFaculty && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-[#0F2C59] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#C5A059]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Bimbingan Aktif Anda
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {DUMMY_GUIDANCE.map((guidance) => (
                  <div key={guidance.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0 relative">
                        <img src={guidance.avatar} className="w-20 h-20 rounded-2xl bg-white border shadow-sm" alt={guidance.studentName} />
                        <div className="absolute -bottom-2 -right-2 bg-[#0F2C59] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                          {guidance.progress}%
                        </div>
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-[#0F2C59]">{guidance.studentName}</h4>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                guidance.stage === 'Proposal' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                guidance.stage === 'Hasil' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                'bg-purple-50 text-purple-600 border-purple-100'
                              }`}>
                                {guidance.stage}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">NIM: {guidance.nim}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-700 leading-relaxed line-clamp-2">"{guidance.thesisTitle}"</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => handleOpenProgress(guidance)} className="flex-1 min-w-[120px] py-2.5 bg-white border border-[#0F2C59] text-[#0F2C59] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0F2C59] hover:text-white transition-all">View Progress</button>
                          <button onClick={() => handleOpenFeedback(guidance)} className="flex-1 min-w-[120px] py-2.5 bg-[#0F2C59] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all">Give Feedback</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student View Widgets */}
          {!isFaculty && (
            <div className="space-y-8">
              {/* Target Capaian Widget */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-[#0F2C59] mb-4 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#C5A059]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  Target Capaian Tugas Akhir
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                  <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                    <p className="text-[10px] font-black text-green-600 uppercase mb-2">Seminar Proposal</p>
                    <p className="text-sm font-bold text-slate-700">Lulus (A)</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <p className="text-[10px] font-black text-yellow-600 uppercase mb-2">Seminar Hasil</p>
                    <p className="text-sm font-bold text-slate-700">Dijadwalkan (30 Des)</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Sidang Skripsi</p>
                    <p className="text-sm font-bold text-slate-400">Belum Terdaftar</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Seminars Widget */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#0F2C59] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#C5A059]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Jadwal Seminar Mendatang
                  </h3>
                  <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                    {['All', 'Proposal', 'Hasil', 'Sidang'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setSeminarFilter(f as any)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${seminarFilter === f ? 'bg-white text-[#0F2C59] shadow-sm' : 'text-slate-400'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3">Mahasiswa</th>
                        <th className="px-4 py-3">Jenis</th>
                        <th className="px-4 py-3 text-center">Waktu</th>
                        <th className="px-4 py-3">Ruangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredSeminars.slice(0, 5).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 font-bold text-[#0F2C59]">{s.studentName}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              s.type === 'Proposal' ? 'bg-blue-100 text-blue-600' : 
                              s.type === 'Hasil' ? 'bg-orange-100 text-orange-600' : 
                              'bg-purple-100 text-purple-600'
                            }`}>{s.type}</span>
                          </td>
                          <td className="px-4 py-4 text-slate-500 text-xs text-center">{s.date} <br/> {s.time}</td>
                          <td className="px-4 py-4 text-slate-500 font-bold text-xs">{s.room}</td>
                        </tr>
                      ))}
                      {filteredSeminars.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic text-xs">Belum ada jadwal untuk kategori ini.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Announcements Widget */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-[#0F2C59] mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#C5A059]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Pengumuman Terbaru
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="group cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span>
                        <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">{ann.date}</p>
                      </div>
                      <h4 className="text-sm font-bold text-[#0F2C59] group-hover:text-[#C5A059] transition-colors leading-tight mb-2">{ann.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Common Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-[#0F2C59] mb-4">Agenda Mendatang</h3>
            <div className="space-y-4">
              {agendas.map(agenda => (
                <div key={agenda.id} className="flex gap-4 items-start group cursor-pointer">
                  <div className="bg-[#fdf8f0] text-[#C5A059] px-3 py-2 rounded-xl text-center min-w-[55px] shadow-sm group-hover:scale-105 transition-all">
                    <span className="block text-sm font-bold">{agenda.date.split('-')[2]}</span>
                    <span className="text-[8px] font-black uppercase">BLN</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F2C59]">{agenda.event}</h4>
                    <p className="text-[10px] text-slate-400 italic">{agenda.room} • {agenda.time} WIB</p>
                  </div>
                </div>
              ))}
              {agendas.length === 0 && (
                <p className="text-xs text-slate-400 italic">Belum ada agenda akademik.</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0F2C59] to-[#1e448a] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
              <p className="text-xs text-white/70 mb-6 leading-relaxed">Hubungi admin prodi melalui WhatsApp untuk informasi lebih cepat terkait akademik.</p>
              <button className="w-full py-3 bg-green-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg">WhatsApp Admin</button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {isFeedbackModalOpen && selectedGuidance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFeedbackModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="bg-[#0F2C59] p-6 text-white flex justify-between items-center">
              <div>
                <h4 className="text-xl font-bold">Berikan Feedback</h4>
                <p className="text-xs opacity-70">Mahasiswa: {selectedGuidance.studentName}</p>
              </div>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0F2C59]/10 text-sm"
                rows={6}
                placeholder="Pesan feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              ></textarea>
              <div className="flex gap-4">
                <button onClick={() => setIsFeedbackModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-xs font-bold">Batal</button>
                <button onClick={handleSubmitFeedback} disabled={isSubmittingFeedback || !feedbackText.trim()} className="flex-1 px-4 py-3 bg-[#0F2C59] text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50">
                  {isSubmittingFeedback ? 'Mengirim...' : 'Kirim Feedback'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROGRESS MODAL */}
      {isProgressModalOpen && selectedGuidance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProgressModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-300">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-[#0F2C59]">Logbook & Progress</h4>
                <p className="text-xs text-slate-500">{selectedGuidance.studentName} ({selectedGuidance.nim})</p>
              </div>
              <button onClick={() => setIsProgressModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tahap Saat Ini</p>
                    <p className="text-sm font-bold text-[#0F2C59]">{selectedGuidance.stage}</p>
                 </div>
                 <div className="p-4 bg-[#fdf8f0] rounded-2xl text-center">
                    <p className="text-[10px] font-black text-[#C5A059] uppercase mb-1">Progress Keseluruhan</p>
                    <p className="text-sm font-bold text-[#0F2C59]">{selectedGuidance.progress}%</p>
                 </div>
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#0F2C59] mb-4 uppercase tracking-wider">Riwayat Bimbingan</h5>
                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {selectedGuidance.logbook.map((log) => (
                    <div key={log.id} className="relative pl-8 group">
                      <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-all ${
                        log.status === 'Valid' ? 'bg-green-500' : 
                        log.status === 'Revisi' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.date}</p>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            log.status === 'Valid' ? 'bg-green-100 text-green-700' : 
                            log.status === 'Revisi' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <h6 className="text-xs font-bold text-[#0F2C59] mb-1">{log.topic}</h6>
                        <p className="text-xs text-slate-600 italic">"{log.notes}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
               <button onClick={() => setIsProgressModalOpen(false)} className="px-6 py-2 bg-[#0F2C59] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg transition-all">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
