import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  BrainCircuit, 
  Download, 
  FileText, 
  GraduationCap, 
  Eye, 
  Bookmark, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Clock, 
  Share2, 
  Sparkles,
  Info,
  ShieldCheck,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { Course, CourseMaterial, PastQuestion, User } from '../types';

interface CourseDetailViewProps {
  course: Course;
  materials: CourseMaterial[];
  pastQuestions: PastQuestion[];
  onBack: () => void;
  onNavigateToQuiz: (courseId: string, topic?: string) => void;
  onOpenDocViewer: (item: CourseMaterial | PastQuestion, type: 'material' | 'past-question') => void;
  onDownload: (item: CourseMaterial | PastQuestion) => void;
  currentUser: User;
  onToggleSaveCourse: (courseId: string) => void;
  onToggleSaveMaterial: (materialId: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  materials,
  pastQuestions,
  onBack,
  onNavigateToQuiz,
  onOpenDocViewer,
  onDownload,
  currentUser,
  onToggleSaveCourse,
  onToggleSaveMaterial,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'past-questions' | 'quiz'>('overview');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState<string>('all');
  const [pqYearFilter, setPqYearFilter] = useState<string>('all');
  const [pqTypeFilter, setPqTypeFilter] = useState<string>('all');

  const isCourseSaved = currentUser.savedCourseIds.includes(course.id);

  // Filter materials for this course
  const courseMaterials = materials.filter(m => m.courseCode === course.code || m.courseId === course.id);
  const filteredMaterials = courseMaterials.filter(m => {
    if (materialCategoryFilter !== 'all' && m.category !== materialCategoryFilter) return false;
    return true;
  });

  // Filter past questions for this course
  const coursePQs = pastQuestions.filter(p => p.courseCode === course.code || p.courseId === course.id);
  const filteredPQs = coursePQs.filter(pq => {
    if (pqYearFilter !== 'all' && String(pq.year) !== pqYearFilter) return false;
    if (pqTypeFilter !== 'all' && pq.examType !== pqTypeFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSaveCourse(course.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isCourseSaved
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isCourseSaved ? 'fill-current text-amber-600' : ''}`} />
            <span>{isCourseSaved ? 'Course Bookmarked' : 'Save Course'}</span>
          </button>
        </div>
      </div>

      {/* Course Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-mono font-black text-sm">
              {course.code}
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
              {course.creditUnits} Credit Units
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
              {course.level} • {course.semester} Semester
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display text-white">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed">
            {course.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4 text-amber-300" />
              <span>Coordinator: <strong>{course.coordinator}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-300" />
              <span>{course.modulesCount} Study Modules ({course.unitsCount} Units)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{courseMaterials.length} Study Resources Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-2 sm:px-6 shadow-xs overflow-x-auto">
        <button
          id="tab-course-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-4 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Overview</span>
        </button>

        <button
          id="tab-course-materials"
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 py-4 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'materials'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Course Materials</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {courseMaterials.length}
          </span>
        </button>

        <button
          id="tab-course-past-questions"
          onClick={() => setActiveTab('past-questions')}
          className={`flex items-center gap-2 py-4 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'past-questions'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Past Questions</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {coursePQs.length}
          </span>
        </button>

        <button
          id="tab-course-ai-quiz"
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 py-4 px-4 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'quiz'
              ? 'border-amber-500 text-amber-950 bg-amber-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-amber-600" />
          <span className="text-amber-900">AI Exam Quiz</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">AI</span>
        </button>
      </div>

      {/* Tab 1: Course Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Syllabus & Objectives */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Learning Objectives */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>Course Learning Objectives</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upon satisfactory completion of <strong>{course.code}: {course.title}</strong>, students are expected to:
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Analyze, design, verify, and validate large-scale computer software systems according to international IEEE standards.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Evaluate appropriate software process models (Waterfall, Spiral, Agile/Scrum) suited for industrial and local Nigerian technology constraints.</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Formulate rigorous test plans, unit tests, and integration test specifications for quality management.</span>
                  </div>
                </div>
              </div>

              {/* Module & Unit Breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-700" />
                    <span>Official NOUN Module Breakdown</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">{course.modulesCount} Modules</span>
                </div>

                <div className="space-y-3 text-xs">
                  {course.topics.map((topic, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 transition-colors flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono">
                          Module {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{topic}</h4>
                        <p className="text-[11px] text-slate-500">
                          Comprehensive theoretical foundations, case study examples, and self-assessment questions.
                        </p>
                      </div>
                      <button
                        onClick={() => onNavigateToQuiz(course.id, topic)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] shrink-0 transition-colors"
                      >
                        Quiz Module
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Quick Action Sidebar & Academic Info */}
            <div className="space-y-6">
              
              {/* Exam Readiness Card */}
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-sm">Prepare with AI for {course.code}</h4>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Generate an instant 10, 20, or 50 question simulated CBT exam based strictly on {course.code} courseware and past exams.
                </p>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Start AI Practice Quiz</span>
                </button>
              </div>

              {/* Course Meta Specs */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Academic Metadata</h4>
                
                <div className="space-y-2 divide-y divide-slate-100">
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Course Code:</span>
                    <strong className="font-mono text-emerald-900">{course.code}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Credit Units:</span>
                    <strong className="text-slate-900">{course.creditUnits} Units</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Level & Semester:</span>
                    <strong className="text-slate-900">{course.level}, {course.semester}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Department:</span>
                    <strong className="text-slate-900">{course.departmentName}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Faculty:</span>
                    <strong className="text-slate-900">{course.facultyName}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Official Courseware:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> NOUN Verified
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('materials')}
                    className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors text-center"
                  >
                    View All {courseMaterials.length} Documents
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Course Materials */}
      {activeTab === 'materials' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setMaterialCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                materialCategoryFilter === 'all'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Types ({courseMaterials.length})
            </button>
            <button
              onClick={() => setMaterialCategoryFilter('Courseware')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                materialCategoryFilter === 'Courseware'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Official Courseware
            </button>
            <button
              onClick={() => setMaterialCategoryFilter('Lecture Note')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                materialCategoryFilter === 'Lecture Note'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lecture Notes
            </button>
            <button
              onClick={() => setMaterialCategoryFilter('Study Guide')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                materialCategoryFilter === 'Study Guide'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Study Guides
            </button>
            <button
              onClick={() => setMaterialCategoryFilter('TMA Guide')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                materialCategoryFilter === 'TMA Guide'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              TMA Solutions
            </button>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No materials found under this category filter for {course.code}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map((mat) => {
                const isSaved = currentUser.savedMaterialIds.includes(mat.id);

                return (
                  <div
                    key={mat.id}
                    id={`material-card-${mat.id}`}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 p-5 shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80">
                          {mat.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono text-slate-500">{mat.fileSize}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                            {mat.fileType}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm mb-1.5 font-display">
                        {mat.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {mat.excerpt}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pb-3 border-b border-slate-100">
                        <span>Updated: {mat.uploadDate}</span>
                        <span>•</span>
                        <span>{mat.downloadsCount} Downloads</span>
                        {mat.verified && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1 ml-auto">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 flex items-center gap-2">
                      <button
                        onClick={() => onOpenDocViewer(mat, 'material')}
                        className="flex-1 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Document</span>
                      </button>

                      <button
                        onClick={() => onDownload(mat)}
                        className="px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                        title="Download to device"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={() => onToggleSaveMaterial(mat.id)}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          isSaved ? 'bg-amber-100 border-amber-300 text-amber-800' : 'border-slate-300 hover:bg-slate-100 text-slate-500'
                        }`}
                        title="Save to bookmarks"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Past Questions */}
      {activeTab === 'past-questions' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Exam Year:</span>
              <select
                value={pqYearFilter}
                onChange={(e) => setPqYearFilter(e.target.value)}
                className="p-1.5 rounded-md border border-slate-300 bg-white"
              >
                <option value="all">All Examination Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Format:</span>
              <select
                value={pqTypeFilter}
                onChange={(e) => setPqTypeFilter(e.target.value)}
                className="p-1.5 rounded-md border border-slate-300 bg-white"
              >
                <option value="all">All (POP & E-Exam)</option>
                <option value="POP">Pen-on-Paper (POP)</option>
                <option value="E-Exam">E-Exam CBT</option>
              </select>
            </div>
          </div>

          {filteredPQs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No past examination papers match this filter for {course.code}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPQs.map((pq) => (
                <div
                  key={pq.id}
                  id={`pq-card-${pq.id}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 p-5 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-900 font-bold text-xs">
                        {pq.examType} Exam
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {pq.year} • {pq.semester} Semester
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-1 font-display">
                      {pq.courseCode}: {pq.year} {pq.semester} Semester Official Exam
                    </h4>

                    <p className="text-xs text-slate-500 mb-3">
                      {pq.instructions}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 p-2.5 bg-slate-50 rounded-xl mb-3">
                      <span>Time Allowed: <strong>{pq.timeAllowed}</strong></span>
                      <span>Total Marks: <strong>{pq.totalMarks}</strong></span>
                      <span>{pq.downloadsCount} Downloads</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onOpenDocViewer(pq, 'past-question')}
                      className="flex-1 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Examination Paper</span>
                    </button>

                    <button
                      onClick={() => onDownload(pq)}
                      className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
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
      )}

      {/* Tab 4: AI Quiz Launcher for this Course */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold">
              <BrainCircuit className="w-4 h-4 text-amber-700" />
              <span>AI QUIZ GENERATOR FOR {course.code}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 font-display">
              Ready to Test Your Mastery of {course.title}?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600">
              Our AI engine generates realistic multiple-choice and CBT practice questions directly from the official NOUN courseware modules and past exams.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigateToQuiz(course.id)}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <BrainCircuit className="w-5 h-5" />
                <span>Start Full Course Quiz (All Modules)</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 max-w-3xl mx-auto">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Or Choose a Specific Module to Practice:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.topics.map((topic, i) => (
                <div
                  key={i}
                  onClick={() => onNavigateToQuiz(course.id, topic)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-amber-950">
                    {topic}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
