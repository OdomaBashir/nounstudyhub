import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { AuthModal } from './components/AuthModal';
import { UploadModal } from './components/UploadModal';

import { HomeView } from './views/HomeView';
import { ExploreCoursesView } from './views/ExploreCoursesView';
import { CourseDetailView } from './views/CourseDetailView';
import { MaterialsView } from './views/MaterialsView';
import { PastQuestionsView } from './views/PastQuestionsView';
import { QuizView } from './views/QuizView';
import { DashboardView } from './views/DashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';

import { 
  NOUN_COURSES, 
  NOUN_FACULTIES, 
  NOUN_DEPARTMENTS, 
  NOUN_PROGRAMMES, 
  NOUN_PAST_QUESTIONS 
} from './data/nounData';
import { Course, CourseMaterial, PastQuestion, QuizSessionResult, User } from './types';
import { 
  getStoredUser, 
  saveStoredUser, 
  getStoredMaterials, 
  saveCustomMaterial, 
  updateMaterialStatus, 
  deleteStoredMaterial,
  updateStoredMaterial,
  getStoredPastQuestions,
  saveStoredPastQuestion,
  updateStoredPastQuestion,
  deleteStoredPastQuestion,
  getStoredCourses,
  saveStoredCourse,
  updateStoredCourse,
  deleteStoredCourse,
  getStoredQuizSessions, 
  saveQuizSession, 
  getStoredUserProgress, 
  recordDownload,
  DEFAULT_STUDENT,
  DEFAULT_ADMIN
} from './lib/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeQuizTopic, setActiveQuizTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persistent storage state
  const [currentUser, setCurrentUser] = useState<User>(getStoredUser);
  const [courses, setCourses] = useState<Course[]>(getStoredCourses);
  const [materials, setMaterials] = useState<CourseMaterial[]>(getStoredMaterials);
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>(getStoredPastQuestions);
  const [quizSessions, setQuizSessions] = useState<QuizSessionResult[]>(getStoredQuizSessions);
  const [userProgress, setUserProgress] = useState(getStoredUserProgress);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docViewerItem, setDocViewerItem] = useState<CourseMaterial | PastQuestion | null>(null);
  const [docViewerType, setDocViewerType] = useState<'material' | 'past-question'>('material');

  // Sync scroll to top on navigation
  const handleNavigate = (view: string, courseId?: string, topic?: string) => {
    setCurrentView(view);
    if (courseId) {
      setActiveCourseId(courseId);
    }
    if (topic) {
      setActiveQuizTopic(topic);
    } else if (view !== 'quiz') {
      setActiveQuizTopic(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch between student and admin accounts easily
  const handleSwitchUserRole = () => {
    if (currentUser.role === 'student') {
      setCurrentUser(DEFAULT_ADMIN);
      saveStoredUser(DEFAULT_ADMIN);
    } else {
      setCurrentUser(DEFAULT_STUDENT);
      saveStoredUser(DEFAULT_STUDENT);
    }
  };

  // Bookmark / Save Course
  const handleToggleSaveCourse = (courseId: string) => {
    const isSaved = currentUser.savedCourseIds.includes(courseId);
    const updatedIds = isSaved 
      ? currentUser.savedCourseIds.filter(id => id !== courseId)
      : [...currentUser.savedCourseIds, courseId];
    
    const updatedUser: User = {
      ...currentUser,
      savedCourseIds: updatedIds,
    };
    setCurrentUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  // Bookmark / Save Material
  const handleToggleSaveMaterial = (materialId: string) => {
    const isSaved = currentUser.savedMaterialIds.includes(materialId);
    const updatedIds = isSaved 
      ? currentUser.savedMaterialIds.filter(id => id !== materialId)
      : [...currentUser.savedMaterialIds, materialId];
    
    const updatedUser: User = {
      ...currentUser,
      savedMaterialIds: updatedIds,
    };
    setCurrentUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  // Document download handler (creates actual downloadable file with NOUN courseware content)
  const handleDownload = (item: CourseMaterial | PastQuestion) => {
    recordDownload(item.id);
    
    // Update materials list download counter in memory
    setMaterials(prev => prev.map(m => m.id === item.id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m));
    setPastQuestions(prev => prev.map(pq => pq.id === item.id ? { ...pq, downloadsCount: pq.downloadsCount + 1 } : pq));

    // Update currentUser state
    if (!currentUser.downloadedMaterialIds.includes(item.id)) {
      const updatedUser = {
        ...currentUser,
        downloadedMaterialIds: [...currentUser.downloadedMaterialIds, item.id],
      };
      setCurrentUser(updatedUser);
      saveStoredUser(updatedUser);
    }

    // Generate simulated PDF text file download
    const isMat = 'category' in item;
    const filename = `${item.courseCode}_${isMat ? (item as CourseMaterial).category : 'PastExam'}_${item.id}.txt`;
    
    const content = `======================================================================
NATIONAL OPEN UNIVERSITY OF NIGERIA (NOUN)
Headquarters: Plot 91, Cadastral Zone, Nnamdi Azikiwe Expressway, Jabi - Abuja
E-LIBRARY & DIGITAL COURSEWARE DIRECTORY
======================================================================

DOCUMENT: ${isMat ? (item as CourseMaterial).title : `${item.courseCode} Examination Paper`}
COURSE CODE: ${item.courseCode}
COURSE TITLE: ${item.courseTitle}
FILE SIZE: ${item.fileSize}
DOWNLOAD DATE: ${new Date().toLocaleString()}
STUDENT MATRIC: ${currentUser.matricNo}

----------------------------------------------------------------------
COURSE GUIDE & ACADEMIC SYLLABUS OVERVIEW:
----------------------------------------------------------------------
${isMat ? (item as CourseMaterial).excerpt : (item as PastQuestion).instructions}

This material is an official academic resource provided for self-study
under the Open and Distance Learning (ODL) framework. All intellectual property
remains the copyright of the National Open University of Nigeria.

Visit https://nounstudyhub.org for interactive AI practice quizzes,
Self-Assessment Exercises (SAEs), and Tutor-Marked Assignment (TMA) guidelines.
======================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Open Document Viewer modal
  const handleOpenDocViewer = (item: CourseMaterial | PastQuestion, type: 'material' | 'past-question') => {
    setDocViewerItem(item);
    setDocViewerType(type);
  };

  // Add new uploaded material
  const handleMaterialUploaded = (mat: CourseMaterial) => {
    saveCustomMaterial(mat);
    setMaterials(prev => [mat, ...prev]);
  };

  // Approve material (Admin action)
  const handleApproveMaterial = (id: string) => {
    updateMaterialStatus(id, 'approved');
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, approvedStatus: 'approved', verified: true } : m));
  };

  // Reject material (Admin action)
  const handleRejectMaterial = (id: string) => {
    updateMaterialStatus(id, 'rejected');
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, approvedStatus: 'rejected' } : m));
  };

  // Delete material (Admin action)
  const handleDeleteMaterial = (id: string) => {
    deleteStoredMaterial(id);
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Update material (Admin action)
  const handleUpdateMaterial = (updatedMat: CourseMaterial) => {
    updateStoredMaterial(updatedMat);
    setMaterials(prev => prev.map(m => m.id === updatedMat.id ? updatedMat : m));
  };

  // Add Past Question (Admin action)
  const handleAddPastQuestion = (newPQ: PastQuestion) => {
    saveStoredPastQuestion(newPQ);
    setPastQuestions(prev => [newPQ, ...prev]);
  };

  // Update Past Question (Admin action)
  const handleUpdatePastQuestion = (updatedPQ: PastQuestion) => {
    updateStoredPastQuestion(updatedPQ);
    setPastQuestions(prev => prev.map(pq => pq.id === updatedPQ.id ? updatedPQ : pq));
  };

  // Delete Past Question (Admin action)
  const handleDeletePastQuestion = (id: string) => {
    deleteStoredPastQuestion(id);
    setPastQuestions(prev => prev.filter(pq => pq.id !== id));
  };

  // Add Course (Admin action)
  const handleAddCourse = (newCourse: Course) => {
    saveStoredCourse(newCourse);
    setCourses(prev => [...prev, newCourse]);
  };

  // Update Course (Admin action)
  const handleUpdateCourse = (updatedCourse: Course) => {
    updateStoredCourse(updatedCourse);
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  // Delete Course (Admin action)
  const handleDeleteCourse = (id: string) => {
    deleteStoredCourse(id);
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // Save Quiz Result
  const handleSaveQuizResult = (session: QuizSessionResult) => {
    saveQuizSession(session);
    setQuizSessions(prev => [session, ...prev]);
    setUserProgress(getStoredUserProgress());
  };

  // Active course lookup
  const currentSelectedCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSwitchUserRole={handleSwitchUserRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            courses={courses}
            faculties={NOUN_FACULTIES}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentUser={currentUser}
            onOpenDocViewer={handleOpenDocViewer}
          />
        )}

        {currentView === 'courses' && (
          <ExploreCoursesView
            courses={courses}
            faculties={NOUN_FACULTIES}
            departments={NOUN_DEPARTMENTS}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onToggleSaveCourse={handleToggleSaveCourse}
          />
        )}

        {currentView === 'course-detail' && (
          <CourseDetailView
            course={currentSelectedCourse}
            materials={materials}
            pastQuestions={pastQuestions}
            onBack={() => handleNavigate('courses')}
            onNavigateToQuiz={(courseId, topic) => handleNavigate('quiz', courseId, topic)}
            onOpenDocViewer={handleOpenDocViewer}
            onDownload={handleDownload}
            currentUser={currentUser}
            onToggleSaveCourse={handleToggleSaveCourse}
            onToggleSaveMaterial={handleToggleSaveMaterial}
          />
        )}

        {currentView === 'materials' && (
          <MaterialsView
            materials={materials}
            currentUser={currentUser}
            onOpenDocViewer={handleOpenDocViewer}
            onDownload={handleDownload}
            onToggleSaveMaterial={handleToggleSaveMaterial}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        )}

        {currentView === 'past-questions' && (
          <PastQuestionsView
            pastQuestions={pastQuestions}
            currentUser={currentUser}
            onOpenDocViewer={handleOpenDocViewer}
            onDownload={handleDownload}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView
            courses={courses}
            initialCourseId={activeCourseId || undefined}
            initialTopic={activeQuizTopic || undefined}
            currentUser={currentUser}
            onSaveQuizResult={handleSaveQuizResult}
            onNavigateToCourse={(cId) => handleNavigate('course-detail', cId)}
            weakTopics={userProgress.weakTopics.map(w => w.topic)}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            courses={courses}
            materials={materials}
            pastQuestions={pastQuestions}
            quizSessions={quizSessions}
            userProgress={userProgress}
            onNavigate={handleNavigate}
            onNavigateToQuizWithTopic={(code, topic) => {
              const matched = courses.find(c => c.code === code);
              handleNavigate('quiz', matched?.id, topic);
            }}
            onOpenDocViewer={handleOpenDocViewer}
            onDownload={handleDownload}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            currentUser={currentUser}
            courses={courses}
            materials={materials}
            pastQuestions={pastQuestions}
            onApproveMaterial={handleApproveMaterial}
            onRejectMaterial={handleRejectMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onUpdateMaterial={handleUpdateMaterial}
            onAddPastQuestion={handleAddPastQuestion}
            onUpdatePastQuestion={handleUpdatePastQuestion}
            onDeletePastQuestion={handleDeletePastQuestion}
            onAddCourse={handleAddCourse}
            onUpdateCourse={handleUpdateCourse}
            onDeleteCourse={handleDeleteCourse}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onOpenDocViewer={handleOpenDocViewer}
          />
        )}

        {currentView === 'about' && <AboutView />}

        {currentView === 'contact' && <ContactView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation (Visible on phones & tablets) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={currentUser.role}
      />

      {/* Document Viewer Modal */}
      {docViewerItem && (
        <DocumentViewerModal
          item={docViewerItem}
          itemType={docViewerType}
          onClose={() => setDocViewerItem(null)}
          onDownload={handleDownload}
          isSaved={
            docViewerType === 'material' 
              ? currentUser.savedMaterialIds.includes(docViewerItem.id) 
              : false
          }
          onToggleSave={() => {
            if (docViewerType === 'material') {
              handleToggleSaveMaterial(docViewerItem.id);
            }
          }}
        />
      )}

      {/* Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSaveUser={(u) => {
          setCurrentUser(u);
          saveStoredUser(u);
        }}
      />

      {/* Content Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUser={currentUser}
        onMaterialUploaded={handleMaterialUploaded}
      />

    </div>
  );
}
