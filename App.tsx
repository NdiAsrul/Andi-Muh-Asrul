
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AdmissionSection from './components/AdmissionSection';
import LoginModal from './components/LoginModal';
import NutritionAI from './components/NutritionAI';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ThesisRegistration from './components/ThesisRegistration';
import CurriculumView from './components/CurriculumView';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'admission' | 'dashboard' | 'thesis' | 'curriculum' | 'admin'>('home');

  const handleLogin = (userData: User) => {
    setUser(userData);
    setLoginModalOpen(false);
    if (userData.role === UserRole.ADMIN) {
      setActiveView('admin');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar 
        user={user} 
        onLoginClick={() => setLoginModalOpen(true)} 
        onLogoutClick={handleLogout}
        onNavigate={(view) => setActiveView(view as any)}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeView === 'home' && (
          <div className="space-y-12">
            <Hero 
              onRegisterClick={() => setActiveView('admission')} 
              onCurriculumClick={() => setActiveView('curriculum')}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <AdmissionSection />
              </div>
              <div className="lg:col-span-1">
                <NutritionAI />
              </div>
            </div>
          </div>
        )}

        {activeView === 'admission' && (
          <AdmissionSection fullWidth onBack={() => setActiveView('home')} />
        )}

        {activeView === 'curriculum' && (
          <CurriculumView onBack={() => setActiveView('home')} />
        )}

        {activeView === 'dashboard' && user && user.role !== UserRole.ADMIN && (
          <Dashboard user={user} onRegisterThesis={() => setActiveView('thesis')} />
        )}

        {activeView === 'admin' && user && user.role === UserRole.ADMIN && (
          <AdminDashboard user={user} />
        )}

        {activeView === 'thesis' && user && (
          <ThesisRegistration user={user} onBack={() => setActiveView('dashboard')} />
        )}
      </main>

      <Footer onNavigate={(view) => setActiveView(view as any)} />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;
