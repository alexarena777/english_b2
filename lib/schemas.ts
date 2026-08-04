import { z } from "zod";
import { exerciseTypes } from "./types";

const sectionSchema = z.enum([
  "grammar",
  "vocabulary",
  "use-of-english",
  "reading",
  "listening",
  "writing",
]);
const levelSchema = z.enum(["A2", "B1", "B1+", "B2", "B2+"]);
const answerValueSchema = z.union([
  z.string().min(1),
  z.array(z.string()).min(1),
]);

export const writingEvaluationSchema = z.object({
  overall: z.number().min(0).max(100),
  scores: z.record(z.string(), z.number().min(0).max(100)),
  strengths: z.array(z.string().min(1)).max(8),
  issues: z
    .array(
      z.object({
        excerpt: z.string().max(500),
        explanation: z.string().min(1).max(1000),
        suggestion: z.string().min(1).max(1000),
      }),
    )
    .max(12),
  improvedVersion: z.string().max(12000),
  advice: z.array(z.string().min(1)).max(8),
});

const examAnswerSchema = z.object({
  exerciseId: z.string().min(1),
  answer: z.string(),
  correct: z.boolean(),
  section: sectionSchema,
  topic: z.string().min(1),
});

const examAttemptSchema = z.object({
  id: z.string().min(1),
  examId: z.string().min(1),
  title: z.string().min(1).max(100),
  status: z.enum(["completed", "expired"]),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime(),
  durationSeconds: z.number().int().min(0).max(14400),
  questionCount: z.number().int().min(1).max(100),
  answeredCount: z.number().int().min(0).max(100),
  correctCount: z.number().int().min(0).max(100),
  score: z.number().min(0).max(100),
  sectionResults: z
    .array(
      z.object({
        section: sectionSchema,
        correct: z.number().int().min(0).max(100),
        total: z.number().int().min(0).max(100),
        score: z.number().min(0).max(100),
      }),
    )
    .max(6),
  weakTopics: z.array(z.string().min(1)).max(6),
  answers: z.array(examAnswerSchema).max(100),
});

const writingSubmissionSchema = z.object({
  id: z.string().min(1),
  promptId: z.string().min(1),
  promptTitle: z.string().min(1).max(160),
  text: z.string().min(1).max(12000),
  wordCount: z.number().int().min(1).max(2500),
  evaluation: writingEvaluationSchema,
  evaluationMode: z.enum(["ai", "local"]),
  submittedAt: z.iso.datetime(),
});

const speakingScoresSchema = z.object({
  fluency: z.number().int().min(1).max(5),
  grammar: z.number().int().min(1).max(5),
  vocabulary: z.number().int().min(1).max(5),
  pronunciation: z.number().int().min(1).max(5),
  taskAchievement: z.number().int().min(1).max(5),
});

const speakingAttemptSchema = z.object({
  id: z.string().min(1),
  promptId: z.string().min(1),
  promptTitle: z.string().min(1).max(160),
  durationSeconds: z.number().int().min(1).max(900),
  scores: speakingScoresSchema,
  overall: z.number().min(0).max(100),
  completedAt: z.iso.datetime(),
});

const vocabularyWordProgressSchema = z.object({
  wordId: z.string().min(1),
  status: z.enum(["learning", "mastered"]),
  correctStreak: z.number().int().min(0),
  mastery: z.number().min(0).max(100),
  correctRecall: z.number().int().min(0),
  incorrectRecall: z.number().int().min(0),
  lastReviewedAt: z.iso.datetime().optional(),
  nextReviewAt: z.iso.datetime().optional(),
});

export const exerciseSchema = z.object({
  id: z.string().min(1),
  type: z.enum(exerciseTypes),
  section: sectionSchema,
  topic: z.string().min(2),
  difficulty: z.enum(["easy", "medium", "b2", "advanced"]),
  level: levelSchema,
  question: z.string().min(3),
  instructions: z.string().min(2),
  options: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  acceptedAnswers: z.array(z.string()).optional(),
  explanation: z.string().min(10),
  grammarRule: z.string().optional(),
  examples: z.array(
    z.object({ english: z.string(), italian: z.string().optional() }),
  ),
  tags: z.array(z.string()),
  estimatedTime: z.number().positive(),
  source: z.enum(["original", "demo"]),
  createdAt: z.string(),
  passageId: z.string().optional(),
  presentation: z.enum(["radio", "select"]).optional(),
  contextTitle: z.string().min(2).optional(),
  context: z.string().min(20).optional(),
});

export const answerSchema = z.object({
  exerciseId: z.string().min(1),
  answer: answerValueSchema,
  timeSpent: z.number().min(0).max(7200),
});

export const userAnswerSchema = z.object({
  id: z.string().min(1),
  exerciseId: z.string().min(1),
  answer: answerValueSchema,
  correct: z.boolean(),
  section: sectionSchema,
  topic: z.string().min(1),
  answeredAt: z.iso.datetime(),
  timeSpent: z.number().min(0).max(7200),
});

export const reviewItemSchema = z.object({
  id: z.string().min(1),
  exerciseId: z.string().min(1),
  question: z.string(),
  givenAnswer: z.string(),
  correctAnswer: z.string(),
  topic: z.string().min(1),
  errorCount: z.number().int().min(0),
  correctStreak: z.number().int().min(0),
  mastery: z.number().min(0).max(100),
  lastErrorAt: z.iso.datetime(),
  nextReviewAt: z.iso.datetime(),
});

const dailyQuotasSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  vocabulary: z.number().int().min(0),
  reading: z.number().int().min(0),
  listening: z.number().int().min(0),
});

export const progressStateSchema = z.object({
  xp: z.number().int().min(0),
  streak: z.number().int().min(0),
  studyMinutes: z.number().int().min(0),
  completed: z.number().int().min(0),
  correct: z.number().int().min(0),
  assessmentComplete: z.boolean(),
  assessmentVersion: z.number().int().min(0).default(0),
  estimatedLevel: levelSchema,
  readiness: z.number().min(0).max(100),
  answers: z.array(userAnswerSchema).max(2000),
  reviews: z.array(reviewItemSchema).max(2000),
  examAttempts: z.array(examAttemptSchema).max(20).default([]),
  writingSubmissions: z.array(writingSubmissionSchema).max(20).default([]),
  speakingAttempts: z.array(speakingAttemptSchema).max(30).default([]),
  vocabularyProgress: z.array(vocabularyWordProgressSchema).max(300).default([]),
  lastStudyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  lastStreakDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dailyQuotas: dailyQuotasSchema.optional(),
  weeklyGoal: z.number().int().min(1).max(14).transform((value) => Math.min(7, value)),
  profileName: z.string().min(1).max(60),
});

export const assessmentDraftSchema = z.object({
  index: z.number().int().min(0).max(27),
  answers: z.array(userAnswerSchema).max(28),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(60),
  weeklyGoal: z.number().int().min(1).max(7),
});

export const writingSchema = z.object({
  promptId: z.string().min(1),
  text: z.string().min(40, "Scrivi almeno 40 caratteri").max(6000),
});
