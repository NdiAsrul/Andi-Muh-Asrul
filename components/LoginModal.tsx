
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    let userName = 'User';
    if (role === UserRole.STUDENT) userName = 'Budi Setiawan';
    else if (role === UserRole.FACULTY) userName = 'Dr. Siti Aminah';
    else if (role === UserRole.ADMIN) userName = 'Admin Prodi Gizi';

    onLogin({
      id: identifier || 'ID001',
      name: userName,
      nim: role === UserRole.STUDENT ? identifier : undefined,
      email: (role === UserRole.FACULTY || role === UserRole.ADMIN) ? identifier : undefined,
      role: role
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-[#0F2C59] p-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <img src="https://uai.ac.id/wp-content/uploads/2025/05/logo-UAI-YPI.png" className="h-12 mx-auto mb-4 filter brightness-0 invert" />
            <h3 className="text-xl font-bold text-white">Portal Akademik Gizi</h3>
            <p className="text-white/60 text-xs font-medium tracking-widest uppercase mt-1">Sistem Terintegrasi</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8 overflow-x-auto">
            <button 
              onClick={() => setRole(UserRole.STUDENT)}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all min-w-[80px] ${role === UserRole.STUDENT ? 'bg-white text-[#0F2C59] shadow-sm' : 'text-slate-400'}`}
            >
              MAHASISWA
            </button>
            <button 
              onClick={() => setRole(UserRole.FACULTY)}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all min-w-[80px] ${role === UserRole.FACULTY ? 'bg-white text-[#0F2C59] shadow-sm' : 'text-slate-400'}`}
            >
              DOSEN
            </button>
            <button 
              onClick={() => setRole(UserRole.ADMIN)}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all min-w-[80px] ${role === UserRole.ADMIN ? 'bg-white text-[#0F2C59] shadow-sm' : 'text-slate-400'}`}
            >
              ADMIN
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                {role === UserRole.STUDENT ? 'NIM' : role === UserRole.FACULTY ? 'Email UAI' : 'Username Admin'}
              </label>
              <input 
                type="text" 
                placeholder={role === UserRole.STUDENT ? 'Contoh: 0106522xxx' : role === UserRole.FACULTY ? 'nama@uai.ac.id' : 'admin_prodi'}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F2C59]/10"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0F2C59]/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#0F2C59] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/10 hover:translate-y-[-1px] transition-all"
            >
              Masuk Sekarang
            </button>
            <div className="text-center">
              <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#C5A059] uppercase tracking-wider">Lupa Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
