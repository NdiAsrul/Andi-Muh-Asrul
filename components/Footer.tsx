
import React from 'react';

interface FooterProps {
  onNavigate: (view: 'home' | 'admission' | 'dashboard' | 'thesis' | 'curriculum') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
             <div className="flex items-center gap-3">
              <img 
                src="https://uai.ac.id/wp-content/uploads/2025/05/logo-UAI-YPI.png" 
                alt="UAI Logo" 
                className="h-12"
              />
              <div>
                <h1 className="text-lg font-bold text-[#0F2C59] leading-tight">PRODI GIZI</h1>
                <p className="text-xs font-bold text-[#C5A059] tracking-widest">UNIVERSITAS AL-AZHAR INDONESIA</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Membangun peradaban melalui sains dan nilai-nilai Islami. Kami berdedikasi untuk mencetak tenaga profesional gizi yang amanah dan kompeten.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-[#0F2C59] mb-4 text-sm uppercase tracking-wider">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#C5A059] transition-colors">Program Studi</button></li>
              <li><button onClick={() => onNavigate('curriculum')} className="hover:text-[#C5A059] transition-colors">Kurikulum S1</button></li>
              <li><button onClick={() => onNavigate('admission')} className="hover:text-[#C5A059] transition-colors">Pendaftaran Mahasiswa</button></li>
              <li><button className="hover:text-[#C5A059] transition-colors">Portal Alumni</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-[#0F2C59] mb-4 text-sm uppercase tracking-wider">Kontak Kami</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                gizi@uai.ac.id
              </li>
              <li className="flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Komp. Masjid Agung Al-Azhar, Jakarta
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            &copy; 2025 UNIVERSITAS AL-AZHAR INDONESIA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-[#0F2C59] transition-all"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-slate-400 hover:text-[#0F2C59] transition-all"><i className="fab fa-youtube"></i></a>
            <a href="#" className="text-slate-400 hover:text-[#0F2C59] transition-all"><i className="fab fa-tiktok"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
