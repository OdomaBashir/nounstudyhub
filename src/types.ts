export type Level = '100L' | '200L' | '300L' | '400L' | '500L' | 'PG';
export type Semester = '1st' | '2nd';
export type MaterialType = 'PDF' | 'DOCX' | 'PPTX';
export type MaterialCategory = 'Courseware' | 'Lecture Note' | 'Study Guide' | 'TMA Guide' | 'Summary';
export type ExamType = 'POP' | 'E-Exam';
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
export type UserRole = 'student' | 'admin';

export interface Faculty {
  id: string;
  name: string;
  code: string;
  description: string;
  departmentsCount: number;
  coursesCount: number;
  iconName: string;
}

export interface Department {
  id: string;
  facultyId: string;
  name: string;
  code: string;
  description: string;
}

export interface Programme {
  id: string;
  departmentId: string;
  facultyId: string;
  name: string;
  code: string;
  award: string; // e.g. B.Sc., LL.B, B.N.Sc.
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  facultyId: string;
  departmentId: string;
  programmeId: string;
  level: Level;
  semester: Semester;
  description: string;
  coordinator: string;
  learningObjectives: string[];
  topics: string[];
  materialsCount: number;
  pastQuestionsCount: number;
  enrolledStudentsCount: number;
  courseOutline: {
    module: number;
    title: string;
    units: string[];
  }[];
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  category: MaterialCategory;
  fileType: MaterialType;
  fileSize: string;
  uploadDate: string;
  downloadsCount: number;
  approvedStatus: 'approved' | 'pending' | 'rejected';
  verified: boolean;
  pagesCount: number;
  excerpt: string;
  downloadUrl?: string;
  uploadedBy?: string;
}

export interface PastQuestion {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  year: number;
  semester: Semester;
  examType: ExamType; // POP (Pen-on-paper) or E-Exam
  timeAllowed: string;
  totalMarks: number;
  fileSize: string;
  downloadsCount: number;
  instructions: string;
  questions: {
    questionNumber: number;
    questionText: string;
    marks?: number;
    topic?: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  courseCode: string;
  courseTitle: string;
  topic: string;
  questionType: QuestionType;
  question: string;
  questionText?: string;
  options?: string[]; // 4 options for multiple choice
  correctAnswer: string;
  correctAnswerIndex?: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  unitReference?: string;
}

export interface QuizSessionResult {
  id: string;
  userId: string;
  courseCode: string;
  courseTitle: string;
  topic: string;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  feedbackSummary: string;
  feedbackDescription: string;
  weakTopics: string[];
  userAnswers: {
    question?: QuizQuestion;
    questionId?: string;
    selectedAnswer?: string;
    selectedOptionIndex?: number;
    isCorrect: boolean;
  }[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  matricNo: string;
  role: UserRole;
  faculty: string;
  department: string;
  programme: string;
  level: Level;
  studyCentre: string;
  savedCourseIds: string[];
  savedMaterialIds: string[];
  downloadedMaterialIds: string[];
  quizzesCompleted: number;
  averageScore: number;
  joinedDate: string;
}

export interface UserProgressData {
  weakTopics: {
    topic: string;
    courseCode: string;
    mistakesCount: number;
    recommendedMaterialId?: string;
    recommendedMaterialTitle?: string;
  }[];
  strongTopics: {
    topic: string;
    courseCode: string;
    successCount: number;
  }[];
  recentQuizSessions: QuizSessionResult[];
  performanceHistory: {
    date: string;
    courseCode: string;
    score: number;
    percentage: number;
  }[];
}
