import React, { useState } from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  GraduationCap, 
  Home, 
  LayoutDashboard, 
  Menu, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  User as UserIcon, 
  X,
  Bookmark
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, courseId?: string) => void;
  currentUser: User;
  onSwitchUserRole: () => void;
  onOpenAuth: () => void;
  onOpenUpload: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onSwitchUserRole,
  onOpenAuth,
  onOpenUpload,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'past-questions', label: 'Past Questions', icon: GraduationCap },
    { 
      id: 'quiz', 
      label: 'AI Quiz', 
      icon: BrainCircuit, 
      highlight: true,
      badge: 'AI Powered' 
    },
    { 
      id: currentUser.role === 'admin' ? 'admin' : 'dashboard', 
      label: currentUser.role === 'admin' ? 'Admin Hub' : 'Dashboard', 
      icon: currentUser.role === 'admin' ? ShieldCheck : LayoutDashboard 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Banner for NOUN Academic Session */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>National Open University of Nigeria (NOUN) Academic Digital Resource & TMA Portal</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200">
            <span>2024/2025 Semester e-Registration Open</span>
            <button 
              onClick={onSwitchUserRole}
              className="text-amber-300 hover:text-amber-200 underline font-semibold transition-colors"
            >
              Current: {currentUser.role === 'admin' ? 'Administrator' : 'Student'} (Switch)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Logo */}
          <div 
            id="nav-brand-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 font-display">
                  NOUN<span className="text-emerald-700">StudyHub</span>
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                National Open University
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search CIT 432, GST 107, course title..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-emerald-500 rounded-full outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id || (link.id === 'courses' && currentView === 'course-detail');
              
              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    id={`nav-${link.id}`}
                    onClick={() => onNavigate(link.id)}
                    className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all shadow-xs ${
                      isActive 
                        ? 'bg-emerald-800 text-white shadow-emerald-800/30' 
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>{link.label}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 ml-0.5">
                      AI
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  id={`nav-${link.id}`}
                  onClick={() => onNavigate(link.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Upload Button - STRICTLY restricted to Administrators */}
            {currentUser.role === 'admin' && (
              <button
                id="header-upload-btn"
                onClick={onOpenUpload}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                title="Publish official courseware or past examination questions"
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                <span>Publish Resource</span>
              </button>
            )}

            {/* User Profile Badge */}
            <div 
              id="header-user-badge"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/70 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[110px]">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentUser.role === 'admin' ? 'Administrator' : currentUser.level}
                </span>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar if collapsed */}
        <div className="md:hidden pb-3 pt-1">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search CIT 432, GST 107, courses..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-lg outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left ${
                    isActive 
                      ? 'bg-emerald-800 text-white font-semibold' 
                      : link.highlight 
                        ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' 
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.highlight ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  onOpenUpload();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-emerald-800 text-white shadow-xs"
              >
                <UploadCloud className="w-4 h-4 text-amber-300" />
                <span>Publish Official NOUN Resource</span>
              </button>
            )}

            <button
              onClick={() => {
                onSwitchUserRole();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
            >
              <span>Current Account: <strong>{currentUser.role === 'admin' ? 'Administrator' : 'Student'}</strong> (Click to switch)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
