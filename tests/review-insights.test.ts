import { describe, expect, it } from "vitest";
import {
  buildReviewForecast,
  deriveReviewInsights,
  reviewDueLabel,
  summarizeReviews,
} from "@/lib/review-insights";
import type { ReviewItem } from "@/lib/types";

function review(
  id: string,
  nextReviewAt: string,
  mastery = 40,
): ReviewItem {
  return {
    id,
    exerciseId: `exercise-${id}`,
    question: "Test question",
    givenAnswer: "wrong",
    correctAnswer: "correct",
    topic: `Topic ${id}`,
    errorCount: 1,
    correctStreak: 0,
    mastery,
    lastErrorAt: "2026-07-30T10:00:00.000Z",
    nextReviewAt,
  };
}

const now = new Date("2026-08-01T12:00:00.000Z");

describe("analisi dei ripassi", () => {
  const reviews = [
    review("late", "2026-07-31T10:00:00.000Z", 90),
    review("due", "2026-08-01T11:00:00.000Z", 30),
    review("tomorrow", "2026-08-02T10:00:00.000Z", 45),
    review("mastered", "2026-08-05T10:00:00.000Z", 85),
    review("later", "2026-08-12T10:00:00.000Z", 55),
  ];

  it("separa scaduti, programmati e consolidati dando priorità agli scaduti", () => {
    const insights = deriveReviewInsights(reviews, now);

    expect(insights.map((insight) => insight.bucket)).toEqual([
      "due",
      "due",
      "scheduled",
      "scheduled",
      "mastered",
    ]);
    expect(insights[0].item.id).toBe("late");
  });

  it("calcola il carico dei prossimi sette giorni", () => {
    const summary = summarizeReviews(reviews, now);

    expect(summary).toMatchObject({
      total: 5,
      due: 2,
      scheduledNext7: 2,
      mastered: 1,
      averageMastery: 61,
    });
  });

  it("porta gli arretrati su oggi nella previsione", () => {
    const forecast = buildReviewForecast(reviews, now);

    expect(forecast).toHaveLength(7);
    expect(forecast[0]).toMatchObject({ date: "2026-08-01", count: 2 });
    expect(forecast[1]).toMatchObject({ date: "2026-08-02", count: 1 });
    expect(forecast[4]).toMatchObject({ date: "2026-08-05", count: 1 });
  });

  it("descrive la scadenza in modo comprensibile", () => {
    expect(reviewDueLabel(reviews[0], now)).toBe("In ritardo di 1 giorno");
    expect(reviewDueLabel(reviews[1], now)).toBe("Da ripassare ora");
    expect(
      reviewDueLabel(review("today", "2026-08-01T15:00:00.000Z"), now),
    ).toBe("Più tardi oggi");
    expect(reviewDueLabel(reviews[2], now)).toBe("Domani");
    expect(reviewDueLabel(reviews[3], now)).toBe("Tra 4 giorni");
  });
});
