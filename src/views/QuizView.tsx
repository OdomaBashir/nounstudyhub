import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Bookmark, 
  BookOpen, 
  Award, 
  HelpCircle,
  BarChart2,
  ChevronRight,
  Filter,
  Check,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Course, Difficulty, QuizQuestion, QuizSessionResult, User } from '../types';
import { PREBUILT_QUIZ_QUESTIONS } from '../data/nounData';

interface QuizViewProps {
  courses: Course[];
  initialCourseId?: string;
  initialTopic?: string;
  currentUser: User;
  onSaveQuizResult: (session: QuizSessionResult) => void;
  onNavigateToCourse: (courseId: string) => void;
  weakTopics?: string[];
}

export const QuizView: React.FC<QuizViewProps> = ({
  courses,
  initialCourseId,
  initialTopic,
  currentUser,
  onSaveQuizResult,
  onNavigateToCourse,
  weakTopics = [],
}) => {
  // Config state
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(() => {
    if (initialCourseId) {
      const c = courses.find(item => item.id === initialCourseId);
      if (c) return c.code;
    }
    return 'CIT 432';
  });

  const currentCourse = courses.find(c => c.code === selectedCourseCode) || courses[0];

  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic || 'all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [examMode, setExamMode] = useState<'practice' | 'exam'>('practice');

  // Active quiz state
  const [quizPhase, setQuizPhase] = useState<'setup' | 'running' | 'results'>('setup');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 mins
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [showAnswerInPractice, setShowAnswerInPractice] = useState<boolean>(false);

  // Results state
  const [sessionResult, setSessionResult] = useState<QuizSessionResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect'>('all');

  // Update selected course if prop changes
  useEffect(() => {
    if (initialCourseId) {
      const c = courses.find(item => item.id === initialCourseId);
      if (c) setSelectedCourseCode(c.code);
    }
    if (initialTopic) {
      setSelectedTopic(initialTopic);
    }
  }, [initialCourseId, initialTopic, courses]);

  // Timer countdown in running mode
  useEffect(() => {
    let timer: any;
    if (quizPhase === 'running') {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            handleCompleteQuiz();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpentSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizPhase, questions, userAnswers]);

  // Normalizes question structures so options, questionText, and correctAnswerIndex are reliably set
  const normalizeQuestion = (q: any, index: number): QuizQuestion => {
    const rawOptions = Array.isArray(q.options) && q.options.length > 0
      ? q.options
      : ['Option A', 'Option B', 'Option C', 'Option D'];

    let cIdx = typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : -1;
    const cAnswer = q.correctAnswer || rawOptions[0];
    if (cIdx === -1 || cIdx >= rawOptions.length) {
      cIdx = rawOptions.findIndex((opt: string) => opt === cAnswer || opt.toLowerCase().trim() === String(cAnswer).toLowerCase().trim());
      if (cIdx === -1) cIdx = 0;
    }

    const questionText = q.questionText || q.question || `Question ${index + 1}`;

    return {
      id: q.id || `q-${index + 1}-${Date.now()}`,
      courseCode: q.courseCode || selectedCourseCode,
      courseTitle: q.courseTitle || (currentCourse?.title || selectedCourseCode),
      topic: q.topic || (selectedTopic === 'all' ? 'Core Curriculum Concepts' : selectedTopic),
      questionType: q.questionType || 'multiple_choice',
      question: questionText,
      questionText,
      options: rawOptions,
      correctAnswer: rawOptions[cIdx],
      correctAnswerIndex: cIdx,
      explanation: q.explanation || 'Refer to the official NOUN courseware units for this course.',
      difficulty: q.difficulty || difficulty,
      unitReference: q.unitReference,
    };
  };

  // Fetch or generate questions
  const handleStartQuiz = async (customTopic?: string) => {
    setIsLoadingQuestions(true);
    const activeTopic = customTopic || selectedTopic;

    try {
      // Call server endpoint (which calls Gemini API or falls back)
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseCode: selectedCourseCode,
          courseTitle: currentCourse?.title || selectedCourseCode,
          topic: activeTopic === 'all' ? undefined : activeTopic,
          count: questionCount,
          difficulty,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions.map((q: any, idx: number) => normalizeQuestion(q, idx)));
      } else {
        throw new Error('Fallback to local');
      }
    } catch (e) {
      console.warn('Using client-side questions bank:', e);
      // Client-side fallback from PREBUILT_QUIZ_QUESTIONS
      const matching = PREBUILT_QUIZ_QUESTIONS.filter(q => q.courseCode.toLowerCase() === selectedCourseCode.toLowerCase());
      const basePool = matching.length > 0 ? matching : PREBUILT_QUIZ_QUESTIONS;
      const filtered = activeTopic === 'all' 
        ? basePool 
        : basePool.filter(q => q.topic.toLowerCase().includes(activeTopic.toLowerCase()) || activeTopic.toLowerCase().includes(q.topic.toLowerCase()));
      
      const pool = filtered.length >= 3 ? filtered : basePool;
      const sliced = [...pool].sort(() => Math.random() - 0.5).slice(0, questionCount);
      setQuestions(sliced.map((q, idx) => normalizeQuestion(q, idx)));
    } finally {
      setIsLoadingQuestions(false);
      setQuizPhase('running');
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setFlaggedQuestions([]);
      setShowAnswerInPractice(false);
      setSecondsRemaining(questionCount * 60); // 1 minute per question
      setTimeSpentSeconds(0);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
    if (examMode === 'practice') {
      setShowAnswerInPractice(true);
    }
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => 
      prev.includes(currentQuestionIndex) 
        ? prev.filter(i => i !== currentQuestionIndex) 
        : [...prev, currentQuestionIndex]
    );
  };

  const handleNextQuestion = () => {
    setShowAnswerInPractice(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = async () => {
    // Calculate results
    let correct = 0;
    const detectedWeakTopics: string[] = [];

    const detailedAnswers = questions.map((q, idx) => {
      const selected = userAnswers[idx] !== undefined ? userAnswers[idx] : -1;
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) {
        correct++;
      } else {
        if (!detectedWeakTopics.includes(q.topic)) {
          detectedWeakTopics.push(q.topic);
        }
      }

      return {
        question: q,
        questionId: q.id,
        selectedAnswer: selected >= 0 && q.options && q.options[selected] ? q.options[selected] : 'Not Answered',
        selectedOptionIndex: selected,
        isCorrect,
      };
    });

    const total = questions.length || 1;
    const percentage = Math.round((correct / total) * 100);

    let summary = 'Outstanding Performance';
    let desc = 'You exhibited exceptional competence with NOUN curriculum specifications. High examination probability.';
    if (percentage < 50) {
      summary = 'Revision Required';
      desc = 'Several conceptual errors detected. We strongly recommend reviewing the linked NOUN courseware modules and retaking the practice quiz.';
    } else if (percentage < 75) {
      summary = 'Good Progress';
      desc = 'Solid grasp of core definitions. Review the highlighted weak topics to achieve first-class scoring.';
    }

    const newResult: QuizSessionResult = {
      id: `sess-${Date.now()}`,
      userId: currentUser.id,
      courseCode: selectedCourseCode,
      courseTitle: currentCourse?.title || selectedCourseCode,
      topic: selectedTopic === 'all' ? 'All Course Topics' : selectedTopic,
      difficulty,
      totalQuestions: total,
      correctAnswers: correct,
      incorrectAnswers: total - correct,
      score: correct,
      percentage,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      feedbackSummary: summary,
      feedbackDescription: desc,
      weakTopics: detectedWeakTopics,
      userAnswers: detailedAnswers,
    };

    setSessionResult(newResult);
    onSaveQuizResult(newResult);
    setQuizPhase('results');
  };

  const currentQ = questions[currentQuestionIndex];

  // Helper formatting for timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      
      {/* ========================================================================= */}
      {/* PHASE 1: QUIZ SETUP CONFIGURATOR */}
      {/* ========================================================================= */}
      {quizPhase === 'setup' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>NOUN AI EXAMINATION ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Smart Practice Quiz & CBT Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure exam questions grounded in official NOUN courseware, POP past questions, and e-examination patterns.
            </p>
          </div>

          {/* Weak Topics Quick Suggestion */}
          {weakTopics.length > 0 && (
            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shrink-0 mt-0.5">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Targeted Revision: Detected Weak Areas
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Recent quiz sessions flagged: <strong>{weakTopics.slice(0, 3).join(', ')}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTopic(weakTopics[0]);
                  handleStartQuiz(weakTopics[0]);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs shrink-0 transition-colors"
              >
                Quiz My Weak Topics
              </button>
            </div>
          )}

          {/* Configuration Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            
            {/* 1. Select Course */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>1. Select NOUN Course</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {courses.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCourseCode(c.code);
                      setSelectedTopic('all');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedCourseCode === c.code
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-700/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold block">{c.code}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Select Topic or Module */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-emerald-700" />
                <span>2. Topic or Module Focus</span>
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setSelectedTopic('all')}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-colors ${
                    selectedTopic === 'all'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Course Topics (Comprehensive)
                </button>
                {currentCourse?.topics.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTopic(t)}
                    className={`px-3.5 py-2 rounded-xl font-semibold transition-colors ${
                      selectedTopic === t
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Number of Questions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>3. Number of Practice Questions</span>
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[5, 10, 20, 30].map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={`py-2.5 rounded-xl font-bold border transition-all text-center ${
                      questionCount === num
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Difficulty Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-700" />
                <span>4. Difficulty Level</span>
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 rounded-xl font-bold border transition-all text-center ${
                      difficulty === diff
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>5. Practice Mode vs Exam Simulation</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div
                  onClick={() => setExamMode('practice')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    examMode === 'practice'
                      ? 'border-emerald-700 bg-emerald-50/70 ring-2 ring-emerald-700/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>Practice Mode</span>
                    {examMode === 'practice' && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Provides instant feedback and complete academic rationale after each question is answered.
                  </p>
                </div>

                <div
                  onClick={() => setExamMode('exam')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    examMode === 'exam'
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>Timed CBT Exam Simulation</span>
                    {examMode === 'exam' && <Check className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Simulates official NOUN e-exams with a countdown timer. Complete all questions before viewing results.
                  </p>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                id="btn-launch-quiz-engine"
                disabled={isLoadingQuestions}
                onClick={() => handleStartQuiz()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {isLoadingQuestions ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating AI Quiz for {selectedCourseCode}...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5 text-amber-300" />
                    <span>Start Practice Session ({questionCount} Questions)</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: ACTIVE QUIZ RUNNER */}
      {/* ========================================================================= */}
      {quizPhase === 'running' && currentQ && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Top Status Bar: Progress, Timer, Flags */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 font-mono font-bold">
                {selectedCourseCode}
              </span>
              <span className="text-slate-500 font-semibold">
                Question <strong>{currentQuestionIndex + 1}</strong> of {questions.length}
              </span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs ${
              secondsRemaining < 60 
                ? 'bg-rose-100 text-rose-800 animate-pulse' 
                : 'bg-slate-100 text-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFlag}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  flaggedQuestions.includes(currentQuestionIndex)
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {flaggedQuestions.includes(currentQuestionIndex) ? 'Flagged' : 'Flag Question'}
              </button>

              <button
                onClick={handleCompleteQuiz}
                className="px-3 py-1 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold border border-rose-200"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-700 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Main Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                  Topic: {currentQ.topic}
                </span>
                <span>•</span>
                <span>Difficulty: {currentQ.difficulty}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-display">
                {currentQ.questionText}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                const isCorrect = optIdx === currentQ.correctAnswerIndex;
                const showExplanation = examMode === 'practice' && showAnswerInPractice;

                let optionStyles = 'border-slate-200 hover:border-emerald-500 hover:bg-slate-50 text-slate-800';
                
                if (showExplanation) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20';
                  }
                } else if (isSelected) {
                  optionStyles = 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-700/20 shadow-xs';
                }

                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <button
                    key={optIdx}
                    id={`opt-btn-${optIdx}`}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected 
                          ? 'bg-emerald-800 text-white' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {letter}
                      </span>
                      <span>{option}</span>
                    </div>

                    {showExplanation && (
                      <div className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Practice Mode Explanation Box */}
            {examMode === 'practice' && showAnswerInPractice && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-950 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>NOUN Academic Courseware Explanation</span>
                </div>
                <p className="leading-relaxed">
                  {currentQ.explanation}
                </p>
                {currentQ.unitReference && (
                  <div className="text-[11px] text-emerald-800 font-mono pt-1 font-semibold">
                    Reference: {currentQ.unitReference}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  setShowAnswerInPractice(false);
                  setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                id="btn-next-question"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Jump Question Matrix */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 block mb-2">Question Grid:</span>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, i) => {
                const isAnswered = userAnswers[i] !== undefined;
                const isCurrent = i === currentQuestionIndex;
                const isFlagged = flaggedQuestions.includes(i);

                let bg = 'bg-slate-100 text-slate-700';
                if (isCurrent) bg = 'ring-2 ring-emerald-700 bg-emerald-800 text-white font-bold';
                else if (isFlagged) bg = 'bg-amber-100 text-amber-900 border border-amber-300';
                else if (isAnswered) bg = 'bg-emerald-100 text-emerald-900 font-semibold';

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setShowAnswerInPractice(false);
                      setCurrentQuestionIndex(i);
                    }}
                    className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all ${bg}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 3: RESULTS & AI PERFORMANCE BREAKDOWN */}
      {/* ========================================================================= */}
      {quizPhase === 'results' && sessionResult && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Score Banner */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl text-center relative overflow-hidden">
            <div className="relative max-w-xl mx-auto space-y-4">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase">
                {sessionResult.feedbackSummary}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
                You Scored {sessionResult.percentage}%
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                {sessionResult.feedbackDescription}
              </p>

              {/* Stats pill row */}
              <div className="grid grid-cols-3 gap-3 pt-3 max-w-md mx-auto text-xs">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs">
                  <strong className="text-lg font-black block text-amber-300">
                    {sessionResult.correctAnswers} / {sessionResult.totalQuestions}
                  </strong>
                  <span className="text-emerald-200 text-[11px]">Correct Answers</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs">
                  <strong className="text-lg font-black block text-rose-300">
                    {sessionResult.incorrectAnswers}
                  </strong>
                  <span className="text-emerald-200 text-[11px]">Mistakes</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs">
                  <strong className="text-lg font-black block text-emerald-300">
                    {formatTime(sessionResult.timeSpentSeconds)}
                  </strong>
                  <span className="text-emerald-200 text-[11px]">Time Spent</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  id="btn-retake-quiz"
                  onClick={() => handleStartQuiz()}
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-slate-100 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake This Quiz</span>
                </button>

                {sessionResult.weakTopics.length > 0 && (
                  <button
                    id="btn-quiz-weak-areas"
                    onClick={() => {
                      setSelectedTopic(sessionResult.weakTopics[0]);
                      handleStartQuiz(sessionResult.weakTopics[0]);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5 text-slate-950" />
                    <span>Quiz My Weak Topics Now</span>
                  </button>
                )}

                <button
                  onClick={() => setQuizPhase('setup')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-700 transition-colors"
                >
                  Configure New Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Weak Topics Identification Card */}
          {sessionResult.weakTopics.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-slate-900 text-sm font-display">
                  Identified Areas for Improvement ({sessionResult.courseCode})
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Our analysis detected incorrect responses in the following courseware modules. Review the recommended units before attempting official NOUN exams:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {sessionResult.weakTopics.map((topic, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{topic}</span>
                      <span className="text-[11px] text-amber-800">Requires review</span>
                    </div>
                    <button
                      onClick={() => onNavigateToCourse(currentCourse.id)}
                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg text-[11px] font-bold transition-colors"
                    >
                      View Notes
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base font-display">
                Question Review & Solutions
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    reviewFilter === 'all' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  All Questions ({questions.length})
                </button>
                <button
                  onClick={() => setReviewFilter('incorrect')}
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    reviewFilter === 'incorrect' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Mistakes Only ({sessionResult.incorrectAnswers})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userChoice = userAnswers[idx];
                const isCorrect = userChoice === q.correctAnswerIndex;

                if (reviewFilter === 'incorrect' && isCorrect) return null;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-xs space-y-3 ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCorrect ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {q.questionText}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    {/* Options Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isStudentPick = userChoice === oIdx;
                        const isCorrectAnswer = oIdx === q.correctAnswerIndex;

                        let style = 'bg-white border-slate-200 text-slate-700';
                        if (isCorrectAnswer) style = 'bg-emerald-100/90 border-emerald-500 text-emerald-950 font-bold';
                        else if (isStudentPick && !isCorrectAnswer) style = 'bg-rose-100/80 border-rose-400 text-rose-950';

                        return (
                          <div key={oIdx} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${style}`}>
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isCorrectAnswer && <span className="text-[10px] text-emerald-800 font-bold">Correct</span>}
                            {isStudentPick && !isCorrectAnswer && <span className="text-[10px] text-rose-800 font-bold">Your Answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Academic Explanation */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                      <strong className="text-slate-900 block mb-0.5">NOUN Courseware Rationale:</strong>
                      {q.explanation}
                      {q.unitReference && (
                        <div className="mt-1 text-emerald-800 font-mono font-semibold">
                          Reference: {q.unitReference}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
