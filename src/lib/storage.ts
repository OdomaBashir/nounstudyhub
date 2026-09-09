import { Course, CourseMaterial, PastQuestion, QuizSessionResult, User, UserProgressData } from '../types';
import { NOUN_COURSES, NOUN_COURSE_MATERIALS, NOUN_PAST_QUESTIONS, PREBUILT_QUIZ_QUESTIONS } from '../data/nounData';

const USER_KEY = 'noun_hub_current_user';
const QUIZ_SESSIONS_KEY = 'noun_hub_quiz_sessions';
const USER_PROGRESS_KEY = 'noun_hub_user_progress';
const CUSTOM_MATERIALS_KEY = 'noun_hub_custom_materials';
const DELETED_MATERIALS_KEY = 'noun_hub_deleted_materials';
const CUSTOM_PQS_KEY = 'noun_hub_custom_pqs';
const DELETED_PQS_KEY = 'noun_hub_deleted_pqs';
const CUSTOM_COURSES_KEY = 'noun_hub_custom_courses';
const DELETED_COURSES_KEY = 'noun_hub_deleted_courses';

export const DEFAULT_STUDENT: User = {
  id: 'usr-student-1',
  fullName: 'Bashir Odoma',
  email: 'odomabashir@gmail.com',
  matricNo: 'NOU214088921',
  role: 'student',
  faculty: 'Faculty of Sciences',
  department: 'Computer Science',
  programme: 'B.Sc. Computer Science',
  level: '400L',
  studyCentre: 'Abuja Model Study Centre (Dutsen-Alhaji, Bwari)',
  savedCourseIds: ['course-cit-432', 'course-cit-104', 'course-gst-107'],
  savedMaterialIds: ['mat-cit432-cw', 'mat-cit432-guide'],
  downloadedMaterialIds: ['mat-cit432-cw', 'mat-cit104-cw'],
  quizzesCompleted: 7,
  averageScore: 78,
  joinedDate: '2023-01-14',
};

export const DEFAULT_ADMIN: User = {
  id: 'usr-admin-1',
  fullName: 'Prof. Abdullahi S. Musa',
  email: 'admin.elibrary@noun.edu.ng',
  matricNo: 'STF-NOUN-9804',
  role: 'admin',
  faculty: 'Faculty of Sciences',
  department: 'Computer Science',
  programme: 'B.Sc. Computer Science',
  level: '400L',
  studyCentre: 'NOUN Headquarters, Jabi, Abuja',
  savedCourseIds: ['course-cit-432'],
  savedMaterialIds: ['mat-cit432-cw'],
  downloadedMaterialIds: [],
  quizzesCompleted: 14,
  averageScore: 92,
  joinedDate: '2021-08-01',
};

export function getStoredUser(): User {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_STUDENT;
}

