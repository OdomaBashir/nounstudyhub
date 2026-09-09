import React from 'react';
import { GraduationCap, BookOpen, ShieldCheck, Globe, Users, Award, MapPin } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      
      {/* Hero Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-emerald-800" />
          <span>NATIONAL OPEN UNIVERSITY OF NIGERIA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          Empowering NOUN Learners Through Accessible Digital Education
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          NOUN Study Hub is the dedicated central digital repository and AI-assisted examination preparatory system built exclusively for students of the National Open University of Nigeria.
        </p>
      </div>

      {/* Institutional Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base font-display">Distance Learning Pioneer</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            NOUN is Nigeria&apos;s foremost open and distance learning institution, operating over 103 study centres across all 36 states and the Federal Capital Territory.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base font-display">NUC Accredited Curriculum</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All courseware modules and syllabus structures conform strictly to the National Universities Commission (NUC) Benchmark Minimum Academic Standards.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base font-display">AI CBT Exam Simulation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Practice Pen-on-Paper (POP) and electronic CBT exams with immediate feedback, detailed rationales, and automatic weak-area detection.
          </p>
        </div>
      </div>

      {/* NOUN Mission & Philosophy */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
        <h2 className="text-2xl font-bold font-display">The NOUN Open Educational Mandate</h2>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          Open and distance learning provides affordable, flexible, and lifelong higher education for working professionals, parents, entrepreneurs, and students across Nigeria and the Diaspora. NOUN Study Hub bridges the gap between official university portals, local study centres, and independent learning by putting verified course materials and intelligent practice quizzes right in students&apos; hands.
        </p>
      </div>

    </div>
  );
};
