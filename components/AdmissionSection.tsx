
import React, { useState } from 'react';
import IDCardGenerator from './IDCardGenerator';

interface AdmissionSectionProps {
  fullWidth?: boolean;
  onBack?: () => void;
}

const AdmissionSection: React.FC<AdmissionSectionProps> = ({ fullWidth, onBack }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'calculator' | 'idcard'>('info');

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${fullWidth ? 'w-full' : ''}`}>
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0F2C59]">Informasi Pendaftaran</h3>
          <p className="text-sm text-slate-500">Masa Depan Ahli Gizi Berawal di Sini</p>
        </div>
        {onBack && (
          <button onClick={onBack} className="text-sm text-[#0F2C59] font-bold flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali
          </button>
        )}
      </div>

      <div className="flex border-b border-slate-100 bg-white">
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-4 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'info' ? 'text-[#0F2C59] border-b-2 border-[#0F2C59]' : 'text-slate-400'}`}
        >
          Sekilas Prodi
        </button>
        <button 
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-4 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'calculator' ? 'text-[#0F2C59] border-b-2 border-[#0F2C59]' : 'text-slate-400'}`}
        >
          Kalkulator Biaya
        </button>
        <button 
          onClick={() => setActiveTab('idcard')}
          className={`flex-1 py-4 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'idcard' ? 'text-[#0F2C59] border-b-2 border-[#0F2C59]' : 'text-slate-400'}`}
        >
          ID Card Generator
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'info' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-[#f0f4f8] rounded-xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#C5A059] mb-4 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-bold text-[#0F2C59] mb-2">Akreditasi Baik Sekali</h4>
                <p className="text-xs text-slate-600">Lulusan diakui secara nasional oleh LAM-PTKes dengan kurikulum standar internasional.</p>
              </div>
              <div className="p-5 bg-[#fdf8f0] rounded-xl border border-[#C5A059]/20">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#C5A059] mb-4 shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.547 2.188a2 2 0 00.75 2.106l1.747 1.166a2 2 0 002.43 0l1.747-1.166a2 2 0 00.75-2.106l-.547-2.188zM4.572 15.428a2 2 0 011.022-.547l2.387-.477a2 2 0 011.96 1.414l.547 2.188a2 2 0 01-.75 2.106l-1.747 1.166a2 2 0 01-2.43 0L3.825 20.44a2 2 0 01-.75-2.106l.547-2.188z" />
                  </svg>
                </div>
                <h4 className="font-bold text-[#0F2C59] mb-2">Jejaring Alumni</h4>
                <p className="text-xs text-slate-600">Memiliki jaringan alumni yang luas di rumah sakit, kementerian, dan industri pangan.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#0F2C59] to-[#1E4D8C] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-4">Potongan Biaya Gelombang 1</h4>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-[#C5A059]">Rp 4.000.000</span>
                  <span className="text-sm opacity-80">Off</span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  Dapatkan potongan biaya kuliah untuk pendaftar gelombang pertama dan tambahan diskon 25% bagi pembayaran lunas.
                </p>
                <button className="bg-[#C5A059] text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-all">
                  Ambil Kuota Sekarang
                </button>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <TuitionCalculator />
        )}

        {activeTab === 'idcard' && (
          <IDCardGenerator />
        )}
      </div>
    </div>
  );
};

const TuitionCalculator: React.FC = () => {
  const [jalur, setJalur] = useState('reguler');
  const [nilai, setNilai] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    let base = 18552000;
    let discount = 0;
    if (jalur === 'prestasi') discount = base * 0.4;
    else if (jalur === 'undangan') discount = base * 0.2;
    
    setResult(base - discount);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jalur Masuk</label>
          <select 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0F2C59]/20"
            value={jalur}
            onChange={(e) => setJalur(e.target.value)}
          >
            <option value="reguler">Reguler</option>
            <option value="prestasi">Jalur Prestasi (Rapor)</option>
            <option value="undangan">Jalur Undangan Sekolah</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rata-rata Rapor (Smt 1-5)</label>
          <input 
            type="number" 
            placeholder="Contoh: 85"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0F2C59]/20"
            value={nilai}
            onChange={(e) => setNilai(e.target.value)}
          />
        </div>
        <button 
          onClick={calculate}
          className="w-full bg-[#0F2C59] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Hitung Estimasi
        </button>
      </div>

      {result !== null && (
        <div className="bg-[#f0f4f8] rounded-xl p-6 text-center animate-in fade-in zoom-in-95">
          <p className="text-slate-500 text-sm mb-1">Estimasi Biaya Semester 1</p>
          <h4 className="text-3xl font-extrabold text-[#0F2C59]">Rp {result.toLocaleString('id-ID')}</h4>
          <p className="text-[10px] text-slate-400 mt-4 italic font-medium">*Hasil ini hanya estimasi. Biaya final ditentukan oleh Panitia PMB.</p>
        </div>
      )}
    </div>
  );
};

export default AdmissionSection;