export function saveStoredUser(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredMaterials(): CourseMaterial[] {
  try {
    const deletedIds: string[] = JSON.parse(localStorage.getItem(DELETED_MATERIALS_KEY) || '[]');
    const custom: CourseMaterial[] = JSON.parse(localStorage.getItem(CUSTOM_MATERIALS_KEY) || '[]');
    const all = [...custom, ...NOUN_COURSE_MATERIALS];
    return all.filter(m => !deletedIds.includes(m.id));
  } catch (e) {
    console.error(e);
    return NOUN_COURSE_MATERIALS;
  }
}

export function saveCustomMaterial(mat: CourseMaterial): void {
  try {
    const custom: CourseMaterial[] = JSON.parse(localStorage.getItem(CUSTOM_MATERIALS_KEY) || '[]');
    const filtered = custom.filter(m => m.id !== mat.id);
    filtered.unshift(mat);
    localStorage.setItem(CUSTOM_MATERIALS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }
}

export function deleteStoredMaterial(id: string): void {
  try {
    // Remove from custom list if present
    const custom: CourseMaterial[] = JSON.parse(localStorage.getItem(CUSTOM_MATERIALS_KEY) || '[]');
    const filtered = custom.filter(m => m.id !== id);
    localStorage.setItem(CUSTOM_MATERIALS_KEY, JSON.stringify(filtered));

    // Record in deleted IDs so seeded materials can also be removed
    const deleted: string[] = JSON.parse(localStorage.getItem(DELETED_MATERIALS_KEY) || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_MATERIALS_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error(e);
  }
}

export function updateStoredMaterial(updated: CourseMaterial): void {
  saveCustomMaterial(updated);
}

export function updateMaterialStatus(id: string, status: 'approved' | 'rejected'): void {
  try {
    const materials = getStoredMaterials();
    const target = materials.find(m => m.id === id);
    if (target) {
      const updated: CourseMaterial = {
        ...target,
        approvedStatus: status,
        verified: status === 'approved',
      };
      saveCustomMaterial(updated);
    }
  } catch (e) {
    console.error(e);
  }
}

// Past Questions Management
export function getStoredPastQuestions(): PastQuestion[] {
  try {
    const deletedIds: string[] = JSON.parse(localStorage.getItem(DELETED_PQS_KEY) || '[]');
    const custom: PastQuestion[] = JSON.parse(localStorage.getItem(CUSTOM_PQS_KEY) || '[]');
    const all = [...custom, ...NOUN_PAST_QUESTIONS];
    return all.filter(pq => !deletedIds.includes(pq.id));
  } catch (e) {
    console.error(e);
    return NOUN_PAST_QUESTIONS;
  }
}

export function saveStoredPastQuestion(pq: PastQuestion): void {
  try {
    const custom: PastQuestion[] = JSON.parse(localStorage.getItem(CUSTOM_PQS_KEY) || '[]');
    const filtered = custom.filter(p => p.id !== pq.id);
    filtered.unshift(pq);
    localStorage.setItem(CUSTOM_PQS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }
}

export const updateStoredPastQuestion = saveStoredPastQuestion;

export function deleteStoredPastQuestion(id: string): void {
  try {
    const custom: PastQuestion[] = JSON.parse(localStorage.getItem(CUSTOM_PQS_KEY) || '[]');
    const filtered = custom.filter(p => p.id !== id);
    localStorage.setItem(CUSTOM_PQS_KEY, JSON.stringify(filtered));

    const deleted: string[] = JSON.parse(localStorage.getItem(DELETED_PQS_KEY) || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_PQS_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error(e);
  }
}

// Course Catalog Management
export function getStoredCourses(): Course[] {
  try {
    const deletedIds: string[] = JSON.parse(localStorage.getItem(DELETED_COURSES_KEY) || '[]');
    const custom: Course[] = JSON.parse(localStorage.getItem(CUSTOM_COURSES_KEY) || '[]');
    const all = [...custom, ...NOUN_COURSES];
    return all.filter(c => !deletedIds.includes(c.id));
  } catch (e) {
    console.error(e);
    return NOUN_COURSES;
  }
}

export function saveStoredCourse(course: Course): void {
  try {
    const custom: Course[] = JSON.parse(localStorage.getItem(CUSTOM_COURSES_KEY) || '[]');
    const filtered = custom.filter(c => c.id !== course.id);
    filtered.unshift(course);
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }
}

export const updateStoredCourse = saveStoredCourse;

export function deleteStoredCourse(id: string): void {
  try {
    const custom: Course[] = JSON.parse(localStorage.getItem(CUSTOM_COURSES_KEY) || '[]');
    const filtered = custom.filter(c => c.id !== id);
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(filtered));

    const deleted: string[] = JSON.parse(localStorage.getItem(DELETED_COURSES_KEY) || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_COURSES_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error(e);
  }
}

export function getStoredQuizSessions(): QuizSessionResult[] {
  try {
    const data = localStorage.getItem(QUIZ_SESSIONS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  // Default past quiz sessions for realistic analytics
  return [
    {
      id: 'sess-1',
      userId: 'usr-student-1',
      courseCode: 'CIT 432',
      courseTitle: 'Software Engineering',
      topic: 'Software Development Life Cycle',
      difficulty: 'Medium',
      totalQuestions: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      score: 8,
      percentage: 80,
      timeSpentSeconds: 340,
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      feedbackSummary: 'Strong mastery of SDLC principles and Scrum ceremonies.',
      feedbackDescription: 'You demonstrated clear competence in waterfall and agile models. Minor confusion noted in Spiral model risk quadrant boundaries.',
      weakTopics: ['Spiral Model Risk Analysis'],
      userAnswers: [],
    },
    {
      id: 'sess-2',
      userId: 'usr-student-1',
      courseCode: 'CIT 432',
      courseTitle: 'Software Engineering',
      topic: 'Requirements Engineering',
      difficulty: 'Hard',
      totalQuestions: 10,
      correctAnswers: 6,
      incorrectAnswers: 4,
      score: 6,
      percentage: 60,
      timeSpentSeconds: 420,
      completedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      feedbackSummary: 'Moderate comprehension of functional specifications.',
      feedbackDescription: 'Review non-functional constraint metrics and IEEE 830 standards.',
      weakTopics: ['Non-Functional Requirements', 'SRS IEEE Standards'],
      userAnswers: [],
    },
  ];
}

export function saveQuizSession(session: QuizSessionResult): void {
  try {
    const sessions = getStoredQuizSessions();
    sessions.unshift(session);
    localStorage.setItem(QUIZ_SESSIONS_KEY, JSON.stringify(sessions));

    // Update user stats
    const user = getStoredUser();
    const newTotal = user.quizzesCompleted + 1;
    const newAvg = Math.round(((user.averageScore * user.quizzesCompleted) + session.percentage) / newTotal);
    saveStoredUser({
      ...user,
      quizzesCompleted: newTotal,
      averageScore: newAvg,
    });
  } catch (e) {
    console.error(e);
  }
}

export function getStoredUserProgress(): UserProgressData {
  try {
    const data = localStorage.getItem(USER_PROGRESS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }

  return {
    weakTopics: [
      {
        topic: 'Requirements Engineering',
        courseCode: 'CIT 432',
        mistakesCount: 4,
        recommendedMaterialId: 'mat-cit432-cw',
        recommendedMaterialTitle: 'CIT 432 Official Courseware Module 2',
      },
      {
        topic: 'Software Testing & Quality Assurance',
        courseCode: 'CIT 432',
        mistakesCount: 3,
        recommendedMaterialId: 'mat-cit432-notes',
        recommendedMaterialTitle: 'CIT 432 Comprehensive Lecture Notes',
      },
      {
        topic: 'Number Systems & Complements',
        courseCode: 'CIT 104',
        mistakesCount: 2,
        recommendedMaterialId: 'mat-cit104-cw',
        recommendedMaterialTitle: 'CIT 104 Module 2: Binary Arithmetic',
      },
    ],
    strongTopics: [
      { topic: 'Agile & Scrum Methodologies', courseCode: 'CIT 432', successCount: 8 },
      { topic: 'Software Architectural Design (MVC)', courseCode: 'CIT 432', successCount: 6 },
      { topic: 'Tutor-Marked Assignments (TMA) Policies', courseCode: 'GST 107', successCount: 10 },
      { topic: 'Computer Generations', courseCode: 'CIT 104', successCount: 7 },
    ],
    recentQuizSessions: getStoredQuizSessions(),
    performanceHistory: [
      { date: 'Sep 01', courseCode: 'CIT 104', score: 9, percentage: 90 },
      { date: 'Sep 03', courseCode: 'GST 107', score: 10, percentage: 100 },
      { date: 'Sep 05', courseCode: 'CIT 432', score: 6, percentage: 60 },
      { date: 'Sep 07', courseCode: 'CIT 432', score: 8, percentage: 80 },
    ],
  };
}

export function recordDownload(materialId: string): void {
  const user = getStoredUser();
  if (!user.downloadedMaterialIds.includes(materialId)) {
    user.downloadedMaterialIds.push(materialId);
    saveStoredUser(user);
  }
}
