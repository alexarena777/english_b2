import { describe, expect, it } from "vitest";
import {
  buildWeeklyStudyPlan,
  calculateAssessment,
  calculateExamResult,
  evaluateAnswer,
  generateDailySession,
  nextReviewDate,
  updateReview,
} from "@/lib/logic";
import { answerSchema, exerciseSchema } from "@/lib/schemas";
import { allExercises, grammarExercises } from "@/lib/data";
import type { ProgressState, UserAnswer } from "@/lib/types";

function progressState(partial: Partial<ProgressState> = {}): ProgressState {
  return {
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
    ...partial,
  };
}

describe("valutazione delle risposte", () => {
  it("ignora maiuscole, spazi e punteggiatura finale", () =>
    expect(evaluateAnswer(grammarExercises[0], "  WORK. ")).toBe(true));
  it("rifiuta una risposta semanticamente diversa", () =>
    expect(evaluateAnswer(grammarExercises[0], "am working")).toBe(false));
});

describe("calcolo assessment", () => {
  it("calcola punteggi per area, livello e priorità", () => {
    const answers: UserAnswer[] = grammarExercises.slice(0, 10).map((exercise, index) => ({
      id: String(index),
      exerciseId: exercise.id,
      answer: "x",
      correct: index < 7,
      section: index < 5 ? "grammar" : "vocabulary",
      topic: exercise.topic,
      answeredAt: new Date().toISOString(),
      timeSpent: 10,
    }));
    const result = calculateAssessment(answers);
    expect(result.overall).toBe(70);
    expect(result.level).toBe("B2");
    expect(result.sectionScores.grammar).toBe(100);
    expect(result.weakTopics.length).toBeGreaterThan(0);
  });
});

describe("spaced repetition", () => {
  const base = new Date("2026-07-01T12:00:00Z");
  it("programma un errore entro un giorno", () =>
    expect(nextReviewDate(0, false, "normal", base).toISOString()).toContain("2026-07-02"));
  it("aumenta gli intervalli dopo risposte corrette", () => {
    expect(nextReviewDate(1, true, "normal", base).toISOString()).toContain("2026-07-08");
    expect(nextReviewDate(3, true, "normal", base).toISOString()).toContain("2026-07-31");
  });
  it("la difficoltà modifica la prossima data", () =>
    expect(nextReviewDate(1, true, "easy", base).getTime()).toBeGreaterThan(
      nextReviewDate(1, true, "hard", base).getTime(),
    ));
  it("aggiorna errori e padronanza senza valori fuori scala", () => {
    const review = updateReview(undefined, grammarExercises[0], "wrong", false, "hard", base);
    expect(review.errorCount).toBe(1);
    expect(review.mastery).toBeGreaterThanOrEqual(0);
  });
});

describe("sessione giornaliera adattiva", () => {
  it("dà priorità agli argomenti con ripasso scaduto", () => {
    const exercise = grammarExercises[20];
    const state = progressState({
      reviews: [{
        id: "r",
        exerciseId: exercise.id,
        question: "",
        givenAnswer: "",
        correctAnswer: "",
        topic: exercise.topic,
        errorCount: 1,
        correctStreak: 0,
        mastery: 10,
        lastErrorAt: "2026-01-01",
        nextReviewAt: "2026-01-02",
      }],
    });
    expect(generateDailySession(grammarExercises, state, 5)[0].topic).toBe(exercise.topic);
  });

  it("mantiene un mix di aree nella sessione", () => {
    const session = generateDailySession(allExercises, progressState(), 8, new Date("2026-07-01"));
    const sections = new Set(session.map((exercise) => exercise.section));
    expect(sections).toContain("grammar");
    expect(sections).toContain("vocabulary");
    expect(sections).toContain("reading");
    expect(sections).toContain("listening");
  });

  it("rimanda gli esercizi appena svolti quando esistono alternative", () => {
    const recentExercise = grammarExercises[0];
    const state = progressState({
      answers: [{
        id: "recent",
        exerciseId: recentExercise.id,
        answer: String(recentExercise.correctAnswer),
        correct: true,
        section: recentExercise.section,
        topic: recentExercise.topic,
        answeredAt: "2026-07-01T11:00:00.000Z",
        timeSpent: 10,
      }],
    });

    const session = generateDailySession(
      grammarExercises,
      state,
      5,
      new Date("2026-07-01T12:00:00.000Z"),
    );

    expect(session.map((exercise) => exercise.id)).not.toContain(recentExercise.id);
  });
});

describe("piano settimanale", () => {
  it("crea sette giorni e rispetta l'obiettivo del profilo", () => {
    const state = progressState({
      reviews: [{
        id: "r",
        exerciseId: grammarExercises[0].id,
        question: "",
        givenAnswer: "",
        correctAnswer: "",
        topic: grammarExercises[0].topic,
        errorCount: 1,
        correctStreak: 0,
        mastery: 10,
        lastErrorAt: "2026-06-01T12:00:00.000Z",
        nextReviewAt: "2026-06-02T12:00:00.000Z",
      }],
    });
    const plan = buildWeeklyStudyPlan(state, new Date("2026-07-01T12:00:00.000Z"));
    expect(plan).toHaveLength(7);
    expect(plan.filter((day) => day.required)).toHaveLength(5);
    expect(plan[0].href).toBe("/review");
  });

  it("usa la padronanza delle parole per la priorità di vocabolario", () => {
    const state = progressState({
      vocabularyProgress: [{
        wordId: "v-01",
        status: "learning",
        correctStreak: 0,
        mastery: 10,
        correctRecall: 0,
        incorrectRecall: 1,
        lastReviewedAt: "2026-07-01T12:00:00.000Z",
        nextReviewAt: "2026-08-10T12:00:00.000Z",
      }],
    });
    const plan = buildWeeklyStudyPlan(state, new Date("2026-08-01T12:00:00.000Z"));
    expect(plan[1].href).toBe("/vocabulary");
    expect(plan[1].focus).toContain("10%");
  });
});

describe("report simulazione", () => {
  it("considera le risposte mancanti come errori e separa le sezioni", () => {
    const exercises = [
      grammarExercises[0],
      allExercises.find((item) => item.section === "vocabulary")!,
    ];
    const result = calculateExamResult(exercises, {
      [grammarExercises[0].id]: String(grammarExercises[0].correctAnswer),
    });
    expect(result.answeredCount).toBe(1);
    expect(result.correctCount).toBe(1);
    expect(result.score).toBe(50);
    expect(result.sectionResults).toHaveLength(2);
    expect(result.weakTopics.length).toBeGreaterThan(0);
  });
});

describe("validazione dati", () => {
  it("convalida tutti gli esercizi disponibili", () =>
    allExercises.forEach((exercise) =>
      expect(exerciseSchema.safeParse(exercise).success).toBe(true),
    ));
  it("blocca tempi negativi e risposte vuote", () =>
    expect(answerSchema.safeParse({ exerciseId: "g-01", answer: "", timeSpent: -1 }).success).toBe(false));
});
