import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini client helper
let genAiClient: GoogleGenAI | null = null;
function getGenAi(): GoogleGenAI | null {
  if (!genAiClient && process.env.GEMINI_API_KEY) {
    genAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'NOUN Study Hub API',
    hasGemini: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Candidate Gemini models to try in order of preference (handles temporary 503 spikes gracefully)
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

// AI Quiz Generation Endpoint
app.post('/api/quiz/generate', async (req, res) => {
  const {
    courseCode = 'CIT 432',
    courseTitle = 'Software Engineering',
    topic = 'All Topics',
    quantity,
    count: rawCount,
    difficulty = 'Medium',
    questionTypes = ['multiple_choice'],
    weakTopics = [],
  } = req.body;

  const count = Math.min(Math.max(Number(rawCount || quantity) || 10, 3), 30);

  const ai = getGenAi();
  if (ai) {
    const prompt = `You are a university academic examiner for the National Open University of Nigeria (NOUN).
Generate ${count} authentic academic practice questions specifically for NOUN Course: ${courseCode} - ${courseTitle}.
Topic Focus: ${topic}${weakTopics.length > 0 ? ` (Targeting identified weak student areas: ${weakTopics.join(', ')})` : ''}
Difficulty Level: ${difficulty}
Supported Question Types: ${questionTypes.join(', ')}

Guidelines:
1. Base all questions strictly on accredited NOUN courseware, curriculum guidelines, and typical NOUN examination standards (POP and E-Exam CBT formats).
2. For multiple choice questions, provide exactly 4 clear, plausible options.
3. Provide a clear, educational explanation citing why the answer is correct according to NOUN study guides.
4. Ensure variety; do not repeat questions.

Output JSON with an array of objects matching this schema:
[
  {
    "id": "gen-1",
    "courseCode": "${courseCode}",
    "courseTitle": "${courseTitle}",
    "topic": "Specific Topic Name",
    "questionType": "multiple_choice",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact matching string from options",
    "explanation": "Clear academic explanation of why this answer is correct according to NOUN course materials.",
    "difficulty": "Easy|Medium|Hard"
  }
]`;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  courseCode: { type: Type.STRING },
                  courseTitle: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  questionType: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
                required: ['question', 'correctAnswer', 'explanation', 'topic'],
              },
            },
          },
        });

        const responseText = response.text?.trim();
        if (responseText) {
          const parsedQuestions = JSON.parse(responseText);
          if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
            const formatted = parsedQuestions.map((q, idx) => {
              const opts = Array.isArray(q.options) && q.options.length > 0
                ? q.options
                : (q.questionType === 'true_false' ? ['True', 'False'] : ['Option A', 'Option B', 'Option C', 'Option D']);
              
              const cAnswer = q.correctAnswer || opts[0];
              let cIdx = opts.indexOf(cAnswer);
              if (cIdx === -1) {
                cIdx = opts.findIndex(o => o.toLowerCase().trim() === String(cAnswer).toLowerCase().trim());
                if (cIdx === -1) cIdx = 0;
              }

              const qText = q.question || 'Academic Question';

              return {
                id: `ai-${Date.now()}-${idx + 1}`,
                courseCode: q.courseCode || courseCode,
                courseTitle: q.courseTitle || courseTitle,
                topic: q.topic || topic || 'General Course Concepts',
                questionType: q.questionType || 'multiple_choice',
                question: qText,
                questionText: qText,
                options: opts,
                correctAnswer: opts[cIdx],
                correctAnswerIndex: cIdx,
                explanation: q.explanation || 'Refer to the official NOUN courseware for this course unit.',
                difficulty: (q.difficulty as 'Easy' | 'Medium' | 'Hard') || (difficulty === 'Mixed' ? (idx % 3 === 0 ? 'Hard' : idx % 2 === 0 ? 'Medium' : 'Easy') : difficulty),
              };
            });

            return res.json({
              success: true,
              source: `gemini (${modelName})`,
              questions: formatted,
            });
          }
        }
      } catch (error: any) {
        // Log info notice and attempt next candidate model if 503 or 429
        const isTemporary = error?.status === 503 || error?.code === 503 || error?.status === 429 || String(error?.message).includes('high demand');
        if (isTemporary) {
          console.info(`Model ${modelName} experiencing temporary demand, trying alternative candidate model...`);
          continue;
        } else {
          console.warn(`Model ${modelName} generation issue:`, error?.message || error);
        }
      }
    }
  }

  // Curriculum-based fallback generator
  const generatedFallback = generateCurriculumFallbackQuestions(courseCode, courseTitle, topic, count, difficulty);
  return res.json({
    success: true,
    source: 'curriculum-engine',
    questions: generatedFallback,
  });
});

