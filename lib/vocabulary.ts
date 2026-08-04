import type { VocabularyWordProgress } from "./types";

export function updateVocabularyRecall(
  previous: VocabularyWordProgress | undefined,
  wordId: string,
  correct: boolean,
  now = new Date(),
): VocabularyWordProgress {
  const correctStreak = correct ? (previous?.correctStreak ?? 0) + 1 : 0;
  const mastery = Math.max(
    0,
    Math.min(100, (previous?.mastery ?? 25) + (correct ? 20 : -15)),
  );
  const intervalDays = correct
    ? [3, 7, 14, 30][Math.min(Math.max(correctStreak - 1, 0), 3)]
    : 1;
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return {
    wordId,
    status: mastery >= 80 ? "mastered" : "learning",
    correctStreak,
    mastery,
    correctRecall: (previous?.correctRecall ?? 0) + (correct ? 1 : 0),
    incorrectRecall: (previous?.incorrectRecall ?? 0) + (correct ? 0 : 1),
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReview.toISOString(),
  };
}

export function vocabularyStatusProgress(
  previous: VocabularyWordProgress | undefined,
  wordId: string,
  status: "learning" | "mastered",
  now = new Date(),
): VocabularyWordProgress {
  if (status === "learning") {
    return {
      wordId,
      status,
      correctStreak: previous?.correctStreak ?? 0,
      mastery: Math.min(previous?.mastery ?? 25, 79),
      correctRecall: previous?.correctRecall ?? 0,
      incorrectRecall: previous?.incorrectRecall ?? 0,
      lastReviewedAt: previous?.lastReviewedAt,
      nextReviewAt:
        previous?.status === "learning"
          ? previous.nextReviewAt ?? now.toISOString()
          : now.toISOString(),
    };
  }

  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + 30);
  return {
    wordId,
    status,
    correctStreak: Math.max(previous?.correctStreak ?? 0, 3),
    mastery: 100,
    correctRecall: previous?.correctRecall ?? 0,
    incorrectRecall: previous?.incorrectRecall ?? 0,
    lastReviewedAt: previous?.lastReviewedAt,
    nextReviewAt: nextReview.toISOString(),
  };
}
