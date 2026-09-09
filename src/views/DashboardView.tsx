import React, { useState } from 'react';
import { 
  User as UserIcon, 
  BookOpen, 
  FileText, 
  Download, 
  BrainCircuit, 
  GraduationCap, 
  BarChart3, 
  Flame, 
  CheckCircle2, 
  Bookmark, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Eye, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Course, CourseMaterial, PastQuestion, QuizSessionResult, User, UserProgressData } from '../types';

interface DashboardViewProps {
  currentUser: User;
  courses: Course[];
  materials: CourseMaterial[];
  pastQuestions: PastQuestion[];
  quizSessions: QuizSessionResult[];
  userProgress: UserProgressData;
  onNavigate: (view: string, courseId?: string) => void;
  onNavigateToQuizWithTopic: (courseCode: string, topic: string) => void;
  onOpenDocViewer: (item: any, type: 'material' | 'past-question') => void;
  onDownload: (item: any) => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  courses,
  materials,
  pastQuestions,
  quizSessions,
  userProgress,
  onNavigate,
  onNavigateToQuizWithTopic,
  onOpenDocViewer,
  onDownload,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'downloads' | 'quizzes'>('overview');

  // Saved courses
  const savedCourses = courses.filter(c => currentUser.savedCourseIds.includes(c.id));
  
  // Saved materials
  const savedMaterials = materials.filter(m => currentUser.savedMaterialIds.includes(m.id));

  // Downloaded materials
  const downloadedMaterials = materials.filter(m => currentUser.downloadedMaterialIds.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      
      {/* Student Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                {currentUser.fullName}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                {currentUser.level}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Matric: <strong className="text-slate-800 font-mono">{currentUser.matricNo}</strong> • {currentUser.programme}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Study Centre: {currentUser.studyCentre}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Launch AI Quiz</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Saved Courses</span>
            <Bookmark className="w-4 h-4 text-emerald-700" />
          </div>
          <strong className="text-2xl font-black text-slate-900 font-display">{savedCourses.length}</strong>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Offline Downloads</span>
            <Download className="w-4 h-4 text-blue-700" />
          </div>
          <strong className="text-2xl font-black text-slate-900 font-display">{currentUser.downloadedMaterialIds.length}</strong>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Quizzes Taken</span>
            <BrainCircuit className="w-4 h-4 text-amber-600" />
          </div>
          <strong className="text-2xl font-black text-slate-900 font-display">{currentUser.quizzesCompleted}</strong>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Average Accuracy</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <strong className="text-2xl font-black text-emerald-700 font-display">{currentUser.averageScore}%</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 shadow-xs overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 px-4 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Study Analytics & Weak Areas
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`py-3.5 px-4 border-b-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Saved Resources ({savedMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('downloads')}
          className={`py-3.5 px-4 border-b-2 transition-colors ${
            activeTab === 'downloads'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Downloaded History ({downloadedMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`py-3.5 px-4 border-b-2 transition-colors ${
            activeTab === 'quizzes'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Recent Quiz Sessions ({quizSessions.length})
        </button>
      </div>

      {/* Tab Content 1: Study Analytics & Weak Areas */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weak Topics Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base font-display">
                      Areas Needing Improvement
                    </h3>
                    <p className="text-xs text-slate-500">Based on past examination questions missed</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {userProgress.weakTopics.map((wt, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-950 px-1.5 py-0.5 rounded bg-amber-200/80">
                          {wt.courseCode}
                        </span>
                        <strong className="text-slate-900">{wt.topic}</strong>
                      </div>
                      <p className="text-[11px] text-amber-900 mt-1">
                        Recommended: {wt.recommendedMaterialTitle}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateToQuizWithTopic(wt.courseCode, wt.topic)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-xs"
                    >
                      Practice Topic
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Strong Topics Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-display">
                    Demonstrated Subject Strengths
                  </h3>
                  <p className="text-xs text-slate-500">High accuracy verified across NOUN question pools</p>
                </div>
              </div>

              <div className="space-y-3">
                {userProgress.strongTopics.map((st, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-950 px-1.5 py-0.5 rounded bg-emerald-200/80">
                        {st.courseCode}
                      </span>
                      <strong className="text-slate-900">{st.topic}</strong>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      {st.successCount} Correct
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Enrolled / Saved Course Shortcuts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base font-display">
                My Bookmarked NOUN Courses
              </h3>
              <button
                onClick={() => onNavigate('courses')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-700"
              >
                Browse More
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {savedCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigate('course-detail', c.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{c.level}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{c.title}</h4>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span>{c.materialsCount} Materials</span>
                    <span>Open →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab Content 2: Saved Materials */}
      {activeTab === 'saved' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {savedMaterials.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No saved materials yet. Bookmark courseware and lecture notes for quick retrieval.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedMaterials.map((m) => (
                <div key={m.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-mono font-bold text-xs rounded">
                      {m.courseCode}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5">{m.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{m.excerpt}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => onOpenDocViewer(m, 'material')}
                      className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => onDownload(m)}
                      className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Downloads History */}
      {activeTab === 'downloads' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {downloadedMaterials.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No downloaded resources logged on this device yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {downloadedMaterials.map((m) => (
                <div key={m.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-900 font-mono font-bold text-xs rounded">
                        {m.courseCode}
                      </span>
                      <span className="text-xs text-slate-400">{m.fileSize}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => onOpenDocViewer(m, 'material')}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg"
                    >
                      Read Now
                    </button>
                    <button
                      onClick={() => onDownload(m)}
                      className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs"
                    >
                      Re-download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: Recent Quizzes */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {quizSessions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
              No AI quiz sessions recorded yet. Start practicing to generate study telemetry.
            </div>
          ) : (
            <div className="space-y-3">
              {quizSessions.map((qs) => (
                <div key={qs.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 font-mono font-bold text-xs rounded">
                        {qs.courseCode}
                      </span>
                      <strong className="text-slate-900 text-sm">{qs.courseTitle}</strong>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Topic: <strong>{qs.topic}</strong> • {qs.totalQuestions} Questions • Difficulty: {qs.difficulty}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <strong className={`text-lg font-black font-display ${
                        qs.percentage >= 70 ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {qs.percentage}%
                      </strong>
                      <span className="text-[10px] text-slate-400 block">{qs.correctAnswers}/{qs.totalQuestions} Correct</span>
                    </div>

                    <button
                      onClick={() => onNavigateToQuizWithTopic(qs.courseCode, qs.topic)}
                      className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
