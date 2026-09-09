import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  BrainCircuit, 
  Check, 
  Bookmark, 
  ArrowUpDown,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { Course, Faculty, Department, Level, Semester, User } from '../types';

interface ExploreCoursesViewProps {
  courses: Course[];
  faculties: Faculty[];
  departments: Department[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigate: (view: string, courseId?: string) => void;
  currentUser: User;
  onToggleSaveCourse: (courseId: string) => void;
}

export const ExploreCoursesView: React.FC<ExploreCoursesViewProps> = ({
  courses,
  faculties,
  departments,
  searchQuery,
  onSearchChange,
  onNavigate,
  currentUser,
  onToggleSaveCourse,
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'code' | 'title' | 'popular'>('code');

  // Filtered departments based on selected faculty
  const availableDepartments = useMemo(() => {
    if (selectedFaculty === 'all') return departments;
    return departments.filter(d => d.facultyId === selectedFaculty);
  }, [departments, selectedFaculty]);

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = course.code.toLowerCase().includes(q);
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchDesc = course.description.toLowerCase().includes(q);
        const matchTopic = course.topics.some(t => t.toLowerCase().includes(q));
        if (!matchCode && !matchTitle && !matchDesc && !matchTopic) return false;
      }

      // Faculty filter
      if (selectedFaculty !== 'all' && course.facultyId !== selectedFaculty) {
        return false;
      }

      // Department filter
      if (selectedDepartment !== 'all' && course.departmentId !== selectedDepartment) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }

      // Semester filter
      if (selectedSemester !== 'all' && course.semester !== selectedSemester) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'popular') return b.enrolledStudentsCount - a.enrolledStudentsCount;
      return a.code.localeCompare(b.code);
    });
  }, [courses, searchQuery, selectedFaculty, selectedDepartment, selectedLevel, selectedSemester, sortBy]);

  const handleResetFilters = () => {
    setSelectedFaculty('all');
    setSelectedDepartment('all');
    setSelectedLevel('all');
    setSelectedSemester('all');
    onSearchChange('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Explore NOUN Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search accredited courseware, lecture summaries, and past questions by faculty, department, or level
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredCourses.length}</strong> of {courses.length} courses
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Search row */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="courses-page-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by course code or title, e.g. CIT 432, Software Engineering, GST 107..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          {/* Faculty */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Faculty</label>
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                setSelectedDepartment('all'); // Reset dept when faculty changes
              }}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-emerald-600 outline-none"
            >
              <option value="all">All Faculties</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-emerald-600 outline-none"
            >
              <option value="all">All Departments</option>
              {availableDepartments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-emerald-600 outline-none"
            >
              <option value="all">All Levels</option>
              <option value="100L">100 Level</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
              <option value="500L">500 Level</option>
              <option value="PG">Postgraduate</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-emerald-600 outline-none"
            >
              <option value="all">Both Semesters</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
            </select>
          </div>

          {/* Sort By & Reset */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-emerald-600 outline-none"
              >
                <option value="code">Course Code</option>
                <option value="title">Course Title</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
            {(selectedFaculty !== 'all' || selectedDepartment !== 'all' || selectedLevel !== 'all' || selectedSemester !== 'all' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses List Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing one or more active filters to explore available NOUN courseware.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCourses.map((course) => {
            const isSaved = currentUser.savedCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                id={`card-${course.code.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all p-5 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Top Bar with Code & Bookmark */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-950 font-mono font-extrabold text-sm tracking-tight">
                      {course.code}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {course.level}
                      </span>
                      <button
                        onClick={() => onToggleSaveCourse(course.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isSaved ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Bookmark course'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1 font-display">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Topics Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.topics.slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {topic}
                      </span>
                    ))}
                    {course.topics.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-semibold">
                        +{course.topics.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Resource Counters */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs mb-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span><strong>{course.materialsCount}</strong> Materials</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                      <span><strong>{course.pastQuestionsCount}</strong> Past Papers</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('course-detail', course.id)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors text-center shadow-xs flex items-center justify-center gap-1"
                  >
                    <span>View Course</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('quiz', course.id)}
                    className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                    title="Start AI Quiz for this course"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>AI Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
