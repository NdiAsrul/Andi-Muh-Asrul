
import React from 'react';

interface HeroProps {
  onRegisterClick: () => void;
  onCurriculumClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onRegisterClick, onCurriculumClick }) => {
  return (
    <div className="relative overflow-hidden bg-[#0F2C59] rounded-3xl text-white">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C5A059] rounded-full blur-3xl -ml-32 -mb-32"></div>
      </div>
      
      <div className="relative z-10 px-8 py-16 md:py-24 max-w-2xl">
        <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6">
          Penerimaan Mahasiswa Baru 2026
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
          Cetak Masa Depan Bersama <span className="text-[#C5A059]">Gizi UAI</span>
        </h2>
        <p className="text-slate-300 text-lg mb-10 leading-relaxed">
          Mencetak ahli gizi Islami, kompeten, dan berdaya saing global dengan kurikulum terintegrasi dan fasilitas laboratorium modern.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onRegisterClick}
            className="bg-[#C5A059] hover:bg-[#b38f4d] text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all"
          >
            Daftar Sekarang
          </button>
          <button 
            onClick={onCurriculumClick}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold transition-all"
          >
            Lihat Kurikulum
          </button>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 h-full w-1/3 hidden lg:block overflow-hidden">
        <img 
          src="https://picsum.photos/seed/nutrition/800/1200" 
          alt="Nutrition" 
          className="h-full w-full object-cover grayscale opacity-50"
        />
      </div>
    </div>
  );
};

export default Hero;
