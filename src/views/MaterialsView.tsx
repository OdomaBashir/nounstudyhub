import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Bookmark, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Layers,
  UploadCloud
} from 'lucide-react';
import { CourseMaterial, MaterialCategory, User } from '../types';

interface MaterialsViewProps {
  materials: CourseMaterial[];
  currentUser: User;
  onOpenDocViewer: (item: CourseMaterial, type: 'material') => void;
  onDownload: (item: CourseMaterial) => void;
  onToggleSaveMaterial: (materialId: string) => void;
  onOpenUpload: () => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  currentUser,
  onOpenDocViewer,
  onDownload,
  onToggleSaveMaterial,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      // Approved filter (admin sees all, students see approved)
      if (currentUser.role !== 'admin' && m.approvedStatus === 'pending') {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = m.courseCode.toLowerCase().includes(q);
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchCourseTitle = m.courseTitle.toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchCourseTitle) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && m.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [materials, currentUser.role, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Courseware & Study Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official NOUN university courseware, lecture summaries, study guides, and TMA walkthroughs
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            id="btn-upload-material-from-page"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors shrink-0"
          >
            <UploadCloud className="w-4 h-4 text-amber-300" />
            <span>Publish Courseware</span>
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by course code (e.g. CIT 432, GST 107) or document title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none text-xs sm:text-sm bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:border-emerald-600 outline-none"
            >
              <option value="all">All Material Categories</option>
              <option value="Courseware">Official Courseware</option>
              <option value="Lecture Note">Lecture Notes</option>
              <option value="Study Guide">Study Guides</option>
              <option value="TMA Guide">TMA Solutions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No study materials match your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your query or upload a missing course material to assist other NOUN distance learners.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => {
            const isSaved = currentUser.savedMaterialIds.includes(mat.id);

            return (
              <div
                key={mat.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 font-mono font-bold text-xs">
                      {mat.courseCode}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        {mat.category}
                      </span>
                      <button
                        onClick={() => onToggleSaveMaterial(mat.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isSaved ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Save to bookmarks"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1 font-display line-clamp-1">
                    {mat.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {mat.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 border-b border-slate-100">
                    <span>{mat.fileSize} • {mat.fileType}</span>
                    <span>{mat.downloadsCount} Downloads</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-2">
                  <button
                    onClick={() => onOpenDocViewer(mat, 'material')}
                    className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => onDownload(mat)}
                    className="flex-1 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
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
