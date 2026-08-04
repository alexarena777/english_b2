import type { ReviewItem } from "./types";
import { dateKey } from "./utils";

export type ReviewBucket = "due" | "scheduled" | "mastered";

export interface ReviewInsight {
  item: ReviewItem;
  bucket: ReviewBucket;
  daysUntilDue: number;
}

export interface ReviewSummary {
  total: number;
  due: number;
  scheduledNext7: number;
  mastered: number;
  averageMastery: number;
}

export interface ReviewForecastDay {
  date: string;
  label: string;
  count: number;
}

export function deriveReviewInsights(
  reviews: ReviewItem[],
  now = new Date(),
): ReviewInsight[] {
  return reviews
    .map((item) => {
      const dueAt = new Date(item.nextReviewAt);
      const bucket: ReviewBucket =
        dueAt.getTime() <= now.getTime()
          ? "due"
          : item.mastery >= 80
            ? "mastered"
            : "scheduled";
      return {
        item,
        bucket,
        daysUntilDue: calendarDayDifference(now, dueAt),
      };
    })
    .sort((left, right) => {
      const bucketOrder = { due: 0, scheduled: 1, mastered: 2 };
      return (
        bucketOrder[left.bucket] - bucketOrder[right.bucket] ||
        new Date(left.item.nextReviewAt).getTime() -
          new Date(right.item.nextReviewAt).getTime() ||
        left.item.topic.localeCompare(right.item.topic)
      );
    });
}

export function summarizeReviews(
  reviews: ReviewItem[],
  now = new Date(),
): ReviewSummary {
  const endOfWindow = startOfLocalDay(now);
  endOfWindow.setDate(endOfWindow.getDate() + 7);
  endOfWindow.setMilliseconds(-1);

  return {
    total: reviews.length,
    due: reviews.filter(
      (item) => new Date(item.nextReviewAt).getTime() <= now.getTime(),
    ).length,
    scheduledNext7: reviews.filter((item) => {
      const dueAt = new Date(item.nextReviewAt).getTime();
      return dueAt > now.getTime() && dueAt <= endOfWindow.getTime();
    }).length,
    mastered: reviews.filter(
      (item) =>
        item.mastery >= 80 &&
        new Date(item.nextReviewAt).getTime() > now.getTime(),
    ).length,
    averageMastery: reviews.length
      ? Math.round(
          reviews.reduce((total, item) => total + item.mastery, 0) /
            reviews.length,
        )
      : 0,
  };
}

export function buildReviewForecast(
  reviews: ReviewItem[],
  now = new Date(),
  days = 7,
): ReviewForecastDay[] {
  const start = startOfLocalDay(now);
  const forecast = Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index);
    return {
      date: dateKey(date),
      label:
        index === 0
          ? "Oggi"
          : new Intl.DateTimeFormat("it-IT", { weekday: "short" })
              .format(date)
              .replace(".", ""),
      count: 0,
    };
  });
  if (!forecast.length) return forecast;

  const counts = new Map(forecast.map((day) => [day.date, 0]));
  const lastDate = forecast.at(-1)!.date;
  reviews.forEach((item) => {
    const dueAt = new Date(item.nextReviewAt);
    const key = dueAt < start ? forecast[0].date : dateKey(dueAt);
    if (key <= lastDate && counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  });

  return forecast.map((day) => ({ ...day, count: counts.get(day.date) ?? 0 }));
}

export function reviewDueLabel(item: ReviewItem, now = new Date()) {
  const dueAt = new Date(item.nextReviewAt);
  const difference = calendarDayDifference(now, dueAt);
  if (difference < 0) {
    const days = Math.abs(difference);
    return `In ritardo di ${days} ${days === 1 ? "giorno" : "giorni"}`;
  }
  if (difference === 0) {
    return dueAt.getTime() <= now.getTime() ? "Da ripassare ora" : "Più tardi oggi";
  }
  if (difference === 1) return "Domani";
  return `Tra ${difference} giorni`;
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calendarDayDifference(from: Date, to: Date) {
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / 86_400_000);
}
