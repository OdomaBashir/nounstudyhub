import React from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  Download, 
  GraduationCap, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Cpu, 
  Briefcase, 
  Users, 
  HeartPulse, 
  Scale, 
  Sprout, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Bookmark
} from 'lucide-react';
import { Course, CourseMaterial, Faculty, User } from '../types';

interface HomeViewProps {
  onNavigate: (view: string, courseId?: string) => void;
  courses: Course[];
  faculties: Faculty[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: User;
  onOpenDocViewer: (item: any, type: 'material' | 'past-question') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  courses,
  faculties,
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenDocViewer,
}) => {
  const quickSearches = ['CIT 432', 'CIT 104', 'GST 107', 'GST 101', 'BUS 105', 'LAW 111', 'Software Engineering', 'Criminology'];

  const getFacultyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-amber-600" />;
      case 'Users': return <Users className="w-5 h-5 text-blue-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-purple-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-emerald-700" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Scale': return <Scale className="w-5 h-5 text-indigo-600" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-700" />;
      default: return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background glow & subtle patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-xs font-semibold text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>National Open University of Nigeria • Approved Academic Hub</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.15]">
            Your Complete NOUN Study <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-200">
              Resource Platform
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            Access NOUN course materials, download past questions, and test your knowledge with AI-powered quizzes.
          </p>

          {/* Prominent Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="hero-explore-courses-btn"
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-950 hover:bg-slate-100 font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Explore Courses</span>
            </button>

            <button
              id="hero-start-ai-quiz-btn"
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all active:scale-95"
            >
              <BrainCircuit className="w-4 h-4 text-slate-950" />
              <span>Start AI Quiz</span>
              <span className="text-[10px] uppercase tracking-wider font-mono bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded-full ml-1">
                New
              </span>
            </button>
          </div>

          {/* Search Section */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="relative bg-white/95 rounded-2xl shadow-2xl p-2 border border-emerald-600/30 text-left">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onNavigate('courses');
                  }}
                  placeholder="Search by course code or course title, for example CIT 432 or Software Engineering"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Quick suggestion chips */}
              <div className="pt-2.5 pb-1 px-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-500">
                <span className="font-semibold text-slate-400 shrink-0">Popular:</span>
                {quickSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onSearchChange(tag);
                      onNavigate('courses');
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-medium shrink-0 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* University Key Stats */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-3xl mx-auto text-emerald-200/80 text-xs">
            <div className="p-2">
              <strong className="text-xl sm:text-2xl font-black text-white block font-display">8</strong>
              <span>Academic Faculties</span>
            </div>
            <div className="p-2">
              <strong className="text-xl sm:text-2xl font-black text-white block font-display">50+</strong>
              <span>Degree Programmes</span>
            </div>
            <div className="p-2">
              <strong className="text-xl sm:text-2xl font-black text-white block font-display">10,000+</strong>
              <span>Courseware & Past Papers</span>
            </div>
            <div className="p-2">
              <strong className="text-xl sm:text-2xl font-black text-white block font-display">AI CBT</strong>
              <span>Exam Prep Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">Quick Access Categories</h2>
            <p className="text-xs text-slate-500">Jump directly into NOUN resources and examination practice</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Course Materials */}
          <div
            id="cat-course-materials"
            onClick={() => onNavigate('materials')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">Course Materials</h3>
              <p className="text-[11px] text-slate-500 mt-1">Lecture notes, study guides & summaries</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-700 mt-3 pt-2 border-t border-slate-100">
              <span>Browse</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Courseware */}
          <div
            id="cat-courseware"
            onClick={() => onNavigate('materials')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">Courseware</h3>
              <p className="text-[11px] text-slate-500 mt-1">Official NOUN university approved PDFs</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-700 mt-3 pt-2 border-t border-slate-100">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Past Questions */}
          <div
            id="cat-past-questions"
            onClick={() => onNavigate('past-questions')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">Past Questions</h3>
              <p className="text-[11px] text-slate-500 mt-1">POP and E-Exam archives (2019-2024)</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-blue-700 mt-3 pt-2 border-t border-slate-100">
              <span>Download</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: AI Quiz */}
          <div
            id="cat-ai-quiz"
            onClick={() => onNavigate('quiz')}
            className="p-4 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border border-emerald-700/80 hover:shadow-lg cursor-pointer transition-all group flex flex-col justify-between shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">AI Quiz</h3>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">AI</span>
              </div>
              <p className="text-[11px] text-emerald-200 mt-1">Courseware-tuned practice question engine</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-300 mt-3 pt-2 border-t border-emerald-700/60">
              <span>Practice Now</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 5: My Dashboard */}
          <div
            id="cat-my-dashboard"
            onClick={() => onNavigate('dashboard')}
            className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">My Dashboard</h3>
              <p className="text-[11px] text-slate-500 mt-1">Saved courses, downloads & quiz mastery</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-purple-700 mt-3 pt-2 border-t border-slate-100">
              <span>Open</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Popular NOUN Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">Popular NOUN Courses</h2>
            <p className="text-xs text-slate-500">Most requested courseware and past questions across departments</p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.slice(0, 8).map((course) => (
            <div
              key={course.id}
              id={`popular-course-${course.code.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-emerald-500 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100/90 text-emerald-900 font-mono font-bold text-xs">
                    {course.code}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {course.level} • {course.semester} Sem
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1">
                  {course.title}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {course.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-600 py-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span><strong>{course.materialsCount}</strong> Materials</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                    <span><strong>{course.pastQuestionsCount}</strong> Past Qs</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  id={`btn-view-course-${course.code.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onNavigate('course-detail', course.id)}
                  className="flex-1 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors text-center shadow-xs"
                >
                  View Course
                </button>
                <button
                  onClick={() => onNavigate('quiz', course.id)}
                  className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
                  title="Take AI Practice Quiz"
                >
                  <BrainCircuit className="w-4 h-4 text-amber-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Quiz Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.2),transparent_70%)] pointer-events-none" />

          <div className="relative max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ADVANCED AI EXAM PREP</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              Master Your NOUN Examinations with AI Study Intelligence
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Our AI analyzes official NOUN courseware, past exam patterns, and your individual practice sessions to detect weak topics, explain tricky questions, and simulate real CBT / Pen-on-Paper exams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="font-bold text-amber-300 block text-xs">Accredited Courseware</span>
                <span className="text-[11px] text-emerald-100">Questions grounded in actual NOUN modules</span>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="font-bold text-amber-300 block text-xs">Weak Area Detection</span>
                <span className="text-[11px] text-emerald-100">Pinpoints topics needing immediate revision</span>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="font-bold text-amber-300 block text-xs">Instant Explanations</span>
                <span className="text-[11px] text-emerald-100">Clear academic rationales for each answer</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                id="btn-banner-ai-quiz"
                onClick={() => onNavigate('quiz')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition-all active:scale-95"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Launch AI Practice Exam</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NOUN Academic Faculties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
              National Open University Faculties
            </h2>
            <p className="text-xs text-slate-500">
              Browse academic departments, programmes, and verified curriculum resources
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {faculties.map((fac) => (
            <div
              key={fac.id}
              onClick={() => onNavigate('courses')}
              className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center mb-3 transition-colors">
                  {getFacultyIcon(fac.iconName)}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                    {fac.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block mb-1">
                  Code: {fac.code}
                </span>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {fac.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>{fac.coursesCount} Courses</span>
                <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
