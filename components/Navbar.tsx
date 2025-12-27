
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onNavigate: (view: 'home' | 'admission' | 'dashboard' | 'thesis' | 'curriculum') => void;
}

interface SearchResult {
  type: 'Course' | 'Faculty' | 'Announcement' | 'Link' | 'Action';
  title: string;
  description: string;
  action?: () => void;
}

const SEARCH_DATA: SearchResult[] = [
  { type: 'Link', title: 'Struktur Kurikulum 2025', description: 'Lihat daftar mata kuliah semester 1-8.' },
  { type: 'Course', title: 'Gizi Klinik I', description: 'Mata kuliah dasar intervensi gizi klinik.' },
  { type: 'Course', title: 'Metabolisme Zat Gizi Makro', description: 'Studi mendalam karbohidrat, protein, dan lemak.' },
  { type: 'Course', title: 'Dietetika Penyakit Infeksi', description: 'Manajemen diet untuk pasien infeksi.' },
  { type: 'Faculty', title: 'Dr. Siti Aminah', description: 'Kepala Program Studi Gizi UAI.' },
  { type: 'Faculty', title: 'Dr. Andi Wijaya', description: 'Dosen Spesialis Gizi Masyarakat.' },
  { type: 'Faculty', title: 'Budi Santoso, M.Gizi', description: 'Dosen Gizi Olahraga & Kebugaran.' },
  { type: 'Announcement', title: 'Batas Akhir Input KRS', description: 'Berakhir pada 5 Januari 2026.' },
  { type: 'Announcement', title: 'Pendaftaran Yudisium Gel. 2', description: 'Dibuka hingga akhir Januari 2026.' },
  { type: 'Announcement', title: 'Beasiswa Gizi Berprestasi', description: 'Pendaftaran gelombang khusus 2026.' },
];

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onLogoutClick, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 1) {
      const filtered = SEARCH_DATA.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('');
    setShowResults(false);
    if (result.title.includes('Kurikulum')) {
      onNavigate('curriculum');
    } else if (result.type === 'Announcement') {
      onNavigate('home');
    } else if (result.type === 'Course') {
      onNavigate('curriculum');
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-3 cursor-pointer flex-shrink-0" 
          onClick={() => onNavigate('home')}
        >
          <img 
            src="https://uai.ac.id/wp-content/uploads/2025/05/logo-UAI-YPI.png" 
            alt="UAI Logo" 
            className="h-10"
          />
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold text-[#0F2C59] leading-tight uppercase">Prodi Gizi</h1>
            <p className="text-[9px] font-bold text-[#C5A059] tracking-[0.2em] uppercase">Al-Azhar Indonesia</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-grow max-w-md" ref={searchRef}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className={`h-4 w-4 transition-colors ${showResults ? 'text-[#0F2C59]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border-none bg-slate-100/80 rounded-full text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/10 focus:bg-white transition-all"
              placeholder="Cari kurikulum, dosen, pengumuman..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowResults(true)}
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-slate-50 bg-slate-50/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Hasil Pencarian</p>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {results.length > 0 ? (
                  results.map((result, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex flex-col gap-0.5 border-b border-slate-50 last:border-0"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          result.type === 'Course' ? 'bg-blue-100 text-blue-700' :
                          result.type === 'Faculty' ? 'bg-green-100 text-green-700' :
                          result.type === 'Link' ? 'bg-slate-200 text-slate-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {result.type}
                        </span>
                        <h4 className="text-sm font-bold text-[#0F2C59]">{result.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{result.description}</p>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-400 italic">Tidak ada hasil ditemukan untuk "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <button 
            onClick={() => onNavigate('home')}
            className="hidden sm:block text-slate-600 hover:text-[#0F2C59] font-bold text-sm transition-colors px-2 py-1"
          >
            Beranda
          </button>
          
          <button 
            onClick={() => onNavigate('curriculum')}
            className="hidden sm:block text-slate-600 hover:text-[#0F2C59] font-bold text-sm transition-colors px-2 py-1"
          >
            Kurikulum
          </button>
          
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="bg-[#0F2C59] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#1a4282] transition-all shadow-md active:scale-95"
              >
                Dashboard
              </button>
              <button 
                onClick={onLogoutClick}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Keluar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="bg-[#C5A059] text-white text-[10px] sm:text-xs font-extrabold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#b38f4d] shadow-lg shadow-gold/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">PORTAL AKADEMIK</span>
              <span className="sm:hidden">MASUK</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
