import { describe, expect, it } from "vitest";
import { deriveLearningProfile } from "@/lib/learning-profile";
import type { ProgressState, UserAnswer } from "@/lib/types";

function progressState(partial: Partial<ProgressState> = {}): ProgressState {
  return {
    xp: 0,
    streak: 0,
    studyMinutes: 0,
    completed: 0,
    correct: 0,
    assessmentComplete: true,
    estimatedLevel: "B1+",
    readiness: 55,
    answers: [],
    reviews: [],
    examAttempts: [],
    writingSubmissions: [],
    speakingAttempts: [],
    vocabularyProgress: [],
    weeklyGoal: 5,
    profileName: "Test",
    ...partial,
  };
}

function answer(index: number, correct = true): UserAnswer {
  return {
    id: `answer-${index}`,
    exerciseId: `exercise-${index}`,
    answer: correct ? "correct" : "wrong",
    correct,
    section: "grammar",
    topic: "Test topic",
    answeredAt: new Date(Date.UTC(2026, 6, index + 1)).toISOString(),
    timeSpent: 10,
  };
}

describe("profilo di apprendimento", () => {
  it("mantiene la stima salvata prima dell'assessment", () => {
    const profile = deriveLearningProfile(
      progressState({ assessmentComplete: false, readiness: 0, estimatedLevel: "B1" }),
    );

    expect(profile).toMatchObject({
      readiness: 0,
      level: "B1",
      confidence: "Stima iniziale",
      evidenceCount: 0,
    });
  });

  it("aggiorna livello e confidenza usando soltanto le quattro sezioni", () => {
    const answers = Array.from({ length: 60 }, (_, index) => answer(index, index < 54));
    const vocabularyProgress = Array.from({ length: 10 }, (_, index) => ({
      wordId: `word-${index}`,
      status: "learning" as const,
      correctStreak: 2,
      mastery: 85,
      correctRecall: 3,
      incorrectRecall: 1,
    }));

    const profile = deriveLearningProfile(
      progressState({
        answers,
        vocabularyProgress,
      }),
    );

    expect(profile.readiness).toBeGreaterThan(55);
    expect(profile.level).toBe("B2");
    expect(profile.confidence).toBe("Confidenza alta");
    expect(profile.signals.map((signal) => signal.key)).toEqual([
      "assessment",
      "practice",
      "vocabulary",
    ]);
  });

  it("considera soltanto la risposta cronologicamente più recente", () => {
    const newer = {
      ...answer(1, true),
      id: "newer",
      exerciseId: "same-exercise",
      answeredAt: "2026-07-03T10:00:00.000Z",
    };
    const older = {
      ...answer(2, false),
      id: "older",
      exerciseId: "same-exercise",
      answeredAt: "2026-07-01T10:00:00.000Z",
    };

    const practice = deriveLearningProfile(
      progressState({ answers: [newer, older] }),
    ).signals.find((signal) => signal.key === "practice");

    expect(practice).toMatchObject({ score: 100, count: 1 });
  });
});
