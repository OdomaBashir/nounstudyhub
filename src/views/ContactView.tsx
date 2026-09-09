import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, HelpCircle } from 'lucide-react';
import { NOUN_STUDY_CENTRES } from '../data/nounData';

export const ContactView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          Study Centres & Student Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Connect with NOUN administrative offices, facilitator desks, and digital library support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Headquarters */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span>National Headquarters</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Plot 91, Cadastral Zone, Nnamdi Azikiwe Expressway, Jabi, Abuja, Nigeria.
          </p>
          <div className="text-xs text-slate-500 pt-2 space-y-1">
            <p>Phone: +234 807 991 7938</p>
            <p>Email: centralinfo@noun.edu.ng</p>
          </div>
        </div>

        {/* E-Learning Support */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <span>TMA & Exam Support</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Support desk for Tutor-Marked Assignment portal logins, e-course registration, and examination docket printing.
          </p>
          <div className="text-xs text-slate-500 pt-2 space-y-1">
            <p>Hours: Mon - Fri: 8:00 AM - 5:00 PM</p>
            <p>Portal: www.nouonline.net</p>
          </div>
        </div>

        {/* Library Support */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Digital Repository</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Courseware verification, syllabus queries, and student community submissions.
          </p>
          <div className="text-xs text-slate-500 pt-2 space-y-1">
            <p>Email: elibrary@nounstudyhub.org</p>
            <p>Response Time: Within 24 hours</p>
          </div>
        </div>

      </div>

      {/* Directory of Notable Study Centres */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-display">
          Key NOUN Study Centres Nationwide
        </h3>
        <p className="text-xs text-slate-500">
          Students can collect printed courseware, attend weekend facilitation sessions, and sit for Pen-on-Paper (POP) examinations at these centres:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
          {NOUN_STUDY_CENTRES.map((sc, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span className="text-slate-800 font-medium">{sc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
