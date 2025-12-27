
import React, { useState } from 'react';

interface Course {
  no: number;
  kode: string;
  nama: string;
  teori: number;
  praktikum: number;
  praktek: number;
  jumlah: number;
}

interface SemesterData {
  semester: number;
  courses: Course[];
  totalSks: number;
}

const CURRICULUM_DATA: SemesterData[] = [
  {
    semester: 1,
    totalSks: 19,
    courses: [
      { no: 1, kode: 'MKWU', nama: 'Pendidikan Agama Islam*', teori: 3, praktikum: 0, praktek: 0, jumlah: 3 },
      { no: 2, kode: 'MKWU', nama: 'Bahasa Inggris Akademik*', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 3, kode: 'MKP', nama: 'Kimia Dasar**', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 4, kode: 'MKP', nama: 'Matematika Dasar**', teori: 3, praktikum: 0, praktek: 0, jumlah: 3 },
      { no: 5, kode: 'MKP', nama: 'Fisika Dasar B**', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 6, kode: 'MKP', nama: 'Dasar Pemrograman', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 7, kode: 'MKP', nama: 'Biologi Dasar', teori: 3, praktikum: 0, praktek: 0, jumlah: 3 },
    ]
  },
  {
    semester: 2,
    totalSks: 20,
    courses: [
      { no: 1, kode: 'MKWU', nama: 'Bahasa Arab Akademik*', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 2, kode: 'MKWU', nama: 'Kewarganegaraan*', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 3, kode: 'MKWU', nama: 'Pancasila*', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 4, kode: 'MKP', nama: 'Anatomi Manusia', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 5, kode: 'MKP', nama: 'Ilmu Gizi Dasar', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 6, kode: 'MKP', nama: 'Antropologi Gizi', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 7, kode: 'MKP', nama: 'Pengantar Statistika', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 8, kode: 'MKP', nama: 'Pangan Halal dan Thayyib', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 9, kode: 'MKP', nama: 'Dasar Komunikasi', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
    ]
  },
  {
    semester: 3,
    totalSks: 23,
    courses: [
      { no: 1, kode: 'MKWU', nama: 'Bahasa Indonesia*', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 2, kode: 'MKWU', nama: 'Islam Lintas Disiplin Ilmu*', teori: 3, praktikum: 0, praktek: 0, jumlah: 3 },
      { no: 3, kode: 'MKF', nama: 'Kreativitas dan Entrepreneur**', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 4, kode: 'MKP', nama: 'Fisiologi Manusia', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 5, kode: 'MKP', nama: 'Pengantar Biokimia', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 6, kode: 'MKP', nama: 'Gizi dalam Daur Kehidupan', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 7, kode: 'MKP', nama: 'Ilmu Bahan Makanan', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 8, kode: 'MKP', nama: 'Pengantar Psikologi', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 9, kode: 'MKP', nama: 'Pengantar Manajemen', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
    ]
  },
  {
    semester: 4,
    totalSks: 23,
    courses: [
      { no: 1, kode: 'MKP', nama: 'Patofisiologi', teori: 3, praktikum: 1, praktek: 0, jumlah: 4 },
      { no: 2, kode: 'MKP', nama: 'Metabolisme Zat Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 3, kode: 'MKP', nama: 'Penilaian Status Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 4, kode: 'MKP', nama: 'Penilaian Konsumsi Pangan', teori: 1, praktikum: 1, praktek: 0, jumlah: 2 },
      { no: 5, kode: 'MKP', nama: 'Pengantar Kulinari', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 6, kode: 'MKP', nama: 'Analisis Zat Gizi Pangan', teori: 3, praktikum: 1, praktek: 0, jumlah: 4 },
      { no: 7, kode: 'MKP', nama: 'Gizi Olahraga', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 8, kode: 'MKPil', nama: 'MK Pilihan Program Studi', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
    ]
  },
  {
    semester: 5,
    totalSks: 24,
    courses: [
      { no: 1, kode: 'MKF', nama: 'Technopreneur**', teori: 3, praktikum: 0, praktek: 0, jumlah: 3 },
      { no: 2, kode: 'MKP', nama: 'Dietetika Penyakit Infeksi dan Defisiensi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 3, kode: 'MKP', nama: 'Analisis Data Pangan dan Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 4, kode: 'MKP', nama: 'Evaluasi Nilai Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 5, kode: 'MKP', nama: 'Pengembangan Produk Pangan', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 6, kode: 'MKP', nama: 'Sistem Jaminan Produk Halal', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 7, kode: 'MKP', nama: 'Gizi Perkotaan', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 8, kode: 'MKP', nama: 'Epidemiologi Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 9, kode: 'MKPil', nama: 'MK Pilihan Lintas Program', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
    ]
  },
  {
    semester: 6,
    totalSks: 22,
    courses: [
      { no: 1, kode: 'MKWU', nama: 'Kepemimpinan dan Karakter Korporasi*', teori: 3, praktikum: 0, praktek: 0, jumlah: 3 },
      { no: 2, kode: 'MKP', nama: 'Dietetika Penyakit Degeneratif', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 3, kode: 'MKP', nama: 'Manajemen Jasa Makanan dan Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 4, kode: 'MKP', nama: 'Bioetika', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
      { no: 5, kode: 'MKP', nama: 'Pendidikan Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 6, kode: 'MKP', nama: 'Konsultasi Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 7, kode: 'MKP', nama: 'Metodologi Penelitian Gizi', teori: 2, praktikum: 1, praktek: 0, jumlah: 3 },
      { no: 8, kode: 'MKPil', nama: 'Perencanaan Pangan dan Gizi', teori: 2, praktikum: 0, praktek: 0, jumlah: 2 },
    ]
  },
  {
    semester: 7,
    totalSks: 8,
    courses: [
      { no: 1, kode: 'MKP', nama: 'Pengabdian Masyarakat', teori: 0, praktikum: 0, praktek: 3, jumlah: 3 },
      { no: 2, kode: 'MKP', nama: 'Praktik Kerja Lapang Bidang Manajemen Pelayanan Makanan', teori: 0, praktikum: 0, praktek: 2, jumlah: 2 },
      { no: 3, kode: 'MKP', nama: 'Praktik Kerja Lapang Bidang Dietetika', teori: 0, praktikum: 0, praktek: 3, jumlah: 3 },
    ]
  },
  {
    semester: 8,
    totalSks: 7,
    courses: [
      { no: 1, kode: 'MKP', nama: 'Seminar', teori: 0, praktikum: 0, praktek: 1, jumlah: 1 },
      { no: 2, kode: 'MKP', nama: 'Skripsi', teori: 0, praktikum: 0, praktek: 6, jumlah: 6 },
    ]
  }
];

const CurriculumView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeSem, setActiveSem] = useState(1);

  const currentData = CURRICULUM_DATA.find(d => d.semester === activeSem);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#0F2C59]">Struktur Kurikulum</h2>
            <p className="text-slate-500 font-medium">Program Studi Gizi - Angkatan 2025</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-[#C5A059] uppercase tracking-wider hover:text-[#0F2C59] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </button>
        </div>

        {/* Semester Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-slate-100 rounded-2xl w-fit">
          {CURRICULUM_DATA.map((d) => (
            <button
              key={d.semester}
              onClick={() => setActiveSem(d.semester)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSem === d.semester 
                  ? 'bg-[#0F2C59] text-white shadow-lg' 
                  : 'text-slate-400 hover:text-[#0F2C59] hover:bg-white'
              }`}
            >
              SEMESTER {d.semester}
            </button>
          ))}
        </div>

        {/* Course Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0F2C59] text-white text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-5 text-center w-16">No</th>
                <th className="px-6 py-5 w-24">Kode</th>
                <th className="px-6 py-5 min-w-[300px]">Mata Kuliah (MK)</th>
                <th className="px-6 py-5 text-center">Teori</th>
                <th className="px-6 py-5 text-center">Praktikum</th>
                <th className="px-6 py-5 text-center">Praktek</th>
                <th className="px-6 py-5 text-center bg-[#C5A059] w-24">SKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentData?.courses.map((course) => (
                <tr key={`${activeSem}-${course.no}`} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-[#0F2C59]">{course.no}</td>
                  <td className="px-6 py-4 font-bold text-[#0F2C59]">{course.kode}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700 leading-tight">{course.nama}</p>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500 font-medium">{course.teori || '-'}</td>
                  <td className="px-6 py-4 text-center text-slate-500 font-medium">{course.praktikum || '-'}</td>
                  <td className="px-6 py-4 text-center text-slate-500 font-medium">{course.praktek || '-'}</td>
                  <td className="px-6 py-4 text-center font-black text-[#0F2C59] bg-[#fdf8f0]/30">{course.jumlah}</td>
                </tr>
              ))}
              <tr className="bg-slate-50/80 font-black">
                <td colSpan={6} className="px-6 py-5 text-right text-[#0F2C59] uppercase tracking-widest text-[11px]">Total Beban Studi Semester {activeSem}</td>
                <td className="px-6 py-5 text-center text-[#0F2C59] text-lg bg-[#fdf8f0] border-t-2 border-[#C5A059]">{currentData?.totalSks}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-[#fdf8f0]/40 rounded-2xl border border-[#C5A059]/10">
            <h4 className="text-sm font-bold text-[#0F2C59] mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full"></span>
              Keterangan
            </h4>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
              <li className="flex gap-2">
                <span className="text-[#C5A059]">*</span> 
                <span>Mata Kuliah Wajib Universitas (MKWU)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#C5A059]">**</span> 
                <span>Mata Kuliah Fakultas (MKF)</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-[#f0f4f8]/40 rounded-2xl border border-[#0F2C59]/10">
            <h4 className="text-sm font-bold text-[#0F2C59] mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#0F2C59] rounded-full"></span>
              Ringkasan SKS
            </h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-bold">Target Kelulusan</span>
              <span className="text-sm font-black text-[#0F2C59]">146 SKS</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#C5A059] h-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Sesuai dengan SN-DIKTI dan Kerangka Kualifikasi Nasional Indonesia (KKNI)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumView;
