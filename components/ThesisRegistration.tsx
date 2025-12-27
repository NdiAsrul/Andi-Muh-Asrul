
import React, { useState } from 'react';
import { User } from '../types';
import { syncToSheets } from '../services/appscript';

interface ThesisRegistrationProps {
  user: User;
  onBack: () => void;
}

const ThesisRegistration: React.FC<ThesisRegistrationProps> = ({ user, onBack }) => {
  const [formData, setFormData] = useState({
    type: 'Proposal' as 'Proposal' | 'Hasil' | 'Sidang',
    title: '',
    p1: '',
    p2: '',
    file: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownloadTemplate = () => {
    // Creating a mock template file for demonstration
    const templateContent = `TEMPLATE PROPOSAL TUGAS AKHIR GIZI UAI\n\nNama: ${user.name}\nNIM: ${user.nim}\n\n[JUDUL PENELITIAN]\n\nBAB I PENDAHULUAN\n1.1 Latar Belakang\n1.2 Rumusan Masalah\n1.3 Tujuan Penelitian\n...`;
    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Template_Proposal_Gizi_UAI.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const syncRes = await syncToSheets({
      action: 'create',
      type: 'seminar',
      data: {
        id: `s-${Date.now()}`,
        studentName: user.name,
        nim: user.nim,
        type: formData.type,
        title: formData.title,
        pembimbing1: formData.p1,
        pembimbing2: formData.p2,
        date: '', 
        time: '', 
        room: '', 
        ketua: '', 
        penguji1: '', 
        penguji2: '', 
        status: 'Pending Scheduling'
      },
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(false);
    if (syncRes.success) {
      alert("Pendaftaran berhasil dikirim! Silakan cek dashboard secara berkala untuk jadwal.");
      onBack();
    } else {
      alert("Gagal mengirim pendaftaran. Periksa koneksi internet Anda.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#0F2C59]">Form Pendaftaran Seminar</h3>
            <p className="text-sm text-slate-500 font-medium">Lengkapi data pembimbing dan judul tugas akhir</p>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>
        </div>

        {/* Template Download Section */}
        <div className="mb-8 p-6 bg-[#fdf8f0] border border-[#C5A059]/20 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#C5A059] shadow-sm flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black text-[#C5A059] uppercase tracking-wider">Belum punya draf?</p>
              <p className="text-sm font-bold text-[#0F2C59]">Gunakan Template Resmi Gizi UAI</p>
            </div>
          </div>
          <button 
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-white border border-[#C5A059]/30 text-[#C5A059] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all shadow-sm"
          >
            Unduh Template
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Jenis Seminar</label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0F2C59]/10"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="Proposal">Seminar Proposal</option>
                <option value="Hasil">Seminar Hasil</option>
                <option value="Sidang">Sidang Skripsi</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Semester</label>
              <input type="text" value="Ganjil 2025/2026" disabled className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 font-bold" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Judul Penelitian (Final)</label>
            <textarea 
              rows={3}
              placeholder="Masukkan judul lengkap..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#0F2C59]/10 font-medium"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pembimbing Utama (1)</label>
              <input 
                type="text" 
                placeholder="Nama Dosen 1..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                value={formData.p1}
                onChange={(e) => setFormData({...formData, p1: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pembimbing Pendamping (2)</label>
              <input 
                type="text" 
                placeholder="Nama Dosen 2..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                value={formData.p2}
                onChange={(e) => setFormData({...formData, p2: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="p-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 text-center group hover:border-[#C5A059]/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-300 group-hover:text-[#C5A059] mb-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-sm font-bold text-[#0F2C59]">Upload Berkas (PDF)</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">Maksimal 10MB • Gabungkan semua syarat</p>
            <input type="file" className="hidden" id="file-reg" onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})} />
            <label htmlFor="file-reg" className="mt-4 inline-block px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-50 shadow-sm transition-all">
              {formData.file ? formData.file.name : 'Pilih File'}
            </label>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0F2C59] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/10 hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : 'Kirim Pendaftaran'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThesisRegistration;
