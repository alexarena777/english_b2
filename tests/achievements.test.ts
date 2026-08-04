import { describe, expect, it } from "vitest";
import { deriveAchievements } from "@/lib/achievements";
import type { ProgressState } from "@/lib/types";

const baseState: ProgressState = {
  xp: 0,
  streak: 0,
  studyMinutes: 0,
  completed: 0,
  correct: 0,
  assessmentComplete: false,
  estimatedLevel: "B1",
  readiness: 0,
  answers: [],
  reviews: [],
  examAttempts: [],
  writingSubmissions: [],
  speakingAttempts: [],
  vocabularyProgress: [],
  weeklyGoal: 5,
  profileName: "Test",
};

describe("traguardi", () => {
  it("non sblocca risultati senza attività registrate", () => {
    expect(deriveAchievements(baseState).every((item) => !item.unlocked)).toBe(true);
  });

  it("sblocca in modo indipendente pratica, costanza e vocabolario", () => {
    const answers = Array.from({ length: 25 }, (_, index) => ({
      id: `answer-${index}`,
      exerciseId: `verb-${index}`,
      answer: "work",
      correct: true,
      section: "grammar" as const,
      topic: "Present simple",
      answeredAt: "2026-08-01T12:00:00.000Z",
      timeSpent: 20,
    }));
    const achievements = deriveAchievements({
      ...baseState,
      answers,
      streak: 3,
      vocabularyProgress: Array.from({ length: 10 }, (_, index) => ({
        wordId: `word-${index}`,
        status: "mastered" as const,
        correctStreak: 3,
        mastery: 90,
        correctRecall: 4,
        incorrectRecall: 0,
      })),
    });
    expect(achievements.find((item) => item.id === "practice-25")?.unlocked).toBe(true);
    expect(achievements.find((item) => item.id === "streak-3")?.unlocked).toBe(true);
    expect(achievements.find((item) => item.id === "vocabulary-10")?.unlocked).toBe(true);
  });
});