// AI Performance Diagnosis Endpoint
app.post('/api/quiz/analyze-performance', async (req, res) => {
  const {
    courseCode,
    courseTitle,
    score,
    totalQuestions,
    percentage,
    weakTopics = [],
    timeSpentSeconds = 0,
  } = req.body;

  const ai = getGenAi();
  if (ai) {
    const prompt = `You are an academic learning advisor at the National Open University of Nigeria (NOUN).
A student has just completed an assessment in ${courseCode} (${courseTitle}).
Exam Performance Details:
- Score: ${score} out of ${totalQuestions} (${percentage}%)
- Weak/Missed Topics: ${weakTopics.length > 0 ? weakTopics.join(', ') : 'None, scored nearly perfect'}
- Time Spent: ${Math.round(timeSpentSeconds / 60)} minutes

Write a concise, encouraging academic performance evaluation for this student.
Output JSON:
{
  "performanceLevel": "Excellent" | "Good" | "Needs Improvement" | "Critical Review Needed",
  "headline": "A short inspiring title",
  "summary": "2-3 sentences evaluating their grasp of NOUN courseware concepts",
  "recommendations": [
    "Specific study recommendation 1",
    "Specific study recommendation 2",
    "Specific study recommendation 3"
  ],
  "studyAreasToPrioritize": ["Topic 1", "Topic 2"]
}`;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                performanceLevel: { type: Type.STRING },
                headline: { type: Type.STRING },
                summary: { type: Type.STRING },
                recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                studyAreasToPrioritize: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['performanceLevel', 'headline', 'summary', 'recommendations'],
            },
          },
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        return res.json({ success: true, source: modelName, data: parsed });
      } catch (e: any) {
        const isTemporary = e?.status === 503 || e?.code === 503 || String(e?.message).includes('high demand');
        if (isTemporary) {
          continue;
        }
      }
    }
  }

  // Rule-based fallback diagnosis
  let performanceLevel = 'Needs Improvement';
  let headline = 'Focused Study Needed for Upcoming NOUN Exams';
  if (percentage >= 80) {
    performanceLevel = 'Excellent';
    headline = 'Outstanding Mastery of Course Concepts!';
  } else if (percentage >= 60) {
    performanceLevel = 'Good';
    headline = 'Solid Understanding with Room for High-Distinction Growth';
  }

  res.json({
    success: true,
    data: {
      performanceLevel,
      headline,
      summary: `You scored ${percentage}% on this practice test for ${courseCode}. ${
        percentage >= 70
          ? 'You demonstrated a strong foundation in core theoretical objectives.'
          : 'Further review of the NOUN courseware units is recommended prior to taking your semester examination.'
      }`,
      recommendations: [
        `Review the official NOUN courseware modules covering ${weakTopics[0] || 'core definitions'}.`,
        'Solve at least two previous Pen-on-Paper (POP) past question papers under timed conditions.',
        'Review the Tutor-Marked Assignment (TMA) discussion walkthroughs on the hub.',
      ],
      studyAreasToPrioritize: weakTopics.length > 0 ? weakTopics : ['Foundational Concepts', 'Terminology & Definitions'],
    },
  });
});

// Resource Upload - STRICTLY RESTRICTED TO NOUN ADMINISTRATORS
app.post('/api/materials/upload', (req, res) => {
  const {
    title,
    courseCode,
    courseTitle,
    faculty,
    department,
    level,
    semester,
    fileType,
    fileSize,
    category,
    uploaderRole,
    uploaderName,
  } = req.body;

  // Strict RBAC: Non-admin users are completely barred from uploading materials
  if (uploaderRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Student uploading is disabled. Only authorized NOUN administrators are permitted to publish academic resources.',
    });
  }

  if (!title || !courseCode || !fileType) {
    return res.status(400).json({ success: false, error: 'Missing required metadata' });
  }

  // Simulated security scanning
  const allowedExtensions = ['PDF', 'DOCX', 'PPTX'];
  if (!allowedExtensions.includes(String(fileType).toUpperCase())) {
    return res.status(400).json({ success: false, error: 'Unsupported file format. Only PDF, DOCX, and PPTX are approved.' });
  }

  const newMaterial = {
    id: `mat-admin-${Date.now()}`,
    title,
    courseCode,
    courseTitle: courseTitle || courseCode,
    faculty: faculty || 'Faculty of Sciences',
    department: department || 'Computer Science',
    level: level || '100L',
    semester: semester || '1st',
    fileType: fileType.toUpperCase(),
    fileSize: fileSize || '3.2 MB',
    category: category || 'Courseware',
    uploadDate: new Date().toISOString().split('T')[0],
    downloadsCount: 0,
    approvedStatus: 'approved', // Official Admin upload is auto-approved & verified
    verified: true,
    securityScanStatus: 'Verified Official NOUN Courseware',
    pagesCount: 48,
    uploadedBy: uploaderName || 'NOUN Directorate Administrator',
    excerpt: `Official verified academic resource for ${courseCode} published by the NOUN Directorate of Academic Resources.`,
  };

  res.json({
    success: true,
    message: 'Official material published successfully to the NOUN Study Hub repository.',
    material: newMaterial,
  });
});

