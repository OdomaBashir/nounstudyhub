import React from 'react';
import { GraduationCap, MapPin, Mail, Phone, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-16 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Institutional Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                NOUN<span className="text-emerald-400">StudyHub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier open digital learning archive and AI-powered examination revision platform for the National Open University of Nigeria (NOUN).
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Plot 91, Cadastral Zone, Nnamdi Azikiwe Expressway, Jabi, Abuja, Nigeria.</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@nounstudyhub.org</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-display">
              Academic Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('courses')} className="hover:text-emerald-400 transition-colors">
                  All NOUN Courses Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('materials')} className="hover:text-emerald-400 transition-colors">
                  Official Courseware Library
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('past-questions')} className="hover:text-emerald-400 transition-colors">
                  POP & E-Exam Past Papers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('quiz')} className="hover:text-amber-300 font-semibold text-emerald-300 transition-colors">
                  AI Quiz Practice Generator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Student Study Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: NOUN Faculties */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-display">
              Browse by Faculty
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('courses')}>Faculty of Sciences (FOS)</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('courses')}>Faculty of Management Sciences</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('courses')}>Faculty of Social Sciences</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('courses')}>Faculty of Arts & Humanities</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('courses')}>Faculty of Health Sciences</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('courses')}>Faculty of Law (LL.B)</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('courses')}>Faculty of Education & Agriculture</li>
            </ul>
          </div>

          {/* Column 4: Official NOUN Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-display">
              Official NOUN Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a 
                  href="https://nou.edu.ng" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <span>NOUN Official University Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nouonline.net" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <span>Student Portal & TMA Submission</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://elearn.nou.edu.ng" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                >
                  <span>NOUN E-Learn Virtual Classroom</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              <span className="font-bold text-amber-400 block mb-1">Android Mobile Optimized:</span>
              Save to your smartphone home screen for instant offline courseware reading and practice testing.
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} NOUN Study Hub. Designed for National Open University of Nigeria students.</p>
          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300">About NOUN Hub</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300">Study Centres & Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
