import React from 'react';
import { BookOpen, BrainCircuit, FileText, Home, LayoutDashboard, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  userRole,
}) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { 
      id: 'quiz', 
      label: 'AI Quiz', 
      icon: BrainCircuit, 
      isCenterAction: true 
    },
    { id: 'materials', label: 'Materials', icon: FileText },
    { 
      id: userRole === 'admin' ? 'admin' : 'dashboard', 
      label: userRole === 'admin' ? 'Admin' : 'Dashboard', 
      icon: LayoutDashboard 
    },
  ];

  return (
    <nav 
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl py-1.5 px-3"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'courses' && currentView === 'course-detail');

          if (item.isCenterAction) {
            return (
              <button
                key={item.id}
                id="mobile-nav-ai-quiz"
                onClick={() => onNavigate(item.id)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive 
                    ? 'bg-amber-400 text-slate-950 shadow-amber-500/40 ring-4 ring-emerald-800' 
                    : 'bg-gradient-to-tr from-emerald-800 to-emerald-700 text-amber-300 shadow-emerald-900/40'
                }`}>
                  <BrainCircuit className="w-6 h-6 animate-pulse" />
                </div>
                <span className={`text-[10px] font-extrabold mt-0.5 tracking-tight ${
                  isActive ? 'text-emerald-800' : 'text-slate-700'
                }`}>
                  AI Quiz
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors active:scale-95 ${
                isActive ? 'text-emerald-800 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-800 stroke-[2.4]' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
