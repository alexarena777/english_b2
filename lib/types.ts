export const exerciseTypes = ["multiple-choice", "true-false", "fill-gap", "short-answer", "reorder", "matching", "transformation", "error-correction", "synonym", "preposition", "verb-tense", "reading", "listening", "writing"] as const;
export type ExerciseType = (typeof exerciseTypes)[number];
export type Section = "grammar" | "vocabulary" | "use-of-english" | "reading" | "listening" | "writing";
export type Difficulty = "easy" | "medium" | "b2" | "advanced";
export type Level = "A2" | "B1" | "B1+" | "B2" | "B2+";
export type PracticeMode = "study" | "simulation";

export interface ExerciseOption { id: string; label: string; }
export interface ExerciseExample { english: string; italian?: string; }
export interface Exercise {
  id: string; type: ExerciseType; section: Section; topic: string; difficulty: Difficulty; level: Level;
  question: string; instructions: string; options?: ExerciseOption[]; correctAnswer: string | string[];
  acceptedAnswers?: string[]; explanation: string; grammarRule?: string; examples: ExerciseExample[]; tags: string[];
  estimatedTime: number; source: "original" | "demo"; createdAt: string; passageId?: string;
  presentation?: "radio" | "select";
  contextTitle?: string;
  context?: string;
}
export interface ReadingPassage { id: string; title: string; kind: string; level: Level; minutes: number; text: string; exercises: Exercise[]; }
export interface ListeningActivity { id: string; title: string; kind: string; level: Level; duration: string; transcript: string; maxListens: number; exercises: Exercise[]; }
export interface WritingPrompt { id: string; type: string; title: string; prompt: string; minWords: number; maxWords: number; structure: string[]; criteria: string[]; }
export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  definition: string;
  example: string;
  synonym: string;
  category: string;
  difficulty: "B1" | "B2";
}
export interface UserAnswer { id: string; exerciseId: string; answer: string | string[]; correct: boolean; section: Section; topic: string; answeredAt: string; timeSpent: number; }
export interface ReviewItem { id: string; exerciseId: string; question: string; givenAnswer: string; correctAnswer: string; topic: string; errorCount: number; correctStreak: number; mastery: number; lastErrorAt: string; nextReviewAt: string; }
export interface ExamAnswer {
  exerciseId: string;
  answer: string;
  correct: boolean;
  section: Section;
  topic: string;
}
export interface ExamSectionResult {
  section: Section;
  correct: number;
  total: number;
  score: number;
}
export interface ExamAttempt {
  id: string;
  examId: string;
  title: string;
  status: "completed" | "expired";
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  questionCount: number;
  answeredCount: number;
  correctCount: number;
  score: number;
  sectionResults: ExamSectionResult[];
  weakTopics: string[];
  answers: ExamAnswer[];
}
export interface WritingSubmission {
  id: string;
  promptId: string;
  promptTitle: string;
  text: string;
  wordCount: number;
  evaluation: WritingEvaluation;
  evaluationMode: "ai" | "local";
  submittedAt: string;
}
export interface SpeakingScores {
  fluency: number;
  grammar: number;
  vocabulary: number;
  pronunciation: number;
  taskAchievement: number;
}
export interface SpeakingAttempt {
  id: string;
  promptId: string;
  promptTitle: string;
  durationSeconds: number;
  scores: SpeakingScores;
  overall: number;
  completedAt: string;
}
export interface WeeklyPlanDay {
  date: string;
  weekday: string;
  title: string;
  focus: string;
  reason: string;
  minutes: number;
  href: string;
  required: boolean;
  completed: boolean;
}
export type VocabularyStatus = "learning" | "mastered";
export interface VocabularyWordProgress {
  wordId: string;
  status: VocabularyStatus;
  correctStreak: number;
  mastery: number;
  correctRecall: number;
  incorrectRecall: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}
export interface DailyQuotas {
  date: string;
  vocabulary: number;
  reading: number;
  listening: number;
}
export interface ProgressState {
  xp: number;
  streak: number;
  studyMinutes: number;
  completed: number;
  correct: number;
  assessmentComplete: boolean;
  assessmentVersion?: number;
  estimatedLevel: Level;
  readiness: number;
  answers: UserAnswer[];
  reviews: ReviewItem[];
  examAttempts: ExamAttempt[];
  writingSubmissions: WritingSubmission[];
  speakingAttempts: SpeakingAttempt[];
  vocabularyProgress: VocabularyWordProgress[];
  lastStudyDate?: string;
  lastStreakDate?: string;
  dailyQuotas?: DailyQuotas;
  weeklyGoal: number;
  profileName: string;
}
export interface AssessmentResult { level: Level; readiness: number; overall: number; sectionScores: Record<string, number>; weakTopics: string[]; studyPlan: { title: string; reason: string; sessions: number }[]; }
export interface WritingEvaluation { overall: number; scores: Record<string, number>; strengths: string[]; issues: { excerpt: string; explanation: string; suggestion: string }[]; improvedVersion: string; advice: string[]; }