// Fallback questions generator based on course curriculum
function generateCurriculumFallbackQuestions(courseCode: string, courseTitle: string, topic: string, count: number, difficulty: string) {
  const courseCodeUpper = courseCode.toUpperCase();

  const gst101Pool = [
    {
      topic: 'Listening for Academic Purposes',
      question: 'Which listening barrier occurs when an academic listener prematurely evaluates the speaker\'s accent instead of the lecture content?',
      options: ['Attitudinal/Evaluative Barrier', 'Acoustic Distortion', 'Semantic Satiation', 'Phonetic Shift'],
      correctAnswer: 'Attitudinal/Evaluative Barrier',
      explanation: 'Attitudinal or evaluative barriers occur when prejudice, bias, or subjective focus on delivery distracts from message absorption.',
      difficulty: 'Medium',
    },
    {
      topic: 'Grammar & Concord',
      question: 'Identify the sentence that strictly conforms to the rules of subject-verb concord:',
      options: [
        'The committee has submitted its recommendations on distance learning.',
        'Neither the facilitators nor the student were present in the hall.',
        'Each of the NOUN courseware modules are written in units.',
        'The list of accredited study centres were published online.',
      ],
      correctAnswer: 'The committee has submitted its recommendations on distance learning.',
      explanation: 'When a collective noun ("committee") acts as a single unified entity, it takes a singular verb ("has submitted") and singular pronoun ("its").',
      difficulty: 'Medium',
    },
    {
      topic: 'Reading Comprehension Strategies',
      question: 'In SQ3R study methodology, what does the "Survey" step entail?',
      options: [
        'Skimming headings, summaries, and objectives before thorough reading',
        'Memorizing all vocabulary definitions at the back of the textbook',
        'Answering the TMA self-assessment exercises first',
        'Translating complex clauses into vernacular language',
      ],
      correctAnswer: 'Skimming headings, summaries, and objectives before thorough reading',
      explanation: 'Surveying provides a cognitive roadmap by scanning headings, chapter intros, and unit outlines prior to in-depth study.',
      difficulty: 'Easy',
    },
  ];

  const gst107Pool = [
    {
      topic: 'Tutor-Marked Assignments (TMA)',
      question: 'In the National Open University of Nigeria academic grading structure, what percentage of the total grade do TMAs contribute?',
      options: ['30%', '40%', '50%', '70%'],
      correctAnswer: '30%',
      explanation: 'In NOUN, Continuous Assessment via Tutor-Marked Assignments (TMAs 1, 2, and 3) accounts for 30% of the overall course mark, while the final exam accounts for 70%.',
      difficulty: 'Easy',
    },
    {
      topic: 'Open and Distance Learning Concepts',
      question: 'What is the primary defining philosophical trait of NOUN\'s Open and Distance Learning (ODL) system?',
      options: [
        'Removal of barriers of time, space, age, and pace of study',
        'Mandatory daily physical attendance at the Abuja headquarters',
        'Exclusive restriction of admission to Nigerian civil servants only',
        'Abolition of all formal examinations and academic evaluations',
      ],
      correctAnswer: 'Removal of barriers of time, space, age, and pace of study',
      explanation: 'ODL provides open access and lifelong educational opportunities with flexibility in geography, timing, and learning tempo.',
      difficulty: 'Easy',
    },
    {
      topic: 'Examination Preparation (POP & E-Exam)',
      question: 'Which category of NOUN students sit for Pen-on-Paper (POP) semester examinations?',
      options: [
        'Undergraduate 300L, 400L, 500L, and Postgraduate students',
        '100L and 200L students only',
        'Students taking general studies (GST) courses only',
        'Distance learners who miss their e-exam scheduled slot',
      ],
      correctAnswer: 'Undergraduate 300L, 400L, 500L, and Postgraduate students',
      explanation: 'At NOUN, 100L and 200L courses are evaluated using computer-based electronic examinations (E-Exam), whereas 300L+, Law, and Postgraduate students write Pen-on-Paper (POP) essay papers.',
      difficulty: 'Medium',
    },
  ];

  const cit432Pool = [
    {
      topic: 'Software Development Life Cycle',
      question: 'In software engineering, which phase of the SDLC focuses on translating validated requirements into software architectures and data models?',
      options: ['System Design Phase', 'Feasibility Study', 'Post-Implementation Audit', 'Beta Testing'],
      correctAnswer: 'System Design Phase',
      explanation: 'The System Design phase converts validated Software Requirement Specifications into structural diagrams, data schemas, and interface models.',
      difficulty: 'Easy',
    },
    {
      topic: 'Requirements Engineering',
      question: 'Which characteristic ensures a Software Requirement Specification (SRS) is unambiguous?',
      options: ['Every requirement has only one interpretation', 'The document is over 100 pages', 'It includes marketing budget numbers', 'It uses specialized hardware terminology only'],
      correctAnswer: 'Every requirement has only one interpretation',
      explanation: 'An unambiguous SRS ensures all stakeholders, developers, and QA engineers share exactly one interpretation of every requirement.',
      difficulty: 'Medium',
    },
    {
      topic: 'Software Testing & Quality Assurance',
      question: 'What is the primary objective of Regression Testing in software engineering?',
      options: [
        'To verify that recent code changes have not adversely affected existing functional features',
        'To test if users like the user interface color scheme',
        'To count the total number of lines of source code in the repository',
        'To calculate the developer payroll costs',
      ],
      correctAnswer: 'To verify that recent code changes have not adversely affected existing functional features',
      explanation: 'Regression testing re-executes tests to verify that new bug fixes or feature additions do not break previously working capabilities.',
      difficulty: 'Medium',
    },
    {
      topic: 'Software Architectural Design',
      question: 'In the Model-View-Controller (MVC) architectural pattern, which component handles business logic and data state?',
      options: ['Model', 'View', 'Controller', 'Router'],
      correctAnswer: 'Model',
      explanation: 'The Model encapsulates system domain logic, data representations, and state management rules.',
      difficulty: 'Easy',
    },
    {
      topic: 'Agile & Scrum Methodologies',
      question: 'What is the standard recommended duration of a Scrum sprint in Agile software development?',
      options: ['1 to 4 weeks', '6 to 12 months', '24 hours', '3 years'],
      correctAnswer: '1 to 4 weeks',
      explanation: 'Scrum iterations (Sprints) are fixed-length timeboxes typically lasting between 1 and 4 weeks to facilitate rapid feedback loops.',
      difficulty: 'Easy',
    },
    {
      topic: 'Software Testing & Quality Assurance',
      question: 'Cyclomatic complexity is a software metric used in white-box testing to measure:',
      options: [
        'The number of linearly independent paths through a program source code',
        'The download speed of the application over mobile networks',
        'The physical number of memory chips on the motherboard',
        'The financial budget of the QA team',
      ],
      correctAnswer: 'The number of linearly independent paths through a program source code',
      explanation: 'Thomas McCabe\'s Cyclomatic Complexity computes the number of linearly independent paths through a control flow graph (E - N + 2P).',
      difficulty: 'Hard',
    },
  ];

  let pool = cit432Pool;
  if (courseCodeUpper.includes('GST 101') || courseCodeUpper.includes('GST101')) {
    pool = gst101Pool;
  } else if (courseCodeUpper.includes('GST 107') || courseCodeUpper.includes('GST107')) {
    pool = gst107Pool;
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    const template = pool[i % pool.length];
    const qText = `[${courseCode}] ${template.question}`;
    const opts = [...template.options];
    const cAnswer = template.correctAnswer;
    const cIdx = opts.indexOf(cAnswer) !== -1 ? opts.indexOf(cAnswer) : 0;

    results.push({
      id: `fallback-${Date.now()}-${i + 1}`,
      courseCode,
      courseTitle,
      topic: template.topic,
      questionType: 'multiple_choice' as const,
      question: qText,
      questionText: qText,
      options: opts,
      correctAnswer: cAnswer,
      correctAnswerIndex: cIdx,
      explanation: template.explanation,
      difficulty: (difficulty === 'Mixed' ? (i % 3 === 0 ? 'Hard' : i % 2 === 0 ? 'Medium' : 'Easy') : difficulty) as 'Easy' | 'Medium' | 'Hard',
    });
  }
  return results;
}

// Server startup with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOUN Study Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
