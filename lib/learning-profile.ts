import type { Level, ProgressState } from "./types";

export interface LearningSignal {
  key: "assessment" | "practice" | "reviews" | "vocabulary";
  label: string;
  score: number;
  count: number;
}

export interface LearningProfile {
  readiness: number;
  level: Level;
  confidence: "Stima iniziale" | "Confidenza media" | "Confidenza alta";
  evidenceCount: number;
  coverage: number;
  signals: LearningSignal[];
}

export function deriveLearningProfile(state: ProgressState): LearningProfile {
  if (!state.assessmentComplete) {
    return {
      readiness: state.readiness,
      level: state.estimatedLevel,
      confidence: "Stima iniziale",
      evidenceCount: 0,
      coverage: 0,
      signals: [],
    };
  }

  const latestObjectiveAnswers = new Map<
    string,
    { correct: boolean; answeredAt: number }
  >();
  state.answers
    .filter((answer) =>
      ["grammar", "vocabulary", "reading", "listening"].includes(answer.section),
    )
    .forEach((answer) => {
      const answeredAt = new Date(answer.answeredAt).getTime();
      const current = latestObjectiveAnswers.get(answer.exerciseId);
      if (!current || answeredAt >= current.answeredAt) {
        latestObjectiveAnswers.set(answer.exerciseId, {
          correct: answer.correct,
          answeredAt,
        });
      }
    });
  const practiceAccuracy = latestObjectiveAnswers.size
    ? percentage(
        [...latestObjectiveAnswers.values()].filter((answer) => answer.correct).length,
        latestObjectiveAnswers.size,
      )
    : null;
  const reviewMastery = average(state.reviews.map((item) => item.mastery));
  const vocabularyMastery = average(state.vocabularyProgress.map((item) => item.mastery));
  const assessmentAbility = state.readiness;
  const weightedSignals: { score: number; weight: number }[] = [
    { score: assessmentAbility, weight: 5 },
  ];
  const signals: LearningSignal[] = [
    {
      key: "assessment",
      label: "Assessment",
      score: state.readiness,
      count: 1,
    },
  ];

  if (practiceAccuracy !== null) {
    weightedSignals.push({
      score: practiceAccuracy,
      weight: Math.min(3, latestObjectiveAnswers.size / 10),
    });
    signals.push({
      key: "practice",
      label: "Esercizi",
      score: practiceAccuracy,
      count: latestObjectiveAnswers.size,
    });
  }
  if (reviewMastery !== null) {
    weightedSignals.push({
      score: reviewMastery,
      weight: Math.min(1.5, state.reviews.length / 8),
    });
    signals.push({
      key: "reviews",
      label: "Ripasso",
      score: reviewMastery,
      count: state.reviews.length,
    });
  }
  if (vocabularyMastery !== null) {
    weightedSignals.push({
      score: vocabularyMastery,
      weight: Math.min(1.5, state.vocabularyProgress.length / 10),
    });
    signals.push({
      key: "vocabulary",
      label: "Vocabolario",
      score: vocabularyMastery,
      count: state.vocabularyProgress.length,
    });
  }
  const totalWeight = weightedSignals.reduce((total, item) => total + item.weight, 0);
  const ability = weightedSignals.reduce(
    (total, item) => total + item.score * item.weight,
    0,
  ) / totalWeight;
  const coverage = Math.min(100, Math.round((latestObjectiveAnswers.size / 60) * 100));
  const readiness = Math.min(100, Math.max(0, Math.round(ability)));
  const evidenceCount =
    latestObjectiveAnswers.size +
    state.vocabularyProgress.length +
    state.reviews.length;

  return {
    readiness,
    level: levelFromAbility(ability),
    confidence:
      evidenceCount >= 60
        ? "Confidenza alta"
        : evidenceCount >= 20
          ? "Confidenza media"
          : "Stima iniziale",
    evidenceCount,
    coverage,
    signals,
  };
}

function average(values: number[]) {
  return values.length
    ? Math.round(values.reduce((total, value) => total + value, 0) / values.length)
    : null;
}

function percentage(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

function levelFromAbility(score: number): Level {
  return score < 35
    ? "A2"
    : score < 52
      ? "B1"
      : score < 65
        ? "B1+"
        : score < 82
          ? "B2"
          : "B2+";
}
