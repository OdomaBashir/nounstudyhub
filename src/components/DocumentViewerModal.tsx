import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Bookmark, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CourseMaterial, PastQuestion } from '../types';

interface DocumentViewerModalProps {
  item: CourseMaterial | PastQuestion | null;
  itemType: 'material' | 'past-question';
  onClose: () => void;
  onDownload: (item: CourseMaterial | PastQuestion) => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  item,
  itemType,
  onClose,
  onDownload,
  isSaved = false,
  onToggleSave,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!item) return null;

  const isMaterial = itemType === 'material';
  const material = isMaterial ? (item as CourseMaterial) : null;
  const pastQuestion = !isMaterial ? (item as PastQuestion) : null;

  const totalPages = isMaterial ? material?.pagesCount || 12 : 6;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div 
      id="document-viewer-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="relative bg-slate-900 text-slate-100 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl border border-slate-700/80 overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="px-2 py-0.5 rounded-md bg-emerald-900/80 text-emerald-300 font-mono text-xs font-bold shrink-0">
              {item.courseCode}
            </span>
            <h3 className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
              {isMaterial ? material?.title : `${pastQuestion?.year} ${pastQuestion?.semester} Semester ${pastQuestion?.examType} Past Exam`}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-700/70 rounded-lg p-0.5 text-xs text-slate-300">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                className="p-1.5 hover:text-white rounded hover:bg-slate-600 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                className="p-1.5 hover:text-white rounded hover:bg-slate-600 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Save / Bookmark Button */}
            {onToggleSave && (
              <button
                id="doc-save-btn"
                onClick={onToggleSave}
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  isSaved 
                    ? 'bg-amber-400 text-slate-950 font-semibold' 
                    : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200'
                }`}
                title={isSaved ? 'Saved to bookmarks' : 'Save to bookmarks'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 bg-slate-700/80 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Download Button */}
            <button
              id="doc-download-btn"
              onClick={() => onDownload(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
              <span className="text-[10px] opacity-80">{item.fileSize}</span>
            </button>

            {/* Close Button */}
            <button
              id="doc-close-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Share notification toast */}
        {copiedLink && (
          <div className="absolute top-14 right-4 z-20 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg shadow-lg animate-in fade-in">
            Link copied to clipboard!
          </div>
        )}

        {/* Document Viewing Area */}
        <div className="flex-1 bg-slate-950 overflow-y-auto p-3 sm:p-6 flex justify-center">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 transition-transform duration-150 relative min-h-[780px]"
          >
            {/* Authentic NOUN Header */}
            <div className="text-center border-b-2 border-emerald-900 pb-4 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-900 text-white mb-2 font-bold text-sm">
                NOUN
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-emerald-950 uppercase font-display">
                National Open University of Nigeria
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Headquarters: Plot 91, Cadastral Zone, Nnamdi Azikiwe Expressway, Jabi - Abuja
              </p>
              <p className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
                E-Library & Digital Courseware Directorate
              </p>
            </div>

            {/* Document Content Body */}
            {isMaterial && material ? (
              <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex flex-wrap gap-4 justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Course Code:</span>{' '}
                    <strong className="text-emerald-900 font-mono text-sm">{material.courseCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Course Title:</span>{' '}
                    <strong className="text-slate-900">{material.courseTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Resource Category:</span>{' '}
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{material.category}</span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h4 className="text-base font-bold text-slate-900 border-b pb-1">Course Guide & Syllabus Summary</h4>
                  <p className="text-justify">{material.excerpt}</p>

                  <h5 className="font-bold text-slate-900 mt-4">Module Structure & Learning Units:</h5>
                  <div className="grid sm:grid-cols-2 gap-3 my-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <strong className="text-xs font-bold text-emerald-900 block mb-1">Module 1: Foundations & Theoretical Paradigms</strong>
                      <ul className="text-xs space-y-1 list-disc list-inside text-slate-700">
                        <li>Unit 1: Core concepts, evolution, and contextual definition.</li>
                        <li>Unit 2: Methodological frameworks and international standards.</li>
                        <li>Unit 3: Self-Assessment Exercises (SAEs) with model solutions.</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <strong className="text-xs font-bold text-emerald-900 block mb-1">Module 2: Practical Application & Case Studies</strong>
                      <ul className="text-xs space-y-1 list-disc list-inside text-slate-700">
                        <li>Unit 1: Implementation procedures and design matrices.</li>
                        <li>Unit 2: Verification, testing, and continuous assessment.</li>
                        <li>Unit 3: Tutor-Marked Assignment (TMA) guidelines.</li>
                      </ul>
                    </div>
                  </div>

                  <h5 className="font-bold text-slate-900 mt-4">Instructions to NOUN Students:</h5>
                  <p className="text-xs text-slate-600 bg-amber-50/80 p-3 rounded-lg border border-amber-200">
                    Students are expected to dedicate at least 3 hours weekly to active independent study of this courseware.
                    Attempt all Self-Assessment Exercises (SAEs) before checking solutions. Complete and submit all three online TMAs
                    via the NOUN e-learning portal to earn continuous assessment marks.
                  </p>
                </div>
              </div>
            ) : pastQuestion ? (
              <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
                {/* Official Exam Metadata Header */}
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs space-y-1.5 font-sans">
                  <div className="flex justify-between border-b pb-1">
                    <span>COURSE CODE: <strong>{pastQuestion.courseCode}</strong></span>
                    <span>COURSE TITLE: <strong>{pastQuestion.courseTitle}</strong></span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>SEMESTER: <strong>{pastQuestion.semester} Semester {pastQuestion.year}</strong></span>
                    <span>EXAMINATION: <strong>{pastQuestion.examType} (Pen-on-Paper / CBT)</strong></span>
                  </div>
                  <div className="flex justify-between">
                    <span>TIME ALLOWED: <strong>{pastQuestion.timeAllowed}</strong></span>
                    <span>TOTAL MARKS: <strong>{pastQuestion.totalMarks} Marks</strong></span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs font-semibold text-amber-950">
                  {pastQuestion.instructions}
                </div>

                {/* Exam Questions List */}
                <div className="space-y-4 pt-2">
                  {pastQuestion.questions.map((q) => (
                    <div key={q.questionNumber} className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-bold text-emerald-900 text-xs uppercase tracking-wide">
                          Question {q.questionNumber}
                        </span>
                        {q.marks && (
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            [{q.marks} Marks]
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm whitespace-pre-line text-slate-800 font-medium">
                        {q.questionText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Page Footer */}
            <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>NOUN Study Hub Digital Archive</span>
              <span>Page {currentPage} of {totalPages}</span>
              <span>Accredited Academic Material</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-t border-slate-700/80 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(item)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Offline File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
