import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  BookOpen, 
  ShieldCheck,
  UploadCloud
} from 'lucide-react';
import { PastQuestion, User } from '../types';

interface PastQuestionsViewProps {
  pastQuestions: PastQuestion[];
  currentUser?: User;
  onOpenDocViewer: (item: PastQuestion, type: 'past-question') => void;
  onDownload: (item: PastQuestion) => void;
  onOpenUpload: () => void;
}

export const PastQuestionsView: React.FC<PastQuestionsViewProps> = ({
  pastQuestions,
  currentUser,
  onOpenDocViewer,
  onDownload,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');

  const filteredPQs = useMemo(() => {
    return pastQuestions.filter(pq => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = pq.courseCode.toLowerCase().includes(q);
        const matchTitle = pq.courseTitle.toLowerCase().includes(q);
        if (!matchCode && !matchTitle) return false;
      }

      // Year
      if (selectedYear !== 'all' && String(pq.year) !== selectedYear) {
        return false;
      }

      // Semester
      if (selectedSemester !== 'all' && pq.semester !== selectedSemester) {
        return false;
      }

      // Exam Type
      if (selectedExamType !== 'all' && pq.examType !== selectedExamType) {
        return false;
      }

      return true;
    });
  }, [pastQuestions, searchQuery, selectedYear, selectedSemester, selectedExamType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Past Examination Papers Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official NOUN Pen-on-Paper (POP) and E-Exam CBT past questions with answers & marking rubrics
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors shrink-0"
          >
            <UploadCloud className="w-4 h-4 text-amber-300" />
            <span>Publish Past Exam Paper</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CIT 432, GST 107..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-xs bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:border-blue-600 outline-none"
            >
              <option value="all">All Examination Years</option>
              <option value="2024">2024 Session</option>
              <option value="2023">2023 Session</option>
              <option value="2022">2022 Session</option>
              <option value="2021">2021 Session</option>
            </select>
          </div>

          <div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:border-blue-600 outline-none"
            >
              <option value="all">Both Semesters</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
            </select>
          </div>

          <div>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:border-blue-600 outline-none"
            >
              <option value="all">All Formats (POP & E-Exam)</option>
              <option value="POP">Pen-on-Paper (POP)</option>
              <option value="E-Exam">E-Exam CBT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredPQs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No past examination papers match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your filters or upload a past paper from your study centre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPQs.map((pq) => (
            <div
              key={pq.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-500 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-mono font-bold text-xs">
                    {pq.courseCode}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {pq.year} • {pq.semester} Sem
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1 font-display line-clamp-1">
                  {pq.courseTitle}
                </h3>

                <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold mb-2">
                  Format: {pq.examType === 'POP' ? 'Pen-on-Paper (POP)' : 'Electronic CBT Exam'}
                </span>

                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {pq.instructions}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 p-2.5 bg-slate-50 rounded-xl mb-3">
                  <span>Time: <strong>{pq.timeAllowed}</strong></span>
                  <span>Marks: <strong>{pq.totalMarks}</strong></span>
                  <span>{pq.downloadsCount} Downloads</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onOpenDocViewer(pq, 'past-question')}
                  className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => onDownload(pq)}
                  className="flex-1 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
