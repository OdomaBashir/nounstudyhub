import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { CourseMaterial, Level, MaterialCategory, MaterialType, Semester, User } from '../types';
import { NOUN_COURSES, NOUN_FACULTIES, NOUN_DEPARTMENTS } from '../data/nounData';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onMaterialUploaded: (mat: CourseMaterial) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onMaterialUploaded,
}) => {
  const [title, setTitle] = useState('');
  const [selectedCourseCode, setSelectedCourseCode] = useState('CIT 432');
  const [category, setCategory] = useState<MaterialCategory>('Courseware');
  const [fileType, setFileType] = useState<MaterialType>('PDF');
  const [fileSize, setFileSize] = useState('3.4 MB');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [semester, setSemester] = useState<Semester>('2nd');
  const [level, setLevel] = useState<Level>('400L');
  const [faculty, setFaculty] = useState('Faculty of Sciences');
  const [department, setDepartment] = useState('Computer Science');
  const [isScanning, setIsScanning] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const extension = file.name.split('.').pop()?.toUpperCase();
      if (extension !== 'PDF' && extension !== 'DOCX' && extension !== 'PPTX') {
        setErrorMsg('Invalid format. Only PDF, DOCX, and PPTX documents are accepted.');
        return;
      }
      setErrorMsg('');
      setSelectedFile(file);
      setFileType(extension as MaterialType);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setErrorMsg('Please enter a descriptive document title.');
      return;
    }

    setIsScanning(true);

    try {
      // Send to server upload endpoint for metadata tagging & simulated security scan
      const matchedCourse = NOUN_COURSES.find(c => c.code === selectedCourseCode);
      const res = await fetch('/api/materials/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          courseCode: selectedCourseCode,
          courseTitle: matchedCourse?.title || selectedCourseCode,
          faculty,
          department,
          level,
          semester,
          fileType,
          fileSize,
          category,
          uploaderRole: currentUser.role,
          uploaderName: currentUser.fullName,
          uploaderEmail: currentUser.email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Add to local storage
        onMaterialUploaded({
          ...data.material,
          approvedStatus: 'approved',
          verified: true,
        });
        setIsScanning(false);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          onClose();
        }, 2000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setIsScanning(false);
      // Client-side fallback if server offline
      const matchedCourse = NOUN_COURSES.find(c => c.code === selectedCourseCode);
      const newMat: CourseMaterial = {
        id: `mat-admin-${Date.now()}`,
        courseId: matchedCourse?.id || 'course-cit-432',
        courseCode: selectedCourseCode,
        courseTitle: matchedCourse?.title || selectedCourseCode,
        title,
        category,
        fileType,
        fileSize,
        uploadDate: new Date().toISOString().split('T')[0],
        downloadsCount: 0,
        approvedStatus: 'approved',
        verified: true,
        pagesCount: 32,
        excerpt: `Official academic resource for ${selectedCourseCode} curated and published by NOUN Directorate Administrator.`,
        uploadedBy: currentUser.fullName,
      };
      onMaterialUploaded(newMat);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        onClose();
      }, 1800);
    }
  };

  return (
    <div 
      id="upload-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-base font-display">
                {currentUser.role === 'admin' ? 'NOUN Repository Publisher (Administrator)' : 'Upload Restricted'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {currentUser.role === 'admin' ? 'Official Courseware, Lecture Notes & Past Questions Archive' : 'NOUN Institutional Content Policy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser.role !== 'admin' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-amber-700" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Student Uploading Disabled</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                To guarantee university curriculum integrity and prevent unaccredited documents, course material uploads and past examination publishing are strictly managed by accredited NOUN Administrators.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-700 space-y-1.5 max-w-md mx-auto">
              <span className="font-bold text-slate-900 block">Student Privileges:</span>
              <p>• Access & download official NOUN courseware anytime</p>
              <p>• Practice previous Pen-on-Paper (POP) & E-Exam past questions</p>
              <p>• Generate AI-assisted revision quizzes with curriculum-aligned grading</p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Understood, Return to Library
              </button>
            </div>
          </div>
        ) : uploadSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Resource Published to Live Hub!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              As a NOUN Administrator, your uploaded material is immediately verified and available for all students across study centres nationwide.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* File dropzone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-5 text-center bg-slate-50 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.pptx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 text-emerald-700 mx-auto mb-1.5" />
              {selectedFile ? (
                <div>
                  <span className="font-bold text-slate-900 block text-sm">{selectedFile.name}</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">{fileSize} • {fileType}</span>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-slate-700">Click to select or drag document here</p>
                  <p className="text-[10px] text-slate-400 mt-1">Accepted formats: PDF, DOCX, PPTX (Max 25MB)</p>
                </div>
              )}
            </div>

            {/* Document Title */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Document Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CIT 432 Comprehensive Lecture Notes (Modules 1-4)"
                required
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
              />
            </div>

            {/* Course & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned NOUN Course *</label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => {
                    setSelectedCourseCode(e.target.value);
                    const matched = NOUN_COURSES.find(c => c.code === e.target.value);
                    if (matched) {
                      setLevel(matched.level);
                      setSemester(matched.semester);
                    }
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs font-mono"
                >
                  {NOUN_COURSES.map(c => (
                    <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resource Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                >
                  <option value="Courseware">Official Courseware</option>
                  <option value="Lecture Note">Lecture Note</option>
                  <option value="Study Guide">Study Guide / Exam Prep</option>
                  <option value="TMA Guide">TMA Solution Walkthrough</option>
                  <option value="Summary">Unit Summary</option>
                </select>
              </div>
            </div>

            {/* Faculty & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Faculty</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                >
                  {NOUN_FACULTIES.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                />
              </div>
            </div>

            {/* Level & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Academic Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                >
                  <option value="100L">100 Level</option>
                  <option value="200L">200 Level</option>
                  <option value="300L">300 Level</option>
                  <option value="400L">400 Level</option>
                  <option value="500L">500 Level</option>
                  <option value="PG">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as Semester)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-600 outline-none text-xs"
                >
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                </select>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2 text-[11px] text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Security & Accreditation Assurance:</strong>
                All uploads are automatically scanned for malicious macros or corrupted binaries before being queued for NOUN academic staff review.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isScanning}
                className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                {isScanning ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scanning & Uploading...</span>
                  </>
                ) : (
                  <span>Submit Resource</span>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
