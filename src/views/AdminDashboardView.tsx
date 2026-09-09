import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Users, 
  Download, 
  BrainCircuit, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  UploadCloud,
  Layers,
  Search,
  Check,
  Plus,
  Edit3,
  BookOpen,
  GraduationCap,
  AlertCircle,
  X,
  SlidersHorizontal,
  Lock
} from 'lucide-react';
import { Course, CourseMaterial, PastQuestion, User } from '../types';
import { NOUN_FACULTIES, NOUN_DEPARTMENTS } from '../data/nounData';

interface AdminDashboardViewProps {
  currentUser: User;
  courses: Course[];
  materials: CourseMaterial[];
  pastQuestions: PastQuestion[];
  onApproveMaterial: (id: string) => void;
  onRejectMaterial: (id: string) => void;
  onDeleteMaterial: (id: string) => void;
  onUpdateMaterial: (material: CourseMaterial) => void;
  onAddPastQuestion: (pq: PastQuestion) => void;
  onUpdatePastQuestion: (pq: PastQuestion) => void;
  onDeletePastQuestion: (id: string) => void;
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onOpenUpload: () => void;
  onOpenDocViewer: (item: any, type: 'material' | 'past-question') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  courses,
  materials,
  pastQuestions,
  onApproveMaterial,
  onRejectMaterial,
  onDeleteMaterial,
  onUpdateMaterial,
  onAddPastQuestion,
  onUpdatePastQuestion,
  onDeletePastQuestion,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onOpenUpload,
  onOpenDocViewer,
}) => {
  const [adminTab, setAdminTab] = useState<'moderation' | 'materials' | 'past-questions' | 'courses' | 'governance'>('moderation');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for admin management
  const [editingMaterial, setEditingMaterial] = useState<CourseMaterial | null>(null);
  const [editingPastQuestion, setEditingPastQuestion] = useState<PastQuestion | null>(null);
  const [isAddPastQuestionOpen, setIsAddPastQuestionOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<{ id: string; type: 'material' | 'past-question' | 'course'; title: string } | null>(null);

  // Form states for adding Past Question
  const [pqCourseCode, setPqCourseCode] = useState(courses[0]?.code || 'CIT 432');
  const [pqYear, setPqYear] = useState('2024');
  const [pqSemester, setPqSemester] = useState<'1st' | '2nd'>('1st');
  const [pqExamType, setPqExamType] = useState<'POP' | 'E-Exam'>('POP');
  const [pqTimeAllowed, setPqTimeAllowed] = useState('2 Hours 30 Minutes');
  const [pqTotalMarks, setPqTotalMarks] = useState(70);
  const [pqInstructions, setPqInstructions] = useState('Answer Question 1 (25 marks) and any other three (3) questions (15 marks each).');

  // Form states for adding Course
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseFaculty, setCourseFaculty] = useState(NOUN_FACULTIES[0]?.id || 'fac-sciences');
  const [courseDept, setCourseDept] = useState(NOUN_DEPARTMENTS[0]?.id || 'dept-cs');
  const [courseLevel, setCourseLevel] = useState<'100L' | '200L' | '300L' | '400L' | '500L' | 'PG'>('300L');
  const [courseSemester, setCourseSemester] = useState<'1st' | '2nd'>('1st');
  const [courseCreditUnits, setCourseCreditUnits] = useState(3);
  const [courseDescription, setCourseDescription] = useState('');

  const pendingMaterials = materials.filter(m => m.approvedStatus === 'pending');
  const approvedMaterials = materials.filter(m => m.approvedStatus !== 'rejected');

  // Stats
  const totalDownloads = materials.reduce((acc, m) => acc + m.downloadsCount, 0) + 
                         pastQuestions.reduce((acc, pq) => acc + pq.downloadsCount, 0);

  // Submit new Past Question
  const handleSaveNewPQ = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCourse = courses.find(c => c.code.toLowerCase() === pqCourseCode.toLowerCase()) || courses[0];
    const newPQ: PastQuestion = {
      id: `pq-admin-${Date.now()}`,
      courseId: matchedCourse?.id || 'course-cit-432',
      courseCode: pqCourseCode.toUpperCase(),
      courseTitle: matchedCourse?.title || pqCourseCode.toUpperCase(),
      year: Number(pqYear) || 2024,
      semester: pqSemester,
      examType: pqExamType,
      fileSize: '1.8 MB',
      downloadsCount: 0,
      totalMarks: Number(pqTotalMarks),
      timeAllowed: pqTimeAllowed,
      instructions: pqInstructions,
      questions: [
        {
          questionNumber: 1,
          questionText: `Explain the fundamental architectural differences and operational constraints governing ${pqCourseCode.toUpperCase()}. (15 marks)`,
          marks: 15,
          topic: 'Course Foundations'
        },
        {
          questionNumber: 2,
          questionText: `Provide a detailed comparative matrix illustrating key performance metrics and verification methodologies. (10 marks)`,
          marks: 10,
          topic: 'Applied Practice'
        },
      ],
    };
    onAddPastQuestion(newPQ);
    setIsAddPastQuestionOpen(false);
  };

  // Submit new Course
  const handleSaveNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseTitle) return;
    const newCourse: Course = {
      id: `course-${courseCode.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      code: courseCode.toUpperCase(),
      title: courseTitle,
      facultyId: courseFaculty,
      departmentId: courseDept,
      programmeId: `prog-${courseDept}`,
      level: courseLevel,
      semester: courseSemester,
      creditUnits: Number(courseCreditUnits),
      description: courseDescription || `Official curriculum-approved course outline for ${courseCode.toUpperCase()}: ${courseTitle}.`,
      coordinator: 'Dr. Academic Directorate / NOUN',
      learningObjectives: [
        `Master foundational competencies in ${courseTitle}`,
        `Apply core problem-solving frameworks for ${courseCode.toUpperCase()}`,
        `Complete self-assessment exercises (SAEs) and TMA evaluations`
      ],
      topics: [
        'Module 1: Fundamental Concepts & Frameworks',
        'Module 2: Practical Analysis & Implementations',
        'Module 3: Advanced Applications & Examination Review'
      ],
      materialsCount: 0,
      pastQuestionsCount: 0,
      enrolledStudentsCount: 1,
      courseOutline: [
        {
          module: 1,
          title: 'Foundations and Overview',
          units: ['Unit 1: Basic Introduction', 'Unit 2: Historical Development', 'Unit 3: Frameworks']
        },
        {
          module: 2,
          title: 'Core Methodologies',
          units: ['Unit 1: Analytical Methods', 'Unit 2: Practical Exercises', 'Unit 3: Case Studies']
        }
      ]
    };
    onAddCourse(newCourse);
    setIsAddCourseOpen(false);
    setCourseCode('');
    setCourseTitle('');
    setCourseDescription('');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    if (deleteConfirmId.type === 'material') {
      onDeleteMaterial(deleteConfirmId.id);
    } else if (deleteConfirmId.type === 'past-question') {
      onDeletePastQuestion(deleteConfirmId.id);
    } else if (deleteConfirmId.type === 'course') {
      onDeleteCourse(deleteConfirmId.id);
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">NOUN Directorate of Academic Resources</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">Administrator Control Panel</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Complete institutional management: courseware, exam papers, academic catalog, and access controls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenUpload}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Publish Courseware</span>
          </button>
          <button
            onClick={() => setIsAddPastQuestionOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam Paper</span>
          </button>
        </div>
      </div>

      {/* Institutional Policy Banner */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-900/80 border border-emerald-700 text-amber-300 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white">Institutional Access Enforcement: Student Uploads Disabled</p>
            <p className="text-emerald-300/90 text-[11px] mt-0.5">
              Only authorized NOUN Directorate Administrators can publish, edit, or purge learning resources and past examination archives.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700 font-bold text-[10px] tracking-wide shrink-0">
          STRICT ADMIN-ONLY MODE
        </span>
      </div>

      {/* Global Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Pending Moderation</span>
          <div className="flex items-center justify-between">
            <strong className="text-2xl font-black text-amber-600 font-display">{pendingMaterials.length}</strong>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Live Courseware</span>
          <div className="flex items-center justify-between">
            <strong className="text-2xl font-black text-emerald-700 font-display">{approvedMaterials.length}</strong>
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Past Exam Papers</span>
          <div className="flex items-center justify-between">
            <strong className="text-2xl font-black text-blue-700 font-display">{pastQuestions.length}</strong>
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block mb-1">Academic Courses</span>
          <div className="flex items-center justify-between">
            <strong className="text-2xl font-black text-purple-700 font-display">{courses.length}</strong>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 shadow-xs text-xs sm:text-sm font-bold overflow-x-auto gap-1">
        <button
          onClick={() => setAdminTab('moderation')}
          className={`py-3.5 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            adminTab === 'moderation'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Moderation Queue</span>
          {pendingMaterials.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
              {pendingMaterials.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('materials')}
          className={`py-3.5 px-4 border-b-2 transition-colors whitespace-nowrap ${
            adminTab === 'materials'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Courseware ({approvedMaterials.length})
        </button>

        <button
          onClick={() => setAdminTab('past-questions')}
          className={`py-3.5 px-4 border-b-2 transition-colors whitespace-nowrap ${
            adminTab === 'past-questions'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Past Exams ({pastQuestions.length})
        </button>

        <button
          onClick={() => setAdminTab('courses')}
          className={`py-3.5 px-4 border-b-2 transition-colors whitespace-nowrap ${
            adminTab === 'courses'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Course Catalog ({courses.length})
        </button>

        <button
          onClick={() => setAdminTab('governance')}
          className={`py-3.5 px-4 border-b-2 transition-colors whitespace-nowrap ${
            adminTab === 'governance'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Institutional Policies
        </button>
      </div>

      {/* Tab 1: Moderation Queue */}
      {adminTab === 'moderation' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {pendingMaterials.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">Moderation Queue Clear!</h3>
              <p>All academic resources are verified and active in the live repository.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-5 bg-white rounded-2xl border border-amber-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                        {mat.courseCode}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{mat.title}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">
                        {mat.category}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs line-clamp-2">
                      {mat.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Publisher: <strong>{mat.uploadedBy || 'Administrator'}</strong></span>
                      <span>•</span>
                      <span>Format: {mat.fileType} ({mat.fileSize})</span>
                      <span>•</span>
                      <span>Submitted: {mat.uploadDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenDocViewer(mat, 'material')}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => onApproveMaterial(mat.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => onRejectMaterial(mat.id)}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage All Materials (Courseware) */}
      {adminTab === 'materials' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials by title or course code..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-emerald-700"
              />
            </div>
            <button
              onClick={onOpenUpload}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>Publish New Courseware</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Document Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Format</th>
                  <th className="px-6 py-3">Downloads</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedMaterials
                  .filter(m => searchQuery ? m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                  .map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-mono font-bold text-emerald-900">{m.courseCode}</td>
                      <td className="px-6 py-3">
                        <span className="font-semibold text-slate-900 block">{m.title}</span>
                        <span className="text-[11px] text-slate-400">{m.pagesCount} Pages • Uploaded {m.uploadDate}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {m.category}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500 font-mono">{m.fileType} ({m.fileSize})</td>
                      <td className="px-6 py-3 font-bold text-slate-700">{m.downloadsCount}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Official
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenDocViewer(m, 'material')}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                            title="Inspect Document"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingMaterial(m)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                            title="Edit Material Metadata"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId({ id: m.id, type: 'material', title: m.title })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete Material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Manage Past Examination Questions */}
      {adminTab === 'past-questions' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search past questions by code, year, or title..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-emerald-700"
              />
            </div>
            <button
              onClick={() => setIsAddPastQuestionOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>Add Past Exam Paper</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Course Title</th>
                  <th className="px-6 py-3">Year / Session</th>
                  <th className="px-6 py-3">Exam Format</th>
                  <th className="px-6 py-3">Duration & Marks</th>
                  <th className="px-6 py-3">Downloads</th>
                  <th className="px-6 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastQuestions
                  .filter(pq => searchQuery ? pq.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) || pq.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) || pq.year.includes(searchQuery) : true)
                  .map((pq) => (
                    <tr key={pq.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-mono font-bold text-blue-900">{pq.courseCode}</td>
                      <td className="px-6 py-3 font-semibold text-slate-900">{pq.courseTitle}</td>
                      <td className="px-6 py-3 font-medium text-slate-700">{pq.year} • {pq.semester} Semester</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pq.examType === 'POP' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                          {pq.examType === 'POP' ? 'Pen-on-Paper (POP)' : 'E-Exam (CBT)'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                        <span>{pq.timeAllowed}</span>
                        <span className="text-[11px] block text-slate-400">{pq.totalMarks} Marks</span>
                      </td>
                      <td className="px-6 py-3 font-bold text-slate-700">{pq.downloadsCount}</td>
                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenDocViewer(pq, 'past-question')}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                            title="Inspect Exam Paper"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingPastQuestion(pq)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                            title="Edit Exam Metadata"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId({ id: pq.id, type: 'past-question', title: `${pq.courseCode} (${pq.year} ${pq.semester})` })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete Exam Paper"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Manage Course Catalog */}
      {adminTab === 'courses' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by code, title, or department..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-emerald-700"
              />
            </div>
            <button
              onClick={() => setIsAddCourseOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-600 transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>Add New Academic Course</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Course Title</th>
                  <th className="px-6 py-3">Faculty / Department</th>
                  <th className="px-6 py-3">Level</th>
                  <th className="px-6 py-3">Units</th>
                  <th className="px-6 py-3">Semester</th>
                  <th className="px-6 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses
                  .filter(c => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return c.code.toLowerCase().includes(q) || 
                           c.title.toLowerCase().includes(q) || 
                           c.facultyId.toLowerCase().includes(q) || 
                           c.departmentId.toLowerCase().includes(q);
                  })
                  .map((c) => {
                    const fac = NOUN_FACULTIES.find(f => f.id === c.facultyId);
                    const dept = NOUN_DEPARTMENTS.find(d => d.id === c.departmentId);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-mono font-bold text-purple-900">{c.code}</td>
                        <td className="px-6 py-3 font-semibold text-slate-900">{c.title}</td>
                        <td className="px-6 py-3 text-slate-500">{dept?.name || c.departmentId} <span className="text-[10px] text-slate-400">({fac?.code || c.facultyId})</span></td>
                        <td className="px-6 py-3 font-semibold">{c.level}</td>
                        <td className="px-6 py-3 font-bold text-slate-700">{c.creditUnits} Units</td>
                        <td className="px-6 py-3 text-slate-600">{c.semester} Semester</td>
                        <td className="px-6 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingCourse(c)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-slate-100 transition-colors"
                              title="Edit Course Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId({ id: c.id, type: 'course', title: `${c.code}: ${c.title}` })}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Institutional Policies & Governance */}
      {adminTab === 'governance' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">NOUN Study Hub Institutional Access Rules</h2>
            <p className="text-slate-500 mt-1">
              Authoritative policies regulating digital courseware integrity, examination paper security, and repository curation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Student Upload Policy</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                <strong>Status: PERMANENTLY DISABLED.</strong> Students are not authorized to upload documents directly into the public archive. This ensures all courseware matches the official NOUN Senate-approved curriculum without corrupted or unverified summaries.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>Past Question Accreditation</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                All Pen-on-Paper (POP) and E-Exam questions are sourced exclusively from Directorate archives. Administrators must ensure accurate marking criteria and course code matching before publishing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <span>Course Catalog Synchronization</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Course codes (e.g., GST, CIT, BFN, EDA) must follow standard NOUN faculty allocations. Adding a new course instantly enables students to search and practice AI revision quizzes for that subject.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Content Moderation & Purging</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Administrators possess full CRUD rights. Outdated courseware editions or duplicate examination papers can be edited or permanently purged with immediate effect across all student devices.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Courseware Material */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Edit Courseware Material</h3>
              </div>
              <button onClick={() => setEditingMaterial(null)} className="p-1 rounded text-emerald-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateMaterial(editingMaterial);
              setEditingMaterial(null);
            }} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  value={editingMaterial.title}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingMaterial.category}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Courseware">Courseware</option>
                    <option value="Lecture Note">Lecture Note</option>
                    <option value="Course Guide">Course Guide</option>
                    <option value="Past Question">Past Question</option>
                    <option value="TMA Guide">TMA Guide</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Pages</label>
                  <input
                    type="number"
                    value={editingMaterial.pagesCount}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, pagesCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Executive Summary / Excerpt</label>
                <textarea
                  rows={3}
                  value={editingMaterial.excerpt}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, excerpt: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Past Question */}
      {editingPastQuestion && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-blue-900 text-white">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Edit Past Examination Paper</h3>
              </div>
              <button onClick={() => setEditingPastQuestion(null)} className="p-1 rounded text-blue-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdatePastQuestion(editingPastQuestion);
              setEditingPastQuestion(null);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Year / Session</label>
                  <input
                    type="text"
                    value={editingPastQuestion.year}
                    onChange={(e) => setEditingPastQuestion({ ...editingPastQuestion, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={editingPastQuestion.semester}
                    onChange={(e) => setEditingPastQuestion({ ...editingPastQuestion, semester: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam Type</label>
                  <select
                    value={editingPastQuestion.examType}
                    onChange={(e) => setEditingPastQuestion({ ...editingPastQuestion, examType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="POP">Pen-on-Paper (POP)</option>
                    <option value="E-Exam">E-Exam (CBT)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={editingPastQuestion.totalMarks}
                    onChange={(e) => setEditingPastQuestion({ ...editingPastQuestion, totalMarks: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Time Allowed</label>
                <input
                  type="text"
                  value={editingPastQuestion.timeAllowed}
                  onChange={(e) => setEditingPastQuestion({ ...editingPastQuestion, timeAllowed: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Examination Instructions</label>
                <textarea
                  rows={3}
                  value={editingPastQuestion.instructions}
                  onChange={(e) => setEditingPastQuestion({ ...editingPastQuestion, instructions: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPastQuestion(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-600"
                >
                  Save Exam Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Past Question */}
      {isAddPastQuestionOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-blue-900 text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Publish New Past Examination Paper</h3>
              </div>
              <button onClick={() => setIsAddPastQuestionOpen(false)} className="p-1 rounded text-blue-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPQ} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Course</label>
                <select
                  value={pqCourseCode}
                  onChange={(e) => setPqCourseCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.code}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Year</label>
                  <input
                    type="text"
                    value={pqYear}
                    onChange={(e) => setPqYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    placeholder="e.g. 2024"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={pqSemester}
                    onChange={(e) => setPqSemester(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="1st">1st Sem</option>
                    <option value="2nd">2nd Sem</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={pqExamType}
                    onChange={(e) => setPqExamType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="POP">POP</option>
                    <option value="E-Exam">E-Exam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Allowed</label>
                  <input
                    type="text"
                    value={pqTimeAllowed}
                    onChange={(e) => setPqTimeAllowed(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={pqTotalMarks}
                    onChange={(e) => setPqTotalMarks(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Examination Instructions</label>
                <textarea
                  rows={2}
                  value={pqInstructions}
                  onChange={(e) => setPqInstructions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddPastQuestionOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-600"
                >
                  Publish Exam Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Academic Course */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-purple-900 text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Add Academic Course to Catalog</h3>
              </div>
              <button onClick={() => setIsAddCourseOpen(false)} className="p-1 rounded text-purple-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Code</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                    placeholder="e.g. CIT 381"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Course Title</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    placeholder="e.g. File Processing & Management"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Faculty</label>
                  <select
                    value={courseFaculty}
                    onChange={(e) => setCourseFaculty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  >
                    {NOUN_FACULTIES.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={courseDept}
                    onChange={(e) => setCourseDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  >
                    {NOUN_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L</option>
                    <option value="700L">700L</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={courseSemester}
                    onChange={(e) => setCourseSemester(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="1st">1st Sem</option>
                    <option value="2nd">2nd Sem</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Units</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={courseCreditUnits}
                    onChange={(e) => setCourseCreditUnits(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Description</label>
                <textarea
                  rows={2}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  placeholder="Outline course focus, syllabus scope, and learning objectives..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold hover:bg-purple-600"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Course */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-6 py-4 bg-purple-900 text-white">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-300" />
                <h3 className="font-bold text-sm">Edit Academic Course ({editingCourse.code})</h3>
              </div>
              <button onClick={() => setEditingCourse(null)} className="p-1 rounded text-purple-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateCourse(editingCourse);
              setEditingCourse(null);
            }} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Faculty</label>
                  <select
                    value={editingCourse.facultyId}
                    onChange={(e) => setEditingCourse({ ...editingCourse, facultyId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {NOUN_FACULTIES.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <select
                    value={editingCourse.departmentId}
                    onChange={(e) => setEditingCourse({ ...editingCourse, departmentId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    {NOUN_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={editingCourse.semester}
                    onChange={(e) => setEditingCourse({ ...editingCourse, semester: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="1st">1st Sem</option>
                    <option value="2nd">2nd Sem</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Units</label>
                  <input
                    type="number"
                    value={editingCourse.creditUnits}
                    onChange={(e) => setEditingCourse({ ...editingCourse, creditUnits: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold hover:bg-purple-600"
                >
                  Save Course Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 text-center space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Confirm Permanent Deletion</h4>
              <p className="text-slate-500 mt-1">
                Are you sure you want to delete <strong>"{deleteConfirmId.title}"</strong>? This will remove it immediately from the public NOUN repository.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
